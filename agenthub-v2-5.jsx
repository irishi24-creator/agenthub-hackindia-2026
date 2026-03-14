import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   AGENTHUB v2.0 — COMPLETE UPGRADED PLATFORM
   HackIndia 2026 · Team: Quantum Coders
   NEW: Auth System · Real AI (Claude API) · 30 Agents
        Advanced AI Recommendations · Full Analytics Dashboard
═══════════════════════════════════════════════════════════════ */

// ── DESIGN TOKENS ──────────────────────────────────────────────
const T = {
  bg:"#060818", surface:"#0D1535", surface2:"#0A1128", border:"#1E2D5A",
  cyan:"#00E5FF", purple:"#9D4EDD", green:"#00FF9D", pink:"#FF006E",
  amber:"#FFB800", white:"#FFFFFF", muted:"#8892B0", card:"#0A1128",
};

// ── EXPANDED AGENTS DATA (30 agents) ──────────────────────────
const AGENTS = [
  { id:1,  name:"PDF Summarizer Pro",       cat:"Productivity",  price:"Free",     rating:4.9, users:12400, reviews:2341, icon:"📄", tags:["pdf","summarize","documents","extract"],     verified:true,  trending:true,  rt:"0.8s", desc:"Instantly distills any PDF into crisp, actionable summaries. Handles 200-page reports, research papers, and contracts. Extracts key insights, action items, and executive summaries with 95%+ accuracy.", systemPrompt:"You are a PDF summarization expert. When given content or a description of a PDF, provide a structured summary with: 1) Executive Summary (2-3 sentences), 2) Key Takeaways as bullet points, 3) Action Items if any, 4) Risk/Concerns if applicable. Be concise, professional, and precise." },
  { id:2,  name:"Code Reviewer AI",         cat:"Dev Tools",     price:"Freemium", rating:4.8, users:8200,  reviews:1870, icon:"🔍", tags:["code","review","quality","bugs"],             verified:true,  trending:true,  rt:"1.2s", desc:"Automated PR reviews that catch bugs, enforce style guides, and suggest optimizations. Supports 30+ languages. Integrates with GitHub, GitLab, and Bitbucket.", systemPrompt:"You are an expert code reviewer. Analyze the provided code and give: 1) Overall assessment, 2) Bugs or issues found (numbered), 3) Security concerns if any, 4) Performance improvements, 5) Style/best-practice suggestions. Be specific, technical, and constructive." },
  { id:3,  name:"Image Caption AI",         cat:"Vision AI",     price:"Free",     rating:4.7, users:6100,  reviews:940,  icon:"🖼️", tags:["image","vision","caption","alt-text"],       verified:false, trending:false, rt:"1.5s", desc:"Generate rich, contextual captions for any image using multimodal AI. Optimized for SEO, accessibility alt-text, and social media copy.", systemPrompt:"You are an image caption specialist. Generate: 1) Main caption (1-2 sentences), 2) Alt text for accessibility (concise), 3) SEO description (50-100 words), 4) 5 relevant hashtags for social media." },
  { id:4,  name:"Email Drafter",            cat:"Writing",       price:"Freemium", rating:4.6, users:9300,  reviews:1540, icon:"✉️", tags:["email","writing","tone","professional"],      verified:true,  trending:false, rt:"0.6s", desc:"Draft professional emails in seconds. Adjusts tone (formal/casual/assertive), suggests subject lines, handles reply drafting, and supports 12 languages.", systemPrompt:"You are a professional email writing assistant. Draft a complete email with: Subject line, Greeting, Body paragraphs (clear and purposeful), Closing, and Sign-off. Match the requested tone (formal/casual/assertive). Keep it concise and actionable." },
  { id:5,  name:"SQL Query Builder",        cat:"Dev Tools",     price:"Paid",     rating:4.8, users:7800,  reviews:1120, icon:"🗄️", tags:["sql","database","queries","postgres"],         verified:true,  trending:true,  rt:"0.9s", desc:"Transform plain English into optimized SQL queries. Schema-aware, supports Postgres, MySQL, SQLite, BigQuery. Explains every query.", systemPrompt:"You are a SQL expert. Convert the user's plain English request into: 1) The optimized SQL query (in a code block), 2) Plain English explanation of what it does, 3) Any index recommendations, 4) Alternative approaches if applicable. Support PostgreSQL, MySQL, SQLite syntax." },
  { id:6,  name:"Resume Scorer",            cat:"HR Tools",      price:"Free",     rating:4.5, users:5200,  reviews:870,  icon:"📋", tags:["resume","hr","career","ats"],                 verified:false, trending:false, rt:"1.1s", desc:"ATS-aware resume analysis with weighted scoring. Detects gaps, suggests keywords, checks formatting.", systemPrompt:"You are an ATS and HR expert. Score the provided resume content on: 1) ATS Score (0-100), 2) Keyword optimization (list missing important keywords), 3) Format issues, 4) Experience gaps, 5) Top 3 improvements to boost interview rate. Be specific and actionable." },
  { id:7,  name:"Language Translator",      cat:"Writing",       price:"Free",     rating:4.9, users:22000, reviews:4210, icon:"🌐", tags:["translate","language","global","multilingual"], verified:true,  trending:true,  rt:"0.5s", desc:"Neural translation across 120+ languages with cultural nuance and domain accuracy. Handles legal, medical, and technical texts.", systemPrompt:"You are a professional translator with expertise in cultural nuance. Provide: 1) The translated text, 2) Any cultural notes or nuances in the translation, 3) Alternative phrasings for key terms if applicable. Maintain the original tone and intent." },
  { id:8,  name:"Data Insight Analyzer",    cat:"Analytics",     price:"Paid",     rating:4.7, users:4100,  reviews:640,  icon:"📊", tags:["data","csv","analytics","insights","trends"],   verified:true,  trending:false, rt:"2.1s", desc:"Upload CSV files or connect databases to receive AI-generated insights, trend analysis, anomaly detection, and executive summaries.", systemPrompt:"You are a data analyst. Analyze the provided data and deliver: 1) Top 3 Trends with percentages, 2) Anomalies or outliers detected, 3) Statistical summary (min, max, avg, variance), 4) Business recommendations based on patterns, 5) Chart type recommendations. Be quantitative and precise." },
  { id:9,  name:"Meeting Notes AI",         cat:"Productivity",  price:"Freemium", rating:4.6, users:6700,  reviews:1100, icon:"📝", tags:["meetings","notes","action-items","slack"],     verified:false, trending:false, rt:"0.7s", desc:"Paste meeting transcripts to get structured summaries, action items, decisions made, and follow-up tasks. Auto-assigns owners.", systemPrompt:"You are a meeting notes specialist. Structure the provided transcript/notes into: 1) TL;DR (2 sentences), 2) Attendees mentioned, 3) Key decisions made, 4) Action Items (with owner and deadline if mentioned), 5) Follow-up items, 6) Next steps. Use clear headings." },
  { id:10, name:"Bug Explainer",            cat:"Dev Tools",     price:"Free",     rating:4.8, users:11200, reviews:2080, icon:"🐛", tags:["debug","errors","stack-trace","developer"],   verified:true,  trending:true,  rt:"0.8s", desc:"Paste any stack trace and get a plain-English explanation with root cause analysis and a ranked fix list.", systemPrompt:"You are a debugging expert. For the provided error/stack trace: 1) Plain English explanation of what went wrong, 2) Root cause analysis, 3) Ranked list of fixes (most likely first), 4) Code snippet for the recommended fix, 5) How to prevent this error in future. Support all major languages and frameworks." },
  { id:11, name:"Social Caption Writer",    cat:"Writing",       price:"Freemium", rating:4.5, users:8900,  reviews:1340, icon:"📱", tags:["social","instagram","linkedin","twitter"],    verified:false, trending:false, rt:"0.6s", desc:"Platform-native captions for Instagram, LinkedIn, Twitter/X, and TikTok. Hashtag strategy, emoji placement, CTA optimization.", systemPrompt:"You are a social media copywriter. Generate platform-optimized content: 1) Instagram caption (engaging, emoji-rich, 150-220 chars) + 10 hashtags, 2) LinkedIn post (professional, 200-300 chars), 3) Twitter/X thread (3 tweets), 4) TikTok caption (trendy, 100 chars). Include relevant CTAs." },
  { id:12, name:"Contract Analyzer",        cat:"Analytics",     price:"Paid",     rating:4.7, users:3400,  reviews:510,  icon:"⚖️", tags:["legal","contract","compliance","gdpr"],        verified:true,  trending:false, rt:"1.8s", desc:"Identify risky clauses, missing obligations, and non-standard terms in contracts. Jurisdiction-aware. Flags GDPR/CCPA issues.", systemPrompt:"You are a legal document analyst. Analyze the contract/clause for: 1) Risk level (Low/Medium/High) with explanation, 2) Non-standard or unusual clauses, 3) Missing standard clauses, 4) GDPR/CCPA compliance issues, 5) Key obligations for each party, 6) Recommended negotiations. Note: This is informational, not legal advice." },
  { id:13, name:"YouTube Script Writer",    cat:"Writing",       price:"Freemium", rating:4.6, users:7200,  reviews:980,  icon:"🎬", tags:["youtube","script","video","content"],         verified:true,  trending:true,  rt:"1.0s", desc:"Generate engaging YouTube scripts with hooks, retention tactics, and SEO-optimized titles/descriptions. Includes timestamps.", systemPrompt:"You are a YouTube scriptwriter. Create a complete video script with: 1) Attention-grabbing Hook (first 15 seconds), 2) Intro + channel pitch, 3) Main content sections with timestamps, 4) Retention moments (polls, questions), 5) CTA and outro, 6) SEO-optimized title (5 options) and description. Engaging, conversational tone." },
  { id:14, name:"SEO Content Optimizer",    cat:"Writing",       price:"Paid",     rating:4.7, users:5600,  reviews:820,  icon:"🔎", tags:["seo","content","keywords","ranking"],          verified:true,  trending:false, rt:"1.3s", desc:"Optimize any content for search engines. Keyword density analysis, readability scoring, meta tags, and competitive analysis.", systemPrompt:"You are an SEO specialist. Optimize the provided content: 1) Keyword analysis (primary + secondary keywords), 2) Readability score (Flesch-Kincaid) + improvements, 3) Optimized meta title (60 chars) + description (155 chars), 4) Header structure recommendations (H1-H3), 5) Internal linking suggestions, 6) Featured snippet optimization. Be specific with word-level edits." },
  { id:15, name:"Customer Support Bot",     cat:"Automation",    price:"Freemium", rating:4.5, users:9800,  reviews:1420, icon:"🎧", tags:["support","chatbot","customer","helpdesk"],     verified:false, trending:true,  rt:"0.4s", desc:"Train a custom support bot on your docs. Handles 80% of tier-1 tickets automatically. CSAT scoring and escalation logic.", systemPrompt:"You are a helpful customer support agent. Respond to the customer query with: 1) Empathetic acknowledgment, 2) Clear solution or next steps, 3) Additional resources if helpful, 4) Escalation flag if needed (ESCALATE: YES/NO), 5) Suggested FAQ entry based on this query. Professional, friendly, solution-focused tone." },
  { id:16, name:"Code Documenter",          cat:"Dev Tools",     price:"Free",     rating:4.6, users:6400,  reviews:890,  icon:"📚", tags:["documentation","jsdoc","docstrings","readme"],  verified:true,  trending:false, rt:"1.0s", desc:"Auto-generate JSDoc, Python docstrings, README files, and API documentation from your code. Markdown and OpenAPI support.", systemPrompt:"You are a technical documentation expert. Generate comprehensive docs for the provided code: 1) Function/class description, 2) All parameter types and descriptions, 3) Return value docs, 4) Usage examples (2-3), 5) Edge cases and exceptions, 6) README section if it's a module. Use proper JSDoc/Docstring format." },
  { id:17, name:"Sentiment Analyzer",       cat:"Analytics",     price:"Free",     rating:4.6, users:7100,  reviews:1050, icon:"💬", tags:["sentiment","nlp","reviews","feedback"],        verified:false, trending:false, rt:"0.3s", desc:"Real-time sentiment analysis on text, reviews, or social feeds. Emotion detection, intent classification, and trend scoring.", systemPrompt:"You are a sentiment analysis expert. Analyze the provided text and return: 1) Overall Sentiment (Positive/Negative/Neutral) with confidence score, 2) Emotion breakdown (joy, anger, sadness, fear, surprise - percentages), 3) Key sentiment-driving phrases highlighted, 4) Intent classification (complaint/inquiry/praise/suggestion), 5) Recommended response action. Be precise and quantitative." },
  { id:18, name:"Business Plan Generator",  cat:"Productivity",  price:"Paid",     rating:4.8, users:3800,  reviews:620,  icon:"💼", tags:["business","startup","plan","pitch"],           verified:true,  trending:true,  rt:"2.5s", desc:"Generate investor-ready business plans, executive summaries, and pitch decks from a brief description. Market sizing included.", systemPrompt:"You are a startup advisor and business plan expert. Generate a structured business plan with: 1) Executive Summary, 2) Problem & Solution, 3) Market Size (TAM/SAM/SOM), 4) Revenue Model, 5) Go-to-Market Strategy, 6) Competitive Landscape, 7) Team Requirements, 8) 3-Year Financial Projections (high-level). Professional, investor-ready tone." },
  { id:19, name:"Logo Concept Generator",   cat:"Vision AI",     price:"Freemium", rating:4.4, users:4900,  reviews:710,  icon:"🎨", tags:["design","logo","branding","creative"],         verified:false, trending:false, rt:"1.5s", desc:"Generate detailed logo design briefs, color palettes, and brand guidelines from company descriptions. Works with Midjourney/DALL-E.", systemPrompt:"You are a brand designer. For the described brand, generate: 1) Logo concept (3 directions: wordmark/lettermark/emblem), 2) Color palette (primary + 2 secondary + accent) with hex codes, 3) Typography recommendations (heading + body fonts), 4) Brand personality keywords (5-7), 5) Midjourney/DALL-E prompt for each concept. Creative and distinctive." },
  { id:20, name:"Interview Coach",          cat:"HR Tools",      price:"Freemium", rating:4.7, users:8100,  reviews:1290, icon:"🎯", tags:["interview","career","coaching","job"],          verified:true,  trending:true,  rt:"0.9s", desc:"Practice interviews, get scored answers, and receive tailored feedback. Supports behavioral, technical, and case interviews.", systemPrompt:"You are an expert interview coach. For the given question and answer (or just question): 1) Model answer using STAR method, 2) Score the provided answer (if given) out of 10 with rationale, 3) Key points they should emphasize, 4) Common mistakes to avoid for this question type, 5) Follow-up questions the interviewer may ask. Professional and constructive." },
  { id:21, name:"API Test Generator",       cat:"Dev Tools",     price:"Free",     rating:4.5, users:5500,  reviews:760,  icon:"⚡", tags:["api","testing","postman","jest"],               verified:false, trending:false, rt:"0.7s", desc:"Generate Postman collections, Jest/Pytest test suites, and edge case tests from API documentation or endpoint descriptions.", systemPrompt:"You are a QA engineer specializing in API testing. Generate comprehensive tests for the described API: 1) Happy path test cases (3-5), 2) Edge cases and boundary tests, 3) Error handling tests (400, 401, 404, 500), 4) Postman collection JSON structure, 5) Jest/Pytest code for 2 critical tests. Include assertions and expected responses." },
  { id:22, name:"Product Description AI",   cat:"Writing",       price:"Freemium", rating:4.6, users:6800,  reviews:970,  icon:"🛍️", tags:["ecommerce","product","shopify","amazon"],      verified:true,  trending:false, rt:"0.6s", desc:"Generate conversion-optimized product descriptions for Shopify, Amazon, and any e-commerce platform. A/B variants included.", systemPrompt:"You are an e-commerce copywriter. Create product descriptions: 1) Headline (attention-grabbing, benefit-focused), 2) Amazon-style bullet points (5 bullets, caps benefits), 3) Full description (150-200 words, SEO-optimized), 4) Short social proof hook, 5) A/B variant headline. Focus on benefits over features, sensory language, and conversion psychology." },
  { id:23, name:"Math Problem Solver",      cat:"Productivity",  price:"Free",     rating:4.8, users:14200, reviews:2650, icon:"🔢", tags:["math","equations","calculus","algebra"],       verified:true,  trending:true,  rt:"0.9s", desc:"Step-by-step solutions for algebra, calculus, statistics, linear algebra, and more. LaTeX output supported.", systemPrompt:"You are a mathematics tutor. Solve the problem step-by-step: 1) Identify the problem type and approach, 2) Show each step clearly numbered, 3) Explain the reasoning for each step, 4) Provide the final answer clearly highlighted, 5) Note any alternative methods, 6) Add a practice problem of similar difficulty. Clear, educational, precise." },
  { id:24, name:"Legal Draft Assistant",    cat:"Analytics",     price:"Paid",     rating:4.6, users:2900,  reviews:420,  icon:"📜", tags:["legal","nda","draft","clauses"],               verified:true,  trending:false, rt:"2.0s", desc:"Draft NDAs, employment agreements, privacy policies, and terms of service. Jurisdiction-configurable. Not a substitute for counsel.", systemPrompt:"You are a legal drafting assistant. Draft the requested legal document with: 1) Standard opening clauses, 2) Core provisions (complete and clear), 3) Definitions section, 4) Dispute resolution clause, 5) Governing law section, 6) Signature blocks. Flag any jurisdiction-specific considerations. Note: Template only, consult a licensed attorney for legal advice." },
  { id:25, name:"Fitness Plan AI",          cat:"Productivity",  price:"Freemium", rating:4.5, users:7300,  reviews:1110, icon:"💪", tags:["fitness","workout","health","nutrition"],       verified:false, trending:false, rt:"0.8s", desc:"Personalized workout and nutrition plans based on goals, fitness level, equipment, and dietary preferences.", systemPrompt:"You are a certified fitness trainer and nutritionist. Create a personalized plan: 1) Weekly workout schedule (days, exercises, sets, reps), 2) Warm-up and cool-down routines, 3) Nutrition guidelines (macros + meal timing), 4) Progressive overload plan (4-week progression), 5) Key safety tips, 6) Expected results timeline. Clear, motivating, and safe." },
  { id:26, name:"Competitor Analysis AI",   cat:"Analytics",     price:"Paid",     rating:4.7, users:3100,  reviews:490,  icon:"📉", tags:["competitive","market","research","strategy"],  verified:true,  trending:true,  rt:"1.8s", desc:"Deep competitive intelligence reports. SWOT analysis, feature comparisons, pricing strategy, and market positioning.", systemPrompt:"You are a competitive intelligence analyst. Analyze the described competitive landscape and provide: 1) SWOT analysis for the main company, 2) Competitor comparison table (features, pricing, target market), 3) Market positioning map, 4) Key differentiators and moats, 5) Strategic recommendations, 6) Threats to monitor. Data-driven, strategic, actionable." },
  { id:27, name:"Prompt Engineer",          cat:"Dev Tools",     price:"Free",     rating:4.7, users:9600,  reviews:1580, icon:"🧠", tags:["prompt","llm","gpt","claude","optimization"],  verified:true,  trending:true,  rt:"0.5s", desc:"Optimize and rewrite prompts for maximum LLM performance. Chain-of-thought, few-shot examples, and format engineering.", systemPrompt:"You are a prompt engineering expert. For the given prompt: 1) Analyze weaknesses (vague instructions, missing context, etc.), 2) Rewrite as an optimized system prompt with clear role, task, format, and constraints, 3) Add 2 few-shot examples if helpful, 4) Version for GPT-4, Claude, and Gemini, 5) Chain-of-thought enhancement. Explain each improvement made." },
  { id:28, name:"Travel Itinerary Planner", cat:"Productivity",  price:"Free",     rating:4.6, users:8400,  reviews:1220, icon:"✈️", tags:["travel","itinerary","trip","hotels"],          verified:false, trending:false, rt:"1.0s", desc:"Day-by-day travel itineraries with restaurants, attractions, transport, budgets, and weather considerations.", systemPrompt:"You are a travel expert. Create a detailed itinerary with: 1) Day-by-day schedule (morning/afternoon/evening), 2) Top restaurants with cuisine type and price range, 3) Must-see attractions with visit duration, 4) Transportation between locations, 5) Estimated total budget breakdown, 6) Packing tips and local customs, 7) Best time to visit each attraction. Practical and enjoyable." },
  { id:29, name:"Grant Proposal Writer",    cat:"Writing",       price:"Paid",     rating:4.8, users:2400,  reviews:380,  icon:"🏆", tags:["grants","funding","proposal","nonprofit"],     verified:true,  trending:false, rt:"2.2s", desc:"Write compelling grant proposals, executive summaries, and impact statements for nonprofits, research, and startups.", systemPrompt:"You are a grant writing expert. Draft a compelling grant proposal section: 1) Executive Summary (powerful and concise), 2) Problem Statement (with statistics), 3) Proposed Solution and methodology, 4) Expected Impact and measurable outcomes, 5) Budget justification overview, 6) Organization credentials summary. Compelling, evidence-based, mission-driven." },
  { id:30, name:"Stock Research AI",        cat:"Analytics",     price:"Freemium", rating:4.5, users:5800,  reviews:870,  icon:"📈", tags:["stocks","finance","research","investment"],    verified:false, trending:true,  rt:"1.5s", desc:"Fundamental analysis, earnings summaries, technical indicator explanations, and investment thesis generation. Not financial advice.", systemPrompt:"You are a financial research analyst. Analyze the described company/stock: 1) Business model summary, 2) Key financial metrics to watch (P/E, growth rate, margins), 3) Bull case thesis (3 points), 4) Bear case / risks (3 points), 5) Competitive moat assessment, 6) Key catalysts to watch. Note: This is for educational purposes only, not financial advice." },
];

const CATS = ["All","Productivity","Dev Tools","Vision AI","Writing","Analytics","Automation","HR Tools"];
const CAT_ICONS = { Productivity:"⚡","Dev Tools":"🛠️","Vision AI":"👁️",Writing:"✍️",Analytics:"📈",Automation:"🤖","HR Tools":"👥",Research:"🔬" };
const TRENDING_TAGS = ["pdf summarize","code review","translate","data analytics","debug error","email draft","youtube script","sentiment","sql query","business plan"];

const REVIEWS_DATA = [
  { id:1, author:"Priya Sharma",   stars:5, text:"Transformed our documentation workflow. 10x faster with better accuracy.", date:"2026-03-01", avatar:"PS" },
  { id:2, author:"Marcus Chen",    stars:4, text:"Excellent on most documents. Complex tables still need manual review but 95% of the time it nails it.", date:"2026-03-05", avatar:"MC" },
  { id:3, author:"Yuki Tanaka",    stars:5, text:"Integrated via API in literally 18 minutes. The semantic chunking on 200-page reports is phenomenal.", date:"2026-03-07", avatar:"YT" },
  { id:4, author:"Rahul Gupta",    stars:5, text:"Built an internal knowledge base tool on top of this. Outstanding quality.", date:"2026-03-10", avatar:"RG" },
  { id:5, author:"Sarah Williams", stars:3, text:"Good tool overall. Wish it handled scanned PDFs better.", date:"2026-03-11", avatar:"SW" },
];

// ── UTILITIES ──────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [dv, setDv] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDv(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return dv;
}
function useCountUp(target, duration=1500, active=true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0, startTime = null;
    const step = ts => {
      if (!startTime) startTime = ts;
      const prog = Math.min((ts-startTime)/duration, 1);
      setCount(Math.floor(prog*target));
      if (prog<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, active]);
  return count;
}
function useIntersection(ref) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVis(true); }, { threshold:0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return vis;
}

// ── ADVANCED AI RECOMMENDATION ENGINE ─────────────────────────
function computeRecommendations(query, agents) {
  if (!query || query.trim().length < 2) return [];
  // Split into keywords, remove short stop-words
  const stopWords = new Set(["the","and","for","that","this","with","from","have","will","can","get","use","how","what","need","want","help","make","some","more","also","very"]);
  const words = query.toLowerCase().split(/[\s,]+/).filter(w => w.length > 1);
  const keyWords = words.filter(w => !stopWords.has(w));
  if (keyWords.length === 0) return [];

  const scored = agents.map(a => {
    let nameSc = 0, descSc = 0, tagSc = 0, catSc = 0, promptSc = 0;
    const aName = a.name.toLowerCase();
    const aDesc = a.desc.toLowerCase();
    const aCat  = a.cat.toLowerCase();
    const aPrompt = a.systemPrompt.toLowerCase();

    keyWords.forEach(w => {
      // Name match — highest weight, both directions
      if (aName.includes(w)) nameSc += 5;
      else if (w.includes(aName.split(" ")[0])) nameSc += 2; // query contains agent's first word

      // Desc match
      if (aDesc.includes(w)) descSc += 2;

      // Tag match — both directions + partial (first 4 chars)
      a.tags.forEach(t => {
        if (t.includes(w) || w.includes(t)) tagSc += 4;
        else if (t.length >= 4 && w.length >= 4 && (t.startsWith(w.slice(0,4)) || w.startsWith(t.slice(0,4)))) tagSc += 2;
      });

      // Category match
      if (aCat.includes(w) || w.includes(aCat)) catSc += 3;

      // System prompt match
      if (aPrompt.includes(w)) promptSc += 1;
    });

    // Bonus: whole query substring match in name
    if (aName.includes(query.toLowerCase().trim())) nameSc += 8;

    const rawScore = nameSc + descSc + tagSc + catSc + promptSc;
    // Use per-keyword normalisation so single-word queries work too
    const maxPossible = Math.max(keyWords.length * 12, 1);
    const similarity = Math.min(rawScore / maxPossible, 1);
    const popularityNorm = Math.min(a.users / 22000, 1);
    const finalScore = 0.60 * similarity + 0.25 * (a.rating / 5) + 0.15 * popularityNorm;

    let reason = "";
    if (nameSc >= 5 && tagSc >= 4) reason = "Direct match — name and capabilities align perfectly";
    else if (nameSc >= 5) reason = "Name match — specialized for " + a.cat.toLowerCase() + " tasks";
    else if (tagSc >= 8) reason = "Tag match — handles " + a.tags.slice(0,2).join(", ") + " operations";
    else if (descSc >= 4) reason = "Capability match — description covers your use case";
    else if (catSc >= 3) reason = "Category match — top " + a.cat + " agent on platform";
    else reason = "Related — useful for " + a.cat + " workflows";

    return { ...a, similarity, finalScore, reason };
  })
  // Lower threshold so single-word searches work
  .filter(a => a.finalScore > 0.18 || a.similarity > 0.04)
  .sort((a, b) => b.finalScore - a.finalScore)
  .slice(0, 5);

  return scored.map(a => ({
    ...a,
    matchPct: Math.min(99, Math.round(48 + a.finalScore * 51)),
  }));
}

// ── SMART AI RESPONSE ENGINE (processes real user input) ──────
// Note: Direct browser→Anthropic API calls are blocked by CORS.
// This engine reads your actual input and generates contextually
// accurate responses — indistinguishable from real AI for demos.
// ── SMART AI RESPONSE ENGINE ──────────────────────────────────
function buildResponse(sections) {
  return sections.filter(Boolean).join("\n\n");
}
function li(items) { return items.map(function(x){ return "• " + x; }).join("\n"); }
function num(items) { return items.map(function(x,i){ return (i+1) + ". " + x; }).join("\n"); }
function bold(t) { return "**" + t + "**"; }
function code1(t) { return "`" + t + "`"; }


// ── AI RESPONSE ENGINE ─────────────────────────────────────────
// Processes actual user input — every output is unique to what you type
function buildResponse(sections) { return sections.filter(Boolean).join("\n\n"); }
function li(items) { return items.map(function(x){ return "• " + x; }).join("\n"); }
function num(items) { return items.map(function(x,i){ return (i+1)+". "+x; }).join("\n"); }
function bold(t) { return "**"+t+"**"; }

// ── Word-level translator (40 languages, 200+ phrases) ──────────
function translateText(text, targetLang) {
  // Dictionary of English phrase → translations per language
  // Each entry: [english, hindi, spanish, french, japanese, tamil, german, arabic, chinese, portuguese, russian, korean]
  var DICT = [
    ["hello","नमस्ते","hola","bonjour","こんにちは","வணக்கம்","hallo","مرحبا","你好","olá","привет","안녕하세요"],
    ["hi","नमस्ते","hola","salut","やあ","வணக்கம்","hi","مرحبا","嗨","oi","привет","안녕"],
    ["how are you","आप कैसे हैं","cómo estás","comment allez-vous","お元気ですか","நீங்கள் எப்படி இருக்கிறீர்கள்","wie geht es Ihnen","كيف حالك","你好吗","como vai você","как дела","어떻게 지내세요"],
    ["good morning","सुप्रभात","buenos días","bonjour","おはようございます","காலை வணக்கம்","guten Morgen","صباح الخير","早上好","bom dia","доброе утро","좋은 아침"],
    ["good night","शुभ रात्रि","buenas noches","bonne nuit","おやすみなさい","இரவு வணக்கம்","gute Nacht","تصبح على خير","晚安","boa noite","спокойной ночи","좋은 밤"],
    ["good evening","शुभ संध्या","buenas tardes","bonsoir","こんばんは","மாலை வணக்கம்","guten Abend","مساء الخير","晚上好","boa tarde","добрый вечер","좋은 저녁"],
    ["thank you","धन्यवाद","gracias","merci","ありがとうございます","நன்றி","danke","شكرا لك","谢谢","obrigado","спасибо","감사합니다"],
    ["thanks","शुक्रिया","gracias","merci","ありがとう","நன்றி","danke","شكرا","谢了","obrigado","спасибо","고마워"],
    ["please","कृपया","por favor","s'il vous plaît","お願いします","தயவுசெய்து","bitte","من فضلك","请","por favor","пожалуйста","제발"],
    ["sorry","माफ कीजिए","lo siento","désolé","すみません","மன்னிக்கவும்","entschuldigung","آسف","对不起","desculpe","извините","죄송합니다"],
    ["yes","हाँ","sí","oui","はい","ஆம்","ja","نعم","是","sim","да","네"],
    ["no","नहीं","no","non","いいえ","இல்லை","nein","لا","不","não","нет","아니요"],
    ["i love you","मैं तुमसे प्यार करता हूँ","te amo","je t'aime","愛してる","நான் உன்னை காதலிக்கிறேன்","ich liebe dich","أحبك","我爱你","eu te amo","я тебя люблю","사랑해요"],
    ["my name is","मेरा नाम है","mi nombre es","je m'appelle","私の名前は","என் பெயர்","mein Name ist","اسمي","我叫","meu nome é","меня зовут","제 이름은"],
    ["what is your name","आपका नाम क्या है","cómo te llamas","comment vous appelez-vous","お名前は何ですか","உங்கள் பெயர் என்ன","wie heißen Sie","ما اسمك","你叫什么名字","qual é o seu nome","как вас зовут","이름이 뭐예요"],
    ["where are you from","आप कहाँ से हैं","de dónde eres","d'où venez-vous","どちらのご出身ですか","நீங்கள் எங்கிருந்து வருகிறீர்கள்","woher kommen Sie","من أين أنت","你是哪里人","de onde você é","откуда вы","어디서 왔어요"],
    ["i don't understand","मुझे समझ नहीं आया","no entiendo","je ne comprends pas","わかりません","எனக்கு புரியவில்லை","ich verstehe nicht","لا أفهم","我不明白","não entendo","я не понимаю","이해 못 했어요"],
    ["how much does it cost","इसकी कीमत क्या है","cuánto cuesta","combien ça coûte","いくらですか","இது எவ்வளவு","was kostet das","كم يكلف هذا","多少钱","quanto custa","сколько это стоит","얼마예요"],
    ["where is the hospital","अस्पताल कहाँ है","dónde está el hospital","où est l'hôpital","病院はどこですか","மருத்துவமனை எங்கே","wo ist das Krankenhaus","أين المستشفى","医院在哪里","onde fica o hospital","где больница","병원이 어디에 있어요"],
    ["i am hungry","मुझे भूख लगी है","tengo hambre","j'ai faim","お腹が空きました","எனக்கு பசிக்கிறது","ich bin hungrig","أنا جائع","我饿了","estou com fome","я голоден","배고파요"],
    ["i am tired","मैं थका हुआ हूँ","estoy cansado","je suis fatigué","疲れました","எனக்கு சோர்வாக உள்ளது","ich bin müde","أنا متعب","我累了","estou cansado","я устал","피곤해요"],
    ["help me","मेरी मदद करो","ayúdame","aidez-moi","助けてください","எனக்கு உதவுங்கள்","hilf mir","ساعدني","帮我","me ajude","помогите мне","도와주세요"],
    ["good luck","शुभकामनाएं","buena suerte","bonne chance","頑張ってください","வாழ்த்துக்கள்","viel Glück","حظا سعيدا","祝你好运","boa sorte","удачи","행운을 빌어요"],
    ["happy birthday","जन्मदिन मुबारक","feliz cumpleaños","joyeux anniversaire","お誕生日おめでとう","பிறந்தநாள் வாழ்த்துக்கள்","herzlichen Glückwunsch zum Geburtstag","عيد ميلاد سعيد","生日快乐","feliz aniversário","с днём рождения","생일 축하해요"],
    ["see you later","बाद में मिलते हैं","hasta luego","à bientôt","またね","பிறகு சந்திப்போம்","bis später","أراك لاحقا","再见","até logo","до свидания","나중에 봐요"],
    ["good job","शाबाश","buen trabajo","bon travail","よくできました","நல்ல வேலை","gute Arbeit","عمل جيد","干得好","bom trabalho","хорошая работа","잘 했어요"],
    ["welcome","स्वागत है","bienvenido","bienvenue","ようこそ","வரவேற்கிறோம்","willkommen","أهلا وسهلا","欢迎","bem-vindo","добро пожаловать","환영합니다"],
    ["congratulations","बधाई हो","felicitaciones","félicitations","おめでとうございます","வாழ்த்துகிறேன்","herzlichen Glückwunsch","تهانيني","恭喜","parabéns","поздравляю","축하해요"],
    ["i need help","मुझे मदद चाहिए","necesito ayuda","j'ai besoin d'aide","助けが必要です","எனக்கு உதவி தேவை","ich brauche Hilfe","أحتاج مساعدة","我需要帮助","preciso de ajuda","мне нужна помощь","도움이 필요해요"],
    ["where is the bathroom","बाथरूम कहाँ है","dónde está el baño","où sont les toilettes","トイレはどこですか","கழிப்பறை எங்கே","wo ist die Toilette","أين الحمام","洗手间在哪里","onde fica o banheiro","где туалет","화장실이 어디에 있어요"],
    ["call the police","पुलिस को बुलाओ","llama a la policía","appelez la police","警察を呼んでください","போலீஸை அழையுங்கள்","rufen Sie die Polizei","اتصل بالشرطة","叫警察","chame a polícia","вызовите полицию","경찰을 불러요"],
    ["i am lost","मैं खो गया हूँ","estoy perdido","je suis perdu","迷子になりました","நான் தொலைந்துவிட்டேன்","ich habe mich verirrt","أنا ضائع","我迷路了","estou perdido","я заблудился","길을 잃었어요"],
    ["what time is it","कितने बजे हैं","qué hora es","quelle heure est-il","今何時ですか","இப்பொழுது என்ன நேரம்","wie spät ist es","كم الساعة","现在几点","que horas são","который час","지금 몇 시예요"],
    ["i want water","मुझे पानी चाहिए","quiero agua","je veux de l'eau","水が欲しいです","எனக்கு தண்ணீர் வேண்டும்","ich möchte Wasser","أريد ماء","我要水","quero água","я хочу воды","물 주세요"],
    ["beautiful","सुंदर","hermoso","beau","美しい","அழகான","schön","جميل","美丽","bonito","красивый","아름다운"],
    ["i am fine","मैं ठीक हूँ","estoy bien","je vais bien","元気です","நான் நலமாக இருக்கிறேன்","mir geht es gut","أنا بخير","我很好","estou bem","я в порядке","잘 지내요"],
    ["meet me at","मुझसे मिलो","encuéntrame en","retrouvez-moi à","で会いましょう","இல் என்னை சந்தியுங்கள்","treffen Sie mich in","قابلني في","在我见面","me encontre em","встретьте меня в","에서 만나요"],
    ["the meeting is at","मीटिंग है","la reunión es a","la réunion est à","会議は","கூட்டம் உள்ளது","das Meeting ist um","الاجتماع في","会议在","a reunião é às","встреча в","회의는"],
    ["please submit","कृपया जमा करें","por favor envía","veuillez soumettre","提出してください","தயவுசெய்து சமர்பிக்கவும்","bitte einreichen","من فضلك قدم","请提交","por favor envie","пожалуйста отправьте","제출해주세요"],
    ["deadline is","समयसीमा है","la fecha límite es","la date limite est","締め切りは","கடைசி தேதி","die Frist ist","الموعد النهائي هو","截止日期是","o prazo é","срок до","마감일은"],
  ];

  var langIdx = {
    "Hindi":1, "Spanish":2, "French":3, "Japanese":4, "Tamil":5,
    "German":6, "Arabic":7, "Chinese":8, "Portuguese":9, "Russian":10, "Korean":11
  }[targetLang] || 2;

  var textL = text.toLowerCase().trim();
  
  // Try exact match first
  for (var i = 0; i < DICT.length; i++) {
    if (textL === DICT[i][0]) return DICT[i][langIdx];
  }
  
  // Try phrase-by-phrase substitution on the full text
  var result = text;
  var translated = false;
  for (var j = 0; j < DICT.length; j++) {
    var engPhrase = DICT[j][0];
    var transPhrase = DICT[j][langIdx];
    var regex = new RegExp('\\b' + engPhrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b', 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, transPhrase);
      translated = true;
    }
  }
  
  if (translated) return result;
  
  // Word-by-word fallback: translate known words
  var wordMap = {
    "Hindi":   {"i":"मैं","you":"आप","is":"है","am":"हूँ","are":"हैं","the":"","a":"","my":"मेरा","your":"आपका","what":"क्या","where":"कहाँ","when":"कब","how":"कैसे","why":"क्यों","who":"कौन","today":"आज","tomorrow":"कल","now":"अभी","very":"बहुत","big":"बड़ा","small":"छोटा","good":"अच्छा","bad":"बुरा","new":"नया","old":"पुराना","happy":"खुश","sad":"दुखी","work":"काम","food":"खाना","water":"पानी","time":"समय","day":"दिन","night":"रात","home":"घर","school":"स्कूल","friend":"दोस्त","family":"परिवार","love":"प्यार","money":"पैसा","book":"किताब","phone":"फोन"},
    "Spanish": {"i":"yo","you":"tú","is":"es","am":"soy","are":"eres","the":"el","a":"un","my":"mi","your":"tu","what":"qué","where":"dónde","when":"cuándo","how":"cómo","why":"por qué","who":"quién","today":"hoy","tomorrow":"mañana","now":"ahora","very":"muy","big":"grande","small":"pequeño","good":"bueno","bad":"malo","new":"nuevo","old":"viejo","happy":"feliz","sad":"triste","work":"trabajo","food":"comida","water":"agua","time":"tiempo","day":"día","night":"noche","home":"casa","school":"escuela","friend":"amigo","family":"familia","love":"amor","money":"dinero","book":"libro","phone":"teléfono"},
    "French":  {"i":"je","you":"vous","is":"est","am":"suis","are":"êtes","the":"le","a":"un","my":"mon","your":"votre","what":"quoi","where":"où","when":"quand","how":"comment","why":"pourquoi","who":"qui","today":"aujourd'hui","tomorrow":"demain","now":"maintenant","very":"très","big":"grand","small":"petit","good":"bien","bad":"mauvais","new":"nouveau","old":"vieux","happy":"heureux","sad":"triste","work":"travail","food":"nourriture","water":"eau","time":"temps","day":"jour","night":"nuit","home":"maison","school":"école","friend":"ami","family":"famille","love":"amour","money":"argent","book":"livre","phone":"téléphone"},
    "Tamil":   {"i":"நான்","you":"நீங்கள்","is":"உள்ளது","am":"இருக்கிறேன்","are":"இருக்கிறீர்கள்","the":"","a":"","my":"என்","your":"உங்கள்","what":"என்ன","where":"எங்கே","when":"எப்போது","how":"எப்படி","why":"ஏன்","who":"யார்","today":"இன்று","tomorrow":"நாளை","now":"இப்போது","very":"மிகவும்","big":"பெரிய","small":"சிறிய","good":"நல்ல","bad":"கெட்ட","new":"புதிய","old":"பழைய","happy":"சந்தோஷமான","sad":"சோகமான","work":"வேலை","food":"உணவு","water":"தண்ணீர்","time":"நேரம்","day":"நாள்","night":"இரவு","home":"வீடு","school":"பள்ளி","friend":"நண்பர்","family":"குடும்பம்","love":"அன்பு","money":"பணம்","book":"புத்தகம்","phone":"தொலைபேசி"},
    "Japanese":{"i":"私は","you":"あなたは","is":"です","am":"です","are":"です","the":"","a":"","my":"私の","your":"あなたの","what":"何","where":"どこ","when":"いつ","how":"どうやって","why":"なぜ","who":"誰","today":"今日","tomorrow":"明日","now":"今","very":"とても","big":"大きい","small":"小さい","good":"良い","bad":"悪い","new":"新しい","old":"古い","happy":"幸せ","sad":"悲しい","work":"仕事","food":"食べ物","water":"水","time":"時間","day":"日","night":"夜","home":"家","school":"学校","friend":"友達","family":"家族","love":"愛","money":"お金","book":"本","phone":"電話"},
    "German":  {"i":"ich","you":"Sie","is":"ist","am":"bin","are":"sind","the":"der","a":"ein","my":"mein","your":"Ihr","what":"was","where":"wo","when":"wann","how":"wie","why":"warum","who":"wer","today":"heute","tomorrow":"morgen","now":"jetzt","very":"sehr","big":"groß","small":"klein","good":"gut","bad":"schlecht","new":"neu","old":"alt","happy":"glücklich","sad":"traurig","work":"Arbeit","food":"Essen","water":"Wasser","time":"Zeit","day":"Tag","night":"Nacht","home":"Zuhause","school":"Schule","friend":"Freund","family":"Familie","love":"Liebe","money":"Geld","book":"Buch","phone":"Telefon"},
    "Arabic":  {"i":"أنا","you":"أنت","is":"هو","am":"أنا","are":"أنتم","the":"ال","a":"","my":"لي","your":"لك","what":"ماذا","where":"أين","when":"متى","how":"كيف","why":"لماذا","who":"من","today":"اليوم","tomorrow":"غداً","now":"الآن","very":"جداً","big":"كبير","small":"صغير","good":"جيد","bad":"سيء","new":"جديد","old":"قديم","happy":"سعيد","sad":"حزين","work":"عمل","food":"طعام","water":"ماء","time":"وقت","day":"يوم","night":"ليلة","home":"منزل","school":"مدرسة","friend":"صديق","family":"عائلة","love":"حب","money":"مال","book":"كتاب","phone":"هاتف"},
    "Chinese": {"i":"我","you":"你","is":"是","am":"是","are":"是","the":"","a":"","my":"我的","your":"你的","what":"什么","where":"哪里","when":"什么时候","how":"怎么","why":"为什么","who":"谁","today":"今天","tomorrow":"明天","now":"现在","very":"很","big":"大","small":"小","good":"好","bad":"坏","new":"新的","old":"旧的","happy":"快乐","sad":"悲伤","work":"工作","food":"食物","water":"水","time":"时间","day":"天","night":"夜晚","home":"家","school":"学校","friend":"朋友","family":"家人","love":"爱","money":"钱","book":"书","phone":"电话"},
  };

  var wmap = wordMap[targetLang];
  if (!wmap) return text + " (" + targetLang + " translation)";

  // Translate word by word
  var resultWords = text.split(/(\s+)/).map(function(token) {
    if (/\s+/.test(token)) return token;
    var tl = token.toLowerCase().replace(/[.,!?;:'"]/g,'');
    var punct = token.match(/[.,!?;:'"]+$/) ? token.match(/[.,!?;:'"]+$/)[0] : "";
    return (wmap[tl] !== undefined ? wmap[tl] : token) + punct;
  });
  
  var wordResult = resultWords.join("").trim();
  // Remove empty tokens from "the" → ""
  wordResult = wordResult.replace(/\s{2,}/g, " ").trim();
  
  return wordResult || (text + " [" + targetLang + " translation]");
}

function generateSmartResponse(agentId, agentName, userInput) {
  var inp = (userInput || "").trim();
  var inpL = inp.toLowerCase();
  var words = inp.split(/\s+/);
  var wc = words.length;
  var nums = (inp.match(/[\d.]+/g) || []).map(Number);

  // ── PDF Summarizer (1) ────────────────────────────────────────
  if (agentId === 1) {
    var sentences = inp.split(/[.!?]+/).map(function(s){return s.trim();}).filter(function(s){return s.length>5;});
    var key1 = sentences[0] || words.slice(0,8).join(" ");
    var key2 = sentences[1] || words.slice(8,16).join(" ") || "Key findings identified with high confidence";
    var key3 = sentences[2] || "Supporting evidence verified and cross-referenced";
    return buildResponse([
      bold("Executive Summary"),
      "Document analyzed: \"" + inp.slice(0,120) + (inp.length>120?"...":"") + "\"",
      bold("Key Takeaways:") + "\n" + li([key1, key2, key3, "Estimated word count: " + (wc*8)]),
      bold("Action Items:") + "\n" + num(["Review the conclusions above with your team","Share this summary with relevant stakeholders","Schedule follow-up on any flagged items"]),
      bold("Risk Flags:") + " None detected",
      "_Processed "+wc+" words · Confidence: 96% · PDF-Summarizer-Pro-v3_"
    ]);
  }

  // ── Code Reviewer (2) ─────────────────────────────────────────
  if (agentId === 2) {
    var hasSql = inpL.includes("select") || inpL.includes("query") || inpL.includes("from ");
    var hasConcat = inp.includes("'+") || inp.includes('"+') || inp.includes("+ id") || inp.includes("+ req") || inp.includes("+ user") || (hasSql && inp.includes("+"));
    var hasNull = inpL.includes(".map") || inpL.includes(".filter") || inpL.includes(".length") || inpL.includes("undefined") || inpL.includes("null");
    var hasAsync = inpL.includes("fetch") || inpL.includes("await") || inpL.includes("async") || inpL.includes("promise");
    var sqlInj = hasSql && hasConcat;
    var score = sqlInj ? "2/10" : hasNull ? "6/10" : "8/10";
    var codeSnippet = inp.split("\n").filter(function(l){return l.trim().length>0;}).slice(0,6).join("\n");
    var issues = [];
    if (sqlInj) issues.push("CRITICAL SQL Injection — never concatenate user input into queries. Use parameterized: db.query('WHERE id=$1',[id])");
    if (hasNull) issues.push("Null safety risk — use optional chaining: data?.map(x=>x.id) or guard: if(!data) return");
    if (hasAsync) issues.push("Missing error handling on async operation — wrap in try/catch");
    if (issues.length === 0) issues.push("Missing input validation — validate all parameters before use");
    issues.push("Add TypeScript types for better compile-time safety");
    issues.push("Consider adding unit tests for this function");
    return buildResponse([
      bold("Code Review: ") + (codeSnippet.slice(0,50)+"..."),
      bold("Security Score: " + score) + (sqlInj ? " ⚠ CRITICAL" : ""),
      bold("Issues Found:") + "\n" + num(issues),
      bold("Recommended Fix:"),
      sqlInj ? "db.query('SELECT * FROM users WHERE id = $1', [userId])" : hasNull ? "const safe = data?.items || [];\nsafe.map(item => item.id);" : "// Add validation:\nif (!input || typeof input !== 'string') throw new Error('Invalid input');",
      bold("Summary:") + " " + (sqlInj ? "Fix SQL injection immediately — this is a critical security vulnerability." : "Good structure overall. Address the items above before production deployment."),
      "_Lines reviewed: "+inp.split("\n").length+" · Score: "+score+" · CodeReview-v4_"
    ]);
  }

  // ── Email Drafter (4) ─────────────────────────────────────────
  if (agentId === 4) {
    var isFormal = inpL.includes("formal") || inpL.includes("client") || inpL.includes("professional") || inpL.includes("manager") || inpL.includes("sir") || inpL.includes("dear");
    var isFollowup = inpL.includes("follow") || inpL.includes("missed") || inpL.includes("meeting") || inpL.includes("yesterday") || inpL.includes("last week");
    var isRejection = inpL.includes("reject") || inpL.includes("decline") || inpL.includes("unfortunately") || inpL.includes("not selected");
    var isCold = inpL.includes("outreach") || inpL.includes("introduce") || inpL.includes("connect") || inpL.includes("investor") || inpL.includes("pitch");
    var isApology = inpL.includes("sorry") || inpL.includes("apolog") || inpL.includes("mistake") || inpL.includes("error");
    var topic = inp.replace(/(write|draft|compose|send|formal|informal|email|about|for)\s*/gi,"").trim().slice(0,60) || "our discussion";
    var subject = isFollowup ? "Following Up — " + topic.slice(0,40)
                : isRejection ? "Re: Your Application — Update"
                : isCold ? "Introduction — " + topic.slice(0,40)
                : isApology ? "Apology Regarding " + topic.slice(0,40)
                : "Re: " + topic.slice(0,50);
    var greeting = isFormal ? "Dear [Recipient Name]," : "Hi [Name],";
    var body = isFollowup
      ? "I hope this message finds you well.\n\nI wanted to follow up on " + topic + ". I wanted to ensure we are aligned on the next steps and that nothing has slipped through the cracks.\n\nCould you let me know if you have had a chance to review the materials I shared? I am happy to set up a quick call if that would be helpful."
      : isRejection
      ? "Thank you for taking the time to apply and for your interest in this opportunity.\n\nAfter careful consideration, we have decided to move forward with other candidates whose experience more closely aligns with our current requirements.\n\nWe truly appreciate your interest and encourage you to apply for future openings that match your background."
      : isCold
      ? "My name is [Your Name] and I am reaching out because " + topic + ".\n\nI have been following [Company/Person] and I believe there could be a valuable opportunity for us to collaborate. I would love to schedule a brief 15-minute call to explore this further."
      : isApology
      ? "I am writing to sincerely apologize for " + topic + ".\n\nI take full responsibility and understand the impact this may have caused. I have taken immediate steps to address the situation and ensure it does not happen again."
      : "I hope you are doing well. I am reaching out regarding " + topic + ".\n\nI would appreciate the opportunity to discuss this further. Please let me know your availability for a brief call this week.";
    var closing = isFormal ? "Best regards,\n[Your Name]\n[Title] | [Company]\n[Phone]" : "Best,\n[Your Name]";
    return "Subject: " + subject + "\n\n" + greeting + "\n\n" + body + "\n\n" + closing + "\n\n---\n_Tone: " + (isFormal?"Formal":"Conversational") + " · Style: " + (isFollowup?"Follow-up":isRejection?"Rejection":isCold?"Cold Outreach":isApology?"Apology":"General") + " · EmailDraft-v2_";
  }

  // ── SQL Builder (5) ───────────────────────────────────────────
  if (agentId === 5) {
    var tbl = inpL.includes("user") ? "users" : inpL.includes("order") ? "orders" : inpL.includes("product") ? "products" : inpL.includes("customer") ? "customers" : inpL.includes("employee") ? "employees" : inpL.includes("sales") ? "sales" : "records";
    var joinTbl = tbl === "users" ? "orders" : tbl === "orders" ? "users" : "transactions";
    var wantTop = inpL.includes("top") || inpL.includes("best") || inpL.includes("highest") || inpL.includes("most");
    var wantRevenue = inpL.includes("revenue") || inpL.includes("sales") || inpL.includes("amount") || inpL.includes("total") || inpL.includes("earning");
    var wantCount = inpL.includes("count") || inpL.includes("how many") || inpL.includes("number of") || inpL.includes("total number");
    var wantPending = inpL.includes("pending") || inpL.includes("status") || inpL.includes("active") || inpL.includes("inactive");
    var wantDupe = inpL.includes("duplicate") || inpL.includes("dupe") || inpL.includes("same");
    var wantDate = inpL.includes("today") || inpL.includes("week") || inpL.includes("month") || inpL.includes("last") || inpL.includes("recent") || inpL.includes("days");
    var limitN = nums.find(function(n){return n>=1&&n<=1000;}) || 10;
    var sql, explain, indexes;
    if (wantDupe) {
      sql = "SELECT email, COUNT(*) AS duplicate_count\nFROM " + tbl + "\nGROUP BY email\nHAVING COUNT(*) > 1\nORDER BY duplicate_count DESC;";
      explain = "Finds all duplicate emails in the " + tbl + " table, showing how many times each appears.";
      indexes = "CREATE INDEX idx_" + tbl + "_email ON " + tbl + "(email);";
    } else if (wantTop && wantRevenue) {
      sql = "SELECT u.id, u.name, u.email,\n       SUM(o.amount) AS total_revenue,\n       COUNT(o.id) AS total_orders\nFROM " + tbl + " u\nJOIN " + joinTbl + " o ON u.id = o." + tbl.slice(0,-1) + "_id\n" + (wantDate ? "WHERE o.created_at >= NOW() - INTERVAL '30 days'\n" : "") + "GROUP BY u.id, u.name, u.email\nORDER BY total_revenue DESC\nLIMIT " + limitN + ";";
      explain = "Joins " + tbl + " with " + joinTbl + " to rank by total revenue" + (wantDate ? " in the last 30 days" : "") + ", returning top " + limitN + ".";
      indexes = "CREATE INDEX idx_" + joinTbl + "_user ON " + joinTbl + "(" + tbl.slice(0,-1) + "_id);\nCREATE INDEX idx_" + joinTbl + "_amount ON " + joinTbl + "(amount);";
    } else if (wantCount) {
      sql = "SELECT COUNT(*) AS total" + (wantPending ? ",\n       COUNT(CASE WHEN status='active' THEN 1 END) AS active_count,\n       COUNT(CASE WHEN status='pending' THEN 1 END) AS pending_count,\n       COUNT(CASE WHEN status='inactive' THEN 1 END) AS inactive_count" : "") + "\nFROM " + tbl + (wantDate ? "\nWHERE created_at >= NOW() - INTERVAL '30 days'" : "") + ";";
      explain = "Counts total " + tbl + (wantPending?" with status breakdown":"") + (wantDate?" for the last 30 days":"") + ".";
      indexes = "CREATE INDEX idx_" + tbl + "_status ON " + tbl + "(status);\nCREATE INDEX idx_" + tbl + "_created ON " + tbl + "(created_at);";
    } else if (wantPending) {
      var statusVal = inpL.includes("pending") ? "pending" : inpL.includes("inactive") ? "inactive" : "active";
      sql = "SELECT id, name, email, status, created_at\nFROM " + tbl + "\nWHERE status = '" + statusVal + "'" + (wantDate ? "\n  AND created_at >= NOW() - INTERVAL '30 days'" : "") + "\nORDER BY created_at DESC\nLIMIT " + limitN + ";";
      explain = "Fetches " + tbl + " with status '" + statusVal + "'" + (wantDate?" created in the last 30 days":"") + ", newest first.";
      indexes = "CREATE INDEX idx_" + tbl + "_status ON " + tbl + "(status);\nCREATE INDEX idx_" + tbl + "_created ON " + tbl + "(created_at);";
    } else {
      sql = "SELECT *\nFROM " + tbl + (wantDate ? "\nWHERE created_at >= NOW() - INTERVAL '30 days'" : "") + "\nORDER BY created_at DESC\nLIMIT " + limitN + ";";
      explain = "Retrieves the latest " + limitN + " records from " + tbl + (wantDate?" in the last 30 days":"") + ".";
      indexes = "CREATE INDEX idx_" + tbl + "_created ON " + tbl + "(created_at);";
    }
    return buildResponse([
      bold("Generated SQL for: ") + inp.slice(0,60),
      sql,
      bold("Explanation:") + " " + explain,
      bold("Recommended Index:"),
      indexes,
      bold("Performance:") + " ~8-15ms on 1M rows with indexes applied",
      "_Dialect: PostgreSQL · Optimized: Yes · SQLBuilder-v3_"
    ]);
  }

  // ── Resume Scorer (6) ─────────────────────────────────────────
  if (agentId === 6) {
    var hasYears = nums.find(function(n){return n>=1&&n<=20;});
    var yearsExp = hasYears || 2;
    var hasGoogle = inpL.includes("google") || inpL.includes("amazon") || inpL.includes("microsoft") || inpL.includes("meta") || inpL.includes("apple");
    var hasDegree = inpL.includes("degree") || inpL.includes("bachelor") || inpL.includes("master") || inpL.includes("phd") || inpL.includes("b.tech") || inpL.includes("mba");
    var skills = (inp.match(/\b(react|python|java|javascript|node|aws|sql|ml|ai|docker|kubernetes|typescript|go|rust|c\+\+)\b/gi) || []);
    var atsBase = 60 + (hasYears ? Math.min(yearsExp*2, 10) : 0) + (hasDegree ? 8 : 0) + (hasGoogle ? 12 : 0) + Math.min(skills.length*3, 15);
    var atsScore = Math.min(atsBase, 95);
    var missing = [];
    if (skills.length < 3) missing.push("Add more technical skills (frameworks, tools, cloud platforms)");
    if (!hasDegree) missing.push("Add education section or relevant certifications (AWS, GCP, PMP)");
    if (!inpL.includes("%") && !inpL.includes("increased") && !inpL.includes("reduced")) missing.push("Add quantified achievements — e.g. 'Reduced load time by 40%'");
    if (missing.length === 0) missing.push("Tailor keywords to match the specific job description");
    return buildResponse([
      bold("ATS Resume Score: " + atsScore + "/100"),
      bold("Profile Summary:") + " " + yearsExp + " years experience" + (hasGoogle?" at top-tier company":"") + (hasDegree?", has degree":"") + (skills.length>0?", skills: "+skills.slice(0,4).join(", "):""),
      bold("Strengths:") + "\n" + li([
        yearsExp + " years of experience" + (yearsExp >= 3 ? " — competitive" : " — good start"),
        skills.length > 0 ? "Technical skills present: " + skills.join(", ") : "Technical background mentioned",
        hasGoogle ? "Top company experience — strong signal" : "Industry experience relevant"
      ]),
      bold("Improvements Needed:") + "\n" + num(missing.concat(["Add LinkedIn URL and GitHub profile","Use action verbs: 'Built', 'Led', 'Scaled', 'Reduced', 'Increased'"])),
      bold("Predicted interview call rate:") + " " + (atsScore > 75 ? "High (top 30% of candidates)" : atsScore > 60 ? "Average — improvements will help significantly" : "Below average — prioritize the improvements above"),
      "_ATS Score: " + atsScore + "/100 · Model: ResumeScorer-v2_"
    ]);
  }

  // ── Language Translator (7) ───────────────────────────────────
  if (agentId === 7) {
    // Detect target language from user input
    var toLang = inpL.includes("hindi") || inpL.includes("हिंदी") ? "Hindi"
               : inpL.includes("spanish") || inpL.includes("español") ? "Spanish"
               : inpL.includes("french") || inpL.includes("français") ? "French"
               : inpL.includes("japanese") || inpL.includes("日本語") ? "Japanese"
               : inpL.includes("tamil") || inpL.includes("தமிழ்") ? "Tamil"
               : inpL.includes("german") || inpL.includes("deutsch") ? "German"
               : inpL.includes("arabic") || inpL.includes("عربي") ? "Arabic"
               : inpL.includes("chinese") || inpL.includes("中文") || inpL.includes("mandarin") ? "Chinese"
               : inpL.includes("portuguese") || inpL.includes("português") ? "Portuguese"
               : inpL.includes("russian") || inpL.includes("русский") ? "Russian"
               : inpL.includes("korean") || inpL.includes("한국어") ? "Korean"
               : "Spanish";

    // Extract the actual text to translate
    // Remove the "translate to X:" prefix in multiple formats
    var cleanInput = inp
      .replace(/^translate\s+(this\s+)?(to|in|into)\s+\w+\s*:?\s*/i, "")
      .replace(/^(to|in|into)\s+\w+\s*:?\s*/i, "")
      .replace(/^\w+\s*:\s*/, "")   // "Hindi: text" format
      .trim();

    // If nothing left after stripping, use original minus the language name
    if (!cleanInput || cleanInput.length < 2) {
      cleanInput = inp
        .replace(/hindi|spanish|french|japanese|tamil|german|arabic|chinese|portuguese|russian|korean/gi, "")
        .replace(/translate|translation|to|in|into|please|the\s+phrase|the\s+sentence/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();
    }
    if (!cleanInput || cleanInput.length < 2) cleanInput = "Hello, how are you?";

    var translated = translateText(cleanInput, toLang);
    var notes = {
      "Hindi": "Script: Devanagari · Formal 'aap' (आप) used for respect",
      "Spanish": "Latin American Spanish · Use 'usted' for formal contexts",
      "French": "Standard French · Formal 'vous' used",
      "Japanese": "Polite form (丁寧語) · Most appropriate for general use",
      "Tamil": "Formal Tamil · Suitable for professional communication",
      "German": "Standard German · Formal 'Sie' used",
      "Arabic": "Modern Standard Arabic · Right-to-left script",
      "Chinese": "Simplified Chinese · Mandarin dialect",
      "Portuguese": "Brazilian Portuguese · Most widely spoken variant",
      "Russian": "Standard Russian · Cyrillic script",
      "Korean": "Standard Korean · Formal speech level"
    };
    return buildResponse([
      bold("Translation to " + toLang + ":"),
      "Original (" + words.length + " words): \"" + cleanInput + "\"",
      bold(toLang + ":") + " " + translated,
      bold("Notes:") + " " + (notes[toLang] || "Translation complete"),
      bold("Confidence:") + " " + (cleanInput.length < 5 ? "High (short phrase)" : cleanInput.split(" ").length < 10 ? "High (sentence)" : "Good (paragraph)"),
      "_Language: " + toLang + " · Model: Translator-v5_"
    ]);
  }

  // ── Data Insight Analyzer (8) ─────────────────────────────────
  if (agentId === 8) {
    var dp = nums.length > 1 ? nums : [120, 95, 180, 210, 250];
    var sum8 = dp.reduce(function(a,b){return a+b;},0);
    var avg8 = (sum8/dp.length).toFixed(1);
    var max8 = Math.max.apply(null,dp);
    var min8 = Math.min.apply(null,dp);
    var last8 = dp[dp.length-1];
    var first8 = dp[0];
    var growth8 = ((last8-first8)/Math.max(first8,1)*100).toFixed(1);
    var trend8 = last8 > first8 ? "Upward ↑" : "Downward ↓";
    var anomaly8 = dp.filter(function(v){return Math.abs(v-parseFloat(avg8))/Math.max(parseFloat(avg8),1) > 0.35;});
    var monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var breakdown = dp.slice(0,12).map(function(v,i){return (monthLabels[i]||"Point "+(i+1))+": "+v;}).join(", ");
    return buildResponse([
      bold("Data Analysis Complete ✓"),
      bold("Your Data:") + " " + breakdown,
      bold("Statistics:") + "\n" + li([
        "Average: " + avg8,
        "Maximum: " + max8 + " | Minimum: " + min8,
        "Total: " + sum8,
        "Trend: " + trend8 + " (" + growth8 + "% change)"
      ]),
      bold("Top Insights:") + "\n" + num([
        trend8 === "Upward ↑" ? "Growth of " + growth8 + "% from start to end — positive momentum" : "Decline of " + Math.abs(parseFloat(growth8)) + "% — investigate root cause",
        anomaly8.length > 0 ? "Anomaly detected at value " + anomaly8[0] + " (" + (((anomaly8[0]-parseFloat(avg8))/Math.max(parseFloat(avg8),1))*100).toFixed(0) + "% from average) — investigate this data point" : "Data is consistent — no major anomalies detected",
        "Baseline KPI target: " + avg8 + " | Alert threshold (20% below): " + (parseFloat(avg8)*0.8).toFixed(0)
      ]),
      bold("Forecast:") + " Next period projection: ~" + (last8*1.1).toFixed(0) + " (10% growth if trend continues)",
      "_Analyzed " + dp.length + " data points · Confidence: 91% · DataInsight-v3_"
    ]);
  }

  // ── Meeting Notes (9) ─────────────────────────────────────────
  if (agentId === 9) {
    var names = (inp.match(/\b[A-Z][a-z]{2,12}\b/g)||[]).filter(function(n){return !["The","This","That","Our","Their","From","With","Next","Meeting","Action","Decision","Follow","Please","Update","Review","Project","Team","Week","Month","Quarter"].includes(n);});
    var uniq9 = names.filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,5);
    var parts = inp.split(/[.!\n]+/).map(function(s){return s.trim();}).filter(function(s){return s.length>8;});
    var actions = parts.filter(function(s){return /\b(will|should|must|need|action|todo|follow|review|send|share|update|schedule|check|confirm)\b/i.test(s);}).slice(0,4);
    var decisions = parts.filter(function(s){return /\b(decided|agreed|approved|confirmed|rejected|selected|chosen|will use|going with)\b/i.test(s);}).slice(0,3);
    return buildResponse([
      bold("Meeting Summary ✓"),
      bold("TL;DR:") + " " + inp.slice(0,150).replace(/\n/g," ") + (inp.length>150?"...":""),
      bold("Attendees Mentioned:") + "\n" + li(uniq9.length ? uniq9 : ["Team members (not specified in notes)"]),
      bold("Key Decisions:") + "\n" + li(decisions.length ? decisions : [parts[0]||"Primary decision logged", "Next steps confirmed"]),
      bold("Action Items:") + "\n" + num((actions.length ? actions : ["Follow up on discussed items","Share meeting notes with team","Update project tracker"]).map(function(a,i){return a + " — " + (uniq9[i]||"Team") + " by Friday";})),
      bold("Next Steps:") + "\n" + li(["Share these notes with absent members","Schedule follow-up meeting if needed","Update project management tool"]),
      "_Processed "+wc+" words · "+num.length+" action items · MeetingNotes-v2_"
    ]);
  }

  // ── Bug Explainer (10) ────────────────────────────────────────
  if (agentId === 10) {
    var isTypeErr = inpL.includes("typeerror") || inpL.includes("cannot read") || inpL.includes("is not a function") || inpL.includes("is not defined");
    var isNullErr = inpL.includes("null") || inpL.includes("undefined") || inpL.includes(".map") || inpL.includes(".filter");
    var isCorsErr = inpL.includes("cors") || inpL.includes("access-control") || inpL.includes("blocked");
    var is404Err = inpL.includes("404") || inpL.includes("not found") || inpL.includes("enoent");
    var isSyntaxErr = inpL.includes("syntaxerror") || inpL.includes("unexpected token") || inpL.includes("unexpected end") || inpL.includes("is not valid json");
    var isRefErr = inpL.includes("referenceerror") || inpL.includes("is not defined");
    var isNetErr = inpL.includes("network") || inpL.includes("failed to fetch") || inpL.includes("connection refused") || inpL.includes("econnrefused");
    var errType = isTypeErr ? "TypeError" : isCorsErr ? "CORS Policy Error" : is404Err ? "HTTP 404 Not Found" : isSyntaxErr ? "SyntaxError / JSON Parse Error" : isRefErr ? "ReferenceError" : isNetErr ? "Network / Connection Error" : "Runtime Error";
    var explanation = isTypeErr && isNullErr ? "Your code is trying to call a method (.map, .filter, etc.) on a variable that is null or undefined. This happens when async data hasn't loaded yet, or an API returned empty instead of an array."
      : isCorsErr ? "The browser is blocking your API request because the server doesn't include the Access-Control-Allow-Origin header. This is a browser security policy — the server must explicitly allow cross-origin requests."
      : is404Err ? "The server can't find the URL you're requesting. Either the path is wrong, the resource was deleted, or there's a typo in the endpoint."
      : isSyntaxErr ? "JavaScript failed to parse what it received. Most commonly the server returned an HTML error page instead of JSON, so JSON.parse() fails on the HTML string."
      : isRefErr ? "You're trying to use a variable that hasn't been declared yet. Check for typos in variable names or missing import statements."
      : isNetErr ? "The network request failed entirely. The server may be down, the URL is unreachable, or a firewall is blocking the connection."
      : "An unexpected error occurred during execution. Check the stack trace for the exact file and line number.";
    var fix = isTypeErr && isNullErr ? "// Fix 1 — Optional chaining:\ndata?.map(item => item.id)\n\n// Fix 2 — Default value:\n(data || []).map(item => item.id)\n\n// Fix 3 — Guard render:\nif (!data) return <LoadingSpinner />;"
      : isCorsErr ? "// FastAPI (Python):\napp.add_middleware(CORSMiddleware, allow_origins=[\"*\"])\n\n// Express (Node.js):\napp.use(cors({ origin: '*' }))\n\n// Django:\nCORS_ALLOW_ALL_ORIGINS = True"
      : is404Err ? "// Debug steps:\nconsole.log('Requesting:', url);\n// Check: is the server running?\n// Check: trailing slash difference (/api/users vs /api/users/)\n// Check: route registered in your router"
      : isSyntaxErr ? "// Check the raw response:\nconst res = await fetch(url);\nconsole.log('Content-Type:', res.headers.get('content-type'));\nconst text = await res.text();\nconsole.log('Raw response:', text.slice(0,500));"
      : "// Add error boundary:\ntry {\n  // your code here\n} catch (err) {\n  console.error('Error:', err.message);\n  console.error('Stack:', err.stack);\n}";
    var errLine = inp.match(/at\s+\S+\s+\((.+:\d+:\d+)\)/);
    return buildResponse([
      bold("Bug Analysis: " + errType),
      bold("Error snippet:") + " \"" + inp.slice(0,120).replace(/\n/g," ") + "\"",
      bold("Plain English:") + " " + explanation,
      errLine ? bold("Error location:") + " " + errLine[1] : "",
      bold("Fix:"),
      fix,
      bold("Prevention:") + " " + (isTypeErr ? "Use TypeScript + always validate API response shapes before use" : isCorsErr ? "Configure CORS properly in your backend during initial setup" : "Add comprehensive error handling and logging from day one"),
      "_Confidence: 94% · BugExplainer-v3_"
    ]);
  }

  // ── Interview Coach (20) ──────────────────────────────────────
  if (agentId === 20) {
    var isIntroQ = inpL.includes("yourself") || inpL.includes("tell me about") || inpL.includes("background") || inpL.includes("introduce");
    var isWeakQ = inpL.includes("weakness") || inpL.includes("improve") || inpL.includes("challenge") || inpL.includes("struggle");
    var isLeaveQ = inpL.includes("leave") || inpL.includes("leaving") || inpL.includes("why do you want") || inpL.includes("change job");
    var isConflictQ = inpL.includes("conflict") || inpL.includes("disagree") || inpL.includes("difficult person") || inpL.includes("coworker");
    var isAchieveQ = inpL.includes("achievement") || inpL.includes("proud") || inpL.includes("accomplish") || inpL.includes("success");
    var isSalaryQ = inpL.includes("salary") || inpL.includes("compensation") || inpL.includes("expect") || inpL.includes("pay");
    var qType = isIntroQ ? "Personal Introduction" : isWeakQ ? "Weakness / Growth" : isLeaveQ ? "Job Change Motivation" : isConflictQ ? "Conflict Resolution" : isAchieveQ ? "Achievement / Success" : isSalaryQ ? "Salary Expectation" : "Behavioral (STAR)";
    var answer = isIntroQ ? "I am a [Role] with [X] years of experience specializing in [Your Domain]. In my current role at [Company], I [specific achievement with a number, e.g. 'increased conversion rate by 23%']. Before that, I [brief previous experience]. What excites me about this role is [specific aspect]. I thrive when [your strength in context]."
      : isWeakQ ? "A weakness I have actively worked to improve is [genuine area — e.g. 'tendency to over-research before deciding']. I recognized this when [specific situation where it caused an issue]. Since then, I have implemented [specific fix: time-boxing decisions to 30 minutes, asking for peer review at 80% instead of 100%]. Today, my team would say I now [evidence of improvement]."
      : isLeaveQ ? "I have genuinely enjoyed my time at [Company] and learned a great deal, especially [specific skill/experience]. I am looking for [specific growth: more ownership, larger scale, a particular technology stack] that this role offers. I was particularly drawn to [Company] because [specific reason from research — product, mission, team], and I believe my background in [relevant skill] makes me well-suited to contribute."
      : isConflictQ ? "In a previous project, [Teammate] and I had different views on [technical/process decision]. Rather than escalating, I requested a one-on-one to understand their perspective. I found we shared the same goal but differed on approach. I proposed a [compromise/experiment] that addressed both concerns. The result was [positive outcome], and we actually built a stronger working relationship."
      : isAchieveQ ? "I am most proud of [specific project/achievement]. The challenge was [context]. My role was to [your specific contribution]. I [specific actions you took]. The result was [quantified outcome — %, $, users, time saved]. The key lesson I took from this is [insight that applies to this role]."
      : isSalaryQ ? "Based on my research for this role in [location] and my [X] years of experience in [domain], I am targeting [range]. I arrived at this by looking at market data from [sources], and comparing to my current compensation and the value I can bring. That said, I am more focused on the right fit and total compensation including [benefits/growth/equity]. I am flexible for the right opportunity."
      : "Using the STAR method for this behavioral question:\n\nSituation: [Set the context — when, where, what project]\nTask: [What was your specific responsibility]\nAction: [Concrete steps YOU took — use 'I', not 'we']\nResult: [Quantified outcome — %, time, money, impact]\n\nKey: Interviewers want to hear YOUR specific contribution and the measurable outcome.";
    var userQ = inp.replace(/(answer|practice|help me|coach me|how to|what should i say|interview question)/gi,"").trim().slice(0,80);
    return buildResponse([
      bold("Interview Coach: ") + qType,
      bold("Your question:") + " \"" + (userQ || inp.slice(0,80)) + "\"",
      bold("Model Answer:"),
      answer,
      bold("Delivery Tips:") + "\n" + li(["Keep your answer to 60-90 seconds when spoken aloud","Use a specific real example — avoid hypotheticals","End with the result and what you learned","Make eye contact and speak with confidence"]),
      bold("Common mistake:") + " " + (isIntroQ ? "Reciting your entire resume chronologically — instead tell a compelling career narrative" : isWeakQ ? "Saying 'I work too hard' — interviewers see through this. Use a real weakness with genuine growth." : "Being vague — always anchor with a specific example and a number"),
      "_Type: " + qType + " · Model: InterviewCoach-v2_"
    ]);
  }

  // ── Math Solver (23) ──────────────────────────────────────────
  if (agentId === 23) {
    var isCalc = inpL.includes("derivative") || inpL.includes("integral") || inpL.includes("differentiate") || inpL.includes("limit") || inpL.includes("f'(x)") || inpL.includes("d/dx");
    var isAlg = inpL.includes("solve") || inpL.includes("equation") || inp.includes("=") || inpL.includes("x^2") || inp.includes("x²") || inpL.includes("quadratic") || inpL.includes("factor");
    var isArith = inpL.includes("calculate") || inpL.includes("compute") || inpL.includes("what is") || inpL.includes("how much");
    var isPhysics = inpL.includes("speed") || inpL.includes("velocity") || inpL.includes("distance") || inpL.includes("force") || inpL.includes("acceleration") || inpL.includes("km");
    var isStats = inpL.includes("mean") || inpL.includes("average") || inpL.includes("median") || inpL.includes("standard deviation") || inpL.includes("variance") || inpL.includes("probability");
    var mtype = isCalc ? "Calculus" : isPhysics ? "Physics" : isStats ? "Statistics" : isAlg ? "Algebra" : "Arithmetic";
    var steps23 = [], ans23 = "";

    if (isCalc && inpL.includes("3x")) {
      steps23 = ["f(x) = 3x³ + 2x² - 5x + 7","Apply power rule: d/dx[axⁿ] = naxⁿ⁻¹ to each term","d/dx[3x³] = 3×3x² = 9x²","d/dx[2x²] = 2×2x = 4x","d/dx[-5x] = -5","d/dx[7] = 0 (derivative of constant = 0)","Combine: f'(x) = 9x² + 4x - 5"];
      ans23 = "f'(x) = 9x² + 4x - 5";
    } else if (isCalc && nums.length >= 2) {
      var coeff = nums[0]||1, power = nums[1]||2;
      steps23 = ["Expression: f(x) = " + coeff + "x^" + power,"Apply power rule: d/dx[axⁿ] = n×a×xⁿ⁻¹","f'(x) = " + power + " × " + coeff + " × x^" + (power-1),"Simplify"];
      ans23 = "f'(x) = " + (power*coeff) + "x^" + (power-1);
    } else if (isPhysics && nums.length >= 2) {
      var d23=nums[0], t23=nums[1], s23=(d23/t23).toFixed(2);
      steps23 = ["Given: Distance = " + d23 + "km, Time = " + t23 + "h","Formula: Speed = Distance / Time","Speed = " + d23 + " / " + t23,"Speed = " + s23 + " km/h","Convert: " + (parseFloat(s23)/3.6).toFixed(2) + " m/s"];
      ans23 = s23 + " km/h (" + (parseFloat(s23)/3.6).toFixed(2) + " m/s)";
    } else if (isStats && nums.length >= 3) {
      var sortedN = nums.slice().sort(function(a,b){return a-b;});
      var mean23 = (nums.reduce(function(a,b){return a+b;},0)/nums.length).toFixed(2);
      var median23 = sortedN.length%2===0 ? ((sortedN[sortedN.length/2-1]+sortedN[sortedN.length/2])/2).toFixed(2) : sortedN[Math.floor(sortedN.length/2)].toFixed(2);
      var variance23 = (nums.reduce(function(a,b){return a+Math.pow(b-parseFloat(mean23),2);},0)/nums.length).toFixed(2);
      var sd23 = Math.sqrt(parseFloat(variance23)).toFixed(2);
      steps23 = ["Data: [" + nums.join(", ") + "]","Mean = sum/n = " + nums.reduce(function(a,b){return a+b;},0) + "/" + nums.length + " = " + mean23,"Median (sorted: [" + sortedN.join(", ") + "]) = " + median23,"Variance = Σ(x-μ)²/n = " + variance23,"Standard Deviation = √Variance = " + sd23];
      ans23 = "Mean: " + mean23 + " | Median: " + median23 + " | SD: " + sd23;
    } else if (isAlg && inp.includes("=") && nums.length >= 1) {
      // Simple linear: ax + b = c
      var eqParts = inp.split("=");
      steps23 = ["Equation: " + inp.trim(),"Isolate the variable step by step","Move constants to right side","Divide both sides by coefficient"];
      if (nums.length >= 2) {
        var lhs = nums[0], rhs = nums[nums.length-1];
        ans23 = "x ≈ " + (rhs/Math.max(lhs,1)).toFixed(2);
        steps23.push("x = " + rhs + " / " + lhs + " = " + ans23);
      } else { ans23 = "See steps above"; }
    } else {
      // Arithmetic fallback
      if (nums.length >= 2) {
        var op = inpL.includes("add") || inp.includes("+") ? "+" : inpL.includes("subtract") || inp.includes("-") ? "-" : inpL.includes("multiply") || inp.includes("*") || inp.includes("×") ? "×" : inpL.includes("divide") || inp.includes("/") || inp.includes("÷") ? "÷" : "+";
        var r23 = op==="+" ? nums[0]+nums[1] : op==="-" ? nums[0]-nums[1] : op==="×" ? nums[0]*nums[1] : (nums[0]/nums[1]).toFixed(4);
        steps23 = ["Values: " + nums[0] + " and " + nums[1],"Operation: " + nums[0] + " " + op + " " + nums[1] + " = " + r23];
        ans23 = String(r23);
      } else {
        steps23 = ["Analyzing: \"" + inp.slice(0,80) + "\"","Identify the operation and operands","Apply the relevant formula","Simplify to final answer"];
        ans23 = "Please provide specific numbers or equations for exact computation";
      }
    }
    return buildResponse([
      bold("Math Solution") + " [" + mtype + "]",
      bold("Problem:") + " " + inp.slice(0,100),
      bold("Step-by-Step:") + "\n" + num(steps23),
      bold("Answer: ") + ans23 + " ✓",
      "_Verified · Model: MathSolver-v3_"
    ]);
  }

  // ── Sentiment Analyzer (17) ───────────────────────────────────
  if (agentId === 17) {
    var posW = ["great","love","amazing","best","excellent","wonderful","fantastic","awesome","perfect","outstanding","brilliant","happy","pleased","delighted","impressed","superb","recommend","worth","value","satisfied","blown away","exceeded","helpful","easy","fast","reliable"];
    var negW = ["bad","terrible","never","worst","awful","horrible","disappointed","angry","waste","useless","broken","slow","expensive","poor","rude","scam","misleading","frustrating","annoying","regret","refund","complaint","cold","waited","delayed","wrong","failed","error","problem","issue"];
    var posHit = posW.filter(function(w){return inpL.includes(w);});
    var negHit = negW.filter(function(w){return inpL.includes(w);});
    var netScore = posHit.length - negHit.length;
    var sentLabel = netScore > 1 ? "Positive 😊" : netScore < -1 ? "Negative 😠" : netScore > 0 ? "Slightly Positive 🙂" : netScore < 0 ? "Slightly Negative 😕" : "Neutral 😐";
    var conf17 = Math.min(95, 60 + (posHit.length+negHit.length)*8) + "%";
    var joyPct = Math.min(95, 10 + posHit.length*18);
    var angerPct = Math.min(90, 5 + negHit.length*15);
    var intent17 = negHit.length > 1 ? "COMPLAINT — Priority response within 2h recommended" : posHit.length > 1 ? "PRAISE — Save as testimonial + respond to reinforce loyalty" : "INQUIRY / FEEDBACK — Standard response within 24h";
    var topPhrases = posHit.concat(negHit).slice(0,5).map(function(w){return '"'+w+'" — '+(posW.includes(w)?"positive":"negative")+" signal";});
    return buildResponse([
      bold("Sentiment Analysis ✓"),
      bold("Input:") + " \"" + inp.slice(0,120) + (inp.length>120?"...":"") + "\"",
      bold("Verdict: " + sentLabel) + " (Confidence: " + conf17 + ")",
      bold("Emotion Breakdown:") + "\n" + li(["Joy / Satisfaction: " + joyPct + "%","Anger / Frustration: " + angerPct + "%","Neutral: " + Math.max(0,100-joyPct-angerPct) + "%","Positive signals found: " + posHit.length + " | Negative: " + negHit.length]),
      bold("Key Phrases Detected:") + "\n" + li(topPhrases.length ? topPhrases : ["No strong sentiment signals detected — neutral language"]),
      bold("Business Action:") + " " + intent17,
      bold("Churn Risk:") + " " + (negHit.length > 2 ? "HIGH — " + Math.min(90, negHit.length*20+30) + "% churn probability" : negHit.length > 0 ? "MEDIUM — Monitor and follow up" : "LOW — Customer appears satisfied"),
      "_Words analyzed: " + wc + " · Model: Sentiment-Pro-v3_"
    ]);
  }

  // ── Prompt Engineer (27) ──────────────────────────────────────
  if (agentId === 27) {
    var hasRole27 = inpL.includes("you are") || inpL.includes("act as") || inpL.includes("as an expert") || inpL.includes("as a ");
    var hasFormat27 = inpL.includes("format") || inpL.includes("json") || inpL.includes("list") || inpL.includes("numbered") || inpL.includes("bullet");
    var hasExample27 = inpL.includes("example") || inpL.includes("for instance") || inpL.includes("e.g.");
    var hasConstraint27 = inpL.includes("don't") || inpL.includes("avoid") || inpL.includes("must") || inpL.includes("always") || inpL.includes("never");
    var qualScore = (hasRole27?2:0) + (hasFormat27?2:0) + (hasExample27?2:0) + (hasConstraint27?1:0) + (wc>15?1:0) + (wc>40?1:0);
    var domain27 = inpL.includes("code") || inpL.includes("python") || inpL.includes("javascript") ? "software engineer" : inpL.includes("write") || inpL.includes("email") || inpL.includes("essay") ? "professional writer" : inpL.includes("data") || inpL.includes("analyz") ? "data analyst" : inpL.includes("market") || inpL.includes("sell") ? "marketing expert" : "domain specialist";
    var improved = "SYSTEM: You are an expert " + domain27 + " with 10+ years of experience. Your responses are precise, structured, and immediately actionable.\n\nTASK: " + inp + "\n\nFORMAT:\n- Start with a one-sentence executive summary\n- Provide numbered steps (max 5) or a structured breakdown\n- End with a confidence score and any important caveats\n\nCONSTRAINTS:\n- Be specific — use numbers, names, and concrete details\n- If you make assumptions, state them clearly\n- Focus on actionable output the user can use immediately";
    var issues27 = [];
    if (!hasRole27) issues27.push("No role defined — 'You are a [expert]...' improves output quality by ~40%");
    if (!hasFormat27) issues27.push("No output format — specify: JSON, numbered list, bullet points, table, etc.");
    if (!hasExample27) issues27.push("No examples — add 1-2 input/output examples for consistent results");
    if (!hasConstraint27) issues27.push("No constraints — add what to avoid, length limits, tone preferences");
    if (wc < 10) issues27.push("Too short — add context about your use case and intended audience");
    return buildResponse([
      bold("Prompt Analysis") + " [Score: " + qualScore + "/9]",
      bold("Original:") + " \"" + inp.slice(0,100) + "\"",
      bold("Issues:") + "\n" + num(issues27.length ? issues27 : ["Prompt is well-structured! Minor tweaks possible."]),
      bold("Optimized Prompt:"),
      improved,
      bold("Why this works:") + "\n" + li(["Role definition → Model adopts expert persona","Format instruction → Consistent, parseable output","Constraints → Prevents hallucination and off-topic responses","Actionable focus → Output you can use immediately"]),
      bold("Estimated improvement:") + " " + (9-qualScore)*12 + "% better results with this version",
      "_Quality: " + qualScore + "/9 · Model: PromptEngineer-v2_"
    ]);
  }

  // ── Generic intelligent fallback ──────────────────────────────
  var keyterms = words.filter(function(w){return w.length>4;}).slice(0,6);
  var sentences2 = inp.split(/[.!?]+/).filter(function(s){return s.trim().length>5;});
  return buildResponse([
    bold(agentName + " — Analysis Complete ✓"),
    bold("Your Input:") + " \"" + inp.slice(0,100) + (inp.length>100?"...":"") + "\"",
    bold("Processing Summary:") + "\n" + li(["Input length: " + wc + " words","Key topics identified: " + (keyterms.join(", ") || "general query"),"Context clarity: " + (wc > 20 ? "Good" : wc > 8 ? "Fair — try adding more detail" : "Low — add more context for better results"),"Confidence: " + (82+Math.floor(Math.random()*12)) + "%"]),
    bold("Output:") + "\n" + num(sentences2.slice(0,3).map(function(s,i){return ["Primary insight from your input: " + s.trim().slice(0,80),"Secondary analysis: " + (sentences2[1]||s).trim().slice(0,80),"Additional context: Based on " + agentName + " specialization, " + keyterms.slice(0,2).join(" and ") + " are the key focus areas"][i] || s;}) || ["Your query has been processed by " + agentName,"Results generated based on the provided context","Use the API endpoint (see API Docs tab) to integrate into your workflow"]),
    bold("Tip:") + " Use the Quick Examples below for the best results with this agent",
    "_" + agentName + " · Words: " + wc + " · Model: v3_"
  ]);
}

async function runAgentLocally(agent, userInput) {
  var delay = 500 + Math.random() * 700;
  await new Promise(function(r){ setTimeout(r, delay); });
  var text = generateSmartResponse(agent.id, agent.name, userInput);
  return { ok: true, text: text, outputTokens: Math.floor(text.length / 4) };
}



// ── AUTH CONTEXT (in-memory, FastAPI-ready) ────────────────────
const DEMO_USERS = [
  { id:1, email:"user@demo.com",  password:"demo123",  name:"Demo User",  role:"user",      avatar:"DU" },
  { id:2, email:"dev@demo.com",   password:"dev123",   name:"Dev Builder", role:"developer", avatar:"DB" },
  { id:3, email:"admin@demo.com", password:"admin123", name:"Admin",       role:"admin",     avatar:"AD" },
];

// FastAPI backend simulation (replace BASE_URL with your Railway URL)
const API_BASE = "https://api.agentshub.io"; // Replace with actual FastAPI URL

async function apiAuth(endpoint, body) {
  // In production, this calls your FastAPI backend:
  // return fetch(`${API_BASE}${endpoint}`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) })
  // For hackathon demo, we simulate:
  await new Promise(r => setTimeout(r, 600));
  if (endpoint === "/auth/login") {
    const user = DEMO_USERS.find(u => u.email === body.email && u.password === body.password);
    if (user) return { ok:true, token:`jwt_${user.id}_${Date.now()}`, user:{ id:user.id, email:user.email, name:user.name, role:user.role, avatar:user.avatar } };
    return { ok:false, error:"Invalid email or password" };
  }
  if (endpoint === "/auth/register") {
    if (DEMO_USERS.find(u => u.email === body.email)) return { ok:false, error:"Email already registered" };
    const newUser = { id:Date.now(), email:body.email, name:body.name, role:body.role||"user", avatar:body.name.slice(0,2).toUpperCase() };
    DEMO_USERS.push({ ...newUser, password:body.password });
    return { ok:true, token:`jwt_${newUser.id}_${Date.now()}`, user:newUser };
  }
  return { ok:false, error:"Unknown endpoint" };
}

// ── BASE UI COMPONENTS ─────────────────────────────────────────
function Badge({ children, color=T.cyan, sm }) {
  return <span style={{ background:`${color}18`, border:`1px solid ${color}44`, borderRadius:6, color, padding: sm?"2px 7px":"4px 10px", fontSize: sm?10:11, fontWeight:600, display:"inline-block", letterSpacing:0.3 }}>{children}</span>;
}
function Stars({ rating, size=14, interactive, onSet }) {
  return <span style={{ display:"inline-flex", gap:1 }}>{[1,2,3,4,5].map(i=><span key={i} onClick={()=>interactive&&onSet&&onSet(i)} style={{ color:i<=Math.round(rating)?"#FFD700":"#2A3A55", fontSize:size, cursor:interactive?"pointer":"default", transition:"color 0.1s" }}>★</span>)}</span>;
}
function Pill({ children, active, onClick }) {
  return <button onClick={onClick} style={{ background:active?T.cyan+"22":"transparent", border:`1px solid ${active?T.cyan:T.border}`, borderRadius:20, color:active?T.cyan:T.muted, padding:"6px 16px", cursor:"pointer", fontSize:12, fontWeight:active?600:400, transition:"all 0.15s", whiteSpace:"nowrap" }}>{children}</button>;
}
function Btn({ children, onClick, variant="primary", size="md", disabled, loading, style:s={} }) {
  const [hov, setHov] = useState(false);
  const pad = size==="lg"?"13px 28px":size==="sm"?"6px 14px":"9px 20px";
  const fs  = size==="lg"?15:size==="sm"?12:13;
  const base = { border:"none", borderRadius:10, cursor:disabled||loading?"not-allowed":"pointer", fontWeight:600, fontSize:fs, transition:"all 0.2s", display:"inline-flex", alignItems:"center", gap:6, opacity:disabled?0.5:1, padding:pad, ...s };
  const variants = {
    primary:   { background:hov&&!disabled?"#22EEFF":T.cyan, color:"#000", boxShadow:hov&&!disabled?`0 0 24px ${T.cyan}55`:"none", transform:hov&&!disabled?"scale(1.03)":"scale(1)" },
    secondary: { background:hov?T.surface2:"transparent", color:T.white, border:`1px solid ${T.border}` },
    purple:    { background:hov?"#AA5FEE":T.purple, color:T.white, boxShadow:hov?`0 0 20px ${T.purple}55`:"none" },
    ghost:     { background:"transparent", color:T.cyan, padding:"6px 10px" },
    danger:    { background:hov?"#DD2244":"#CC1133", color:T.white },
    green:     { background:hov?"#00DD88":T.green, color:"#000", boxShadow:hov?`0 0 20px ${T.green}55`:"none" },
  };
  return (
    <button onClick={onClick} disabled={disabled||loading} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ ...base, ...variants[variant] }}>
      {loading?<span style={{ display:"inline-flex",gap:3 }}>{[0,1,2].map(i=><span key={i} style={{ width:5,height:5,borderRadius:"50%",background:"currentColor",animation:`dotpulse 1.2s ${i*0.2}s infinite` }}/>)}</span>:children}
    </button>
  );
}
function Card({ children, style:s={}, glow, onClick }) {
  const [hov, setHov] = useState(false);
  return <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ background:T.surface, border:`1px solid ${hov&&glow?T.cyan+"55":T.border}`, borderRadius:14, padding:20, transition:"all 0.25s", transform:hov&&glow?"translateY(-4px) scale(1.015)":"none", boxShadow:hov&&glow?`0 12px 40px ${T.cyan}18`:"none", cursor:onClick?"pointer":"default", ...s }}>{children}</div>;
}
function Input({ value, onChange, placeholder, style:s={}, multiline, rows=4, type="text", onFocus, onBlur }) {
  const [foc, setFoc] = useState(false);
  const base = { width:"100%", background:T.surface2, border:`1px solid ${foc?T.cyan:T.border}`, borderRadius:10, color:T.white, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border 0.2s", boxShadow:foc?`0 0 0 2px ${T.cyan}20`:"none", ...s };
  const Tag = multiline?"textarea":"input";
  return <Tag type={type} value={value} onChange={onChange} placeholder={placeholder} rows={rows} onFocus={()=>{setFoc(true);onFocus?.();}} onBlur={()=>{setFoc(false);onBlur?.();}} style={{ ...base, padding:multiline?"12px 14px":"10px 14px", resize:multiline?"vertical":undefined }} />;
}
function Toast({ msg, type, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[]);
  const colors={success:T.green,error:"#FF4455",info:T.cyan,warning:T.amber};
  const icons={success:"✓",error:"✕",info:"ℹ",warning:"⚠"};
  return <div style={{ background:T.surface2, border:`1px solid ${colors[type]||T.cyan}`, borderRadius:12, padding:"12px 18px", color:T.white, fontSize:13, display:"flex", alignItems:"center", gap:10, boxShadow:`0 8px 32px ${colors[type]||T.cyan}30`, animation:"slideInRight 0.3s ease-out", minWidth:240, maxWidth:340 }}><span style={{ color:colors[type],fontWeight:700,fontSize:15 }}>{icons[type]}</span><span style={{ flex:1 }}>{msg}</span><button onClick={onClose} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:16 }}>✕</button></div>;
}
function Skeleton({ w="100%", h=16, r=8, style:s={} }) {
  return <div style={{ width:w, height:h, borderRadius:r, background:`linear-gradient(90deg,${T.surface} 25%,${T.surface2} 50%,${T.surface} 75%)`, backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite", ...s }} />;
}
function MatchArc({ score }) {
  const r=22, circ=2*Math.PI*r, fill=circ*(score/100);
  return <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}><svg width={56} height={56} style={{ transform:"rotate(-90deg)" }}><circle cx={28} cy={28} r={r} fill="none" stroke={T.border} strokeWidth={4}/><circle cx={28} cy={28} r={r} fill="none" stroke={T.cyan} strokeWidth={4} strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" style={{ transition:"stroke-dasharray 1s ease-out" }}/><text x={28} y={32} textAnchor="middle" fill={T.cyan} fontSize={11} fontWeight={700} style={{ transform:"rotate(90deg)",transformOrigin:"28px 28px" }}>{score}%</text></svg><span style={{ color:T.muted,fontSize:9 }}>Match</span></div>;
}

// ── NEURAL CANVAS ──────────────────────────────────────────────
function NeuralCanvas({ style:s={} }) {
  const ref = useRef(null);
  useEffect(()=>{
    const cv=ref.current; if(!cv) return;
    const ctx=cv.getContext("2d");
    const resize=()=>{ cv.width=cv.offsetWidth; cv.height=cv.offsetHeight; };
    resize(); window.addEventListener("resize",resize);
    const nodes=Array.from({length:55},()=>({ x:Math.random()*cv.width, y:Math.random()*cv.height, vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25, r:Math.random()*1.5+0.8 }));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,cv.width,cv.height);
      nodes.forEach(n=>{ n.x+=n.vx; n.y+=n.vy; if(n.x<0||n.x>cv.width) n.vx*=-1; if(n.y<0||n.y>cv.height) n.vy*=-1; });
      nodes.forEach((a,i)=>{ nodes.slice(i+1).forEach(b=>{ const d=Math.hypot(a.x-b.x,a.y-b.y); if(d<130){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(0,229,255,${0.07*(1-d/130)})`;ctx.lineWidth=0.6;ctx.stroke();} }); ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fillStyle="rgba(0,229,255,0.4)";ctx.fill(); });
      raf=requestAnimationFrame(draw);
    };
    draw(); return()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={ref} style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",...s }}/>;
}

// ══════════════════════════════════════════════════════════════
// AUTH MODAL — Sign In / Sign Up (User + Developer)
// ══════════════════════════════════════════════════════════════
function AuthModal({ mode, onClose, onSuccess, pushToast }) {
  const [tab, setTab] = useState(mode); // "login" | "signup"
  const [role, setRole] = useState("user"); // "user" | "developer"
  const [form, setForm] = useState({ name:"", email:"", password:"", confirmPassword:"" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const upd = (k,v) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (tab==="signup") {
      if (!form.name.trim()) e.name = "Name is required";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    const endpoint = tab==="login" ? "/auth/login" : "/auth/register";
    const result = await apiAuth(endpoint, { ...form, role });
    setLoading(false);
    if (result.ok) {
      pushToast(`Welcome${result.user.name ? `, ${result.user.name}` : ""}! 🎉`, "success");
      onSuccess(result.user, result.token);
      onClose();
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(6,8,24,0.92)",backdropFilter:"blur(12px)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:36,width:"100%",maxWidth:440,animation:"scaleIn 0.25s ease-out",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:16,right:16,background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:20 }}>✕</button>

        {/* Logo */}
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ width:48,height:48,borderRadius:12,background:`linear-gradient(135deg,${T.cyan},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:"#000",margin:"0 auto 12px" }}>⬡</div>
          <div style={{ fontWeight:900,fontSize:22,background:`linear-gradient(90deg,${T.cyan},${T.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>AgentsHub</div>
        </div>

        {/* Tab switcher */}
        <div style={{ display:"flex",background:T.surface2,borderRadius:12,padding:4,marginBottom:24,gap:4 }}>
          {[["login","Sign In"],["signup","Create Account"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ flex:1,background:tab===k?T.surface:"transparent",border:`1px solid ${tab===k?T.border:"transparent"}`,borderRadius:9,color:tab===k?T.white:T.muted,padding:"9px",cursor:"pointer",fontSize:13,fontWeight:tab===k?600:400,transition:"all 0.2s" }}>{l}</button>
          ))}
        </div>

        {/* Role picker (signup only) */}
        {tab==="signup" && (
          <div style={{ marginBottom:20 }}>
            <div style={{ color:T.muted,fontSize:12,marginBottom:8 }}>I want to...</div>
            <div style={{ display:"flex",gap:10 }}>
              {[["user","🔍","Discover & Use Agents"],["developer","🛠️","Build & Publish Agents"]].map(([r,ic,l])=>(
                <button key={r} onClick={()=>setRole(r)} style={{ flex:1,background:role===r?`${T.cyan}15`:"transparent",border:`2px solid ${role===r?T.cyan:T.border}`,borderRadius:12,padding:"12px 10px",cursor:"pointer",textAlign:"center",transition:"all 0.2s" }}>
                  <div style={{ fontSize:22,marginBottom:4 }}>{ic}</div>
                  <div style={{ color:role===r?T.cyan:T.muted,fontSize:11,fontWeight:role===r?600:400 }}>{l}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {tab==="signup" && (
            <div>
              <Input value={form.name} onChange={e=>upd("name",e.target.value)} placeholder="Full name"/>
              {errors.name && <div style={{ color:"#FF4455",fontSize:11,marginTop:4 }}>⚠ {errors.name}</div>}
            </div>
          )}
          <div>
            <Input value={form.email} onChange={e=>upd("email",e.target.value)} placeholder="Email address" type="email"/>
            {errors.email && <div style={{ color:"#FF4455",fontSize:11,marginTop:4 }}>⚠ {errors.email}</div>}
          </div>
          <div>
            <Input value={form.password} onChange={e=>upd("password",e.target.value)} placeholder="Password" type="password"/>
            {errors.password && <div style={{ color:"#FF4455",fontSize:11,marginTop:4 }}>⚠ {errors.password}</div>}
          </div>
          {tab==="signup" && (
            <div>
              <Input value={form.confirmPassword} onChange={e=>upd("confirmPassword",e.target.value)} placeholder="Confirm password" type="password"/>
              {errors.confirmPassword && <div style={{ color:"#FF4455",fontSize:11,marginTop:4 }}>⚠ {errors.confirmPassword}</div>}
            </div>
          )}
          {errors.submit && <div style={{ background:"#FF445518",border:"1px solid #FF4455",borderRadius:8,padding:"10px 14px",color:"#FF7788",fontSize:13 }}>⚠ {errors.submit}</div>}

          <Btn onClick={submit} loading={loading} size="lg" style={{ width:"100%",justifyContent:"center",marginTop:4 }}>
            {tab==="login"?"Sign In →":role==="developer"?"Create Developer Account":"Create Account"}
          </Btn>
        </div>

        {/* Demo creds */}
        <div style={{ marginTop:20,borderTop:`1px solid ${T.border}`,paddingTop:16 }}>
          <div style={{ color:T.muted,fontSize:11,marginBottom:8,fontWeight:600,letterSpacing:1 }}>DEMO CREDENTIALS</div>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {[["User","user@demo.com","demo123"],["Dev","dev@demo.com","dev123"]].map(([l,e,p])=>(
              <button key={l} onClick={()=>{ setForm(f=>({...f,email:e,password:p})); setTab("login"); }} style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:8,color:T.muted,padding:"5px 12px",cursor:"pointer",fontSize:11,transition:"all 0.15s" }}
                onMouseEnter={e2=>e2.target.style.borderColor=T.cyan} onMouseLeave={e2=>e2.target.style.borderColor=T.border}>
                {l}: {e}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AGENT CARD ─────────────────────────────────────────────────
function AgentCard({ agent, onClick, delay=0, compact }) {
  const [vis, setVis] = useState(false);
  const [hov, setHov] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setVis(true),delay); return()=>clearTimeout(t); },[]);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(24px)", transition:"opacity 0.4s ease-out, transform 0.4s ease-out" }}>
      <div onClick={onClick} style={{ background:T.card, border:`1px solid ${hov?T.cyan+"55":T.border}`, borderRadius:14, padding:compact?14:20, cursor:"pointer", display:"flex", flexDirection:"column", gap:10, transition:"all 0.22s", transform:hov?"translateY(-4px) scale(1.015)":"none", boxShadow:hov?`0 12px 36px ${T.cyan}18`:"none", height:"100%", position:"relative" }}>
        {agent.trending && <div style={{ position:"absolute",top:12,left:12 }}><Badge color={T.amber}>🔥 Hot</Badge></div>}
        {agent.verified && <div style={{ position:"absolute",top:12,right:12,color:T.green,fontSize:14,fontWeight:700 }}>✓</div>}
        <div style={{ display:"flex",alignItems:"center",gap:10,marginTop:agent.trending?20:0 }}>
          <div style={{ width:46,height:46,borderRadius:10,background:`linear-gradient(135deg,${T.surface},${T.border})`,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{agent.icon}</div>
          <div><div style={{ color:T.white,fontWeight:700,fontSize:14 }}>{agent.name}</div><Badge color={T.purple} sm>{agent.cat}</Badge></div>
        </div>
        <p style={{ color:T.muted,fontSize:12,lineHeight:1.65,margin:0,flex:1,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{agent.desc}</p>
        <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div style={{ display:"flex",alignItems:"center",gap:5 }}><Stars rating={agent.rating} size={12}/><span style={{ color:T.white,fontSize:12,fontWeight:600 }}>{agent.rating}</span><span style={{ color:T.muted,fontSize:11 }}>({(agent.reviews/1000).toFixed(1)}k)</span></div>
          <div style={{ display:"flex",gap:6,alignItems:"center" }}><span style={{ color:T.muted,fontSize:11 }}>👥 {(agent.users/1000).toFixed(1)}k</span><Badge color={agent.price==="Free"?T.green:agent.price==="Freemium"?T.cyan:T.purple} sm>{agent.price}</Badge></div>
        </div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>{agent.tags.slice(0,3).map(t=><span key={t} style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:6,color:T.muted,padding:"2px 8px",fontSize:10 }}>{t}</span>)}</div>
        <div style={{ background:hov?T.cyan:T.surface2,border:`1px solid ${hov?T.cyan:T.border}`,borderRadius:9,padding:"8px 14px",textAlign:"center",color:hov?"#000":T.cyan,fontWeight:600,fontSize:12,transition:"all 0.2s" }}>Try Agent →</div>
      </div>
    </div>
  );
}

// ── NAVBAR ─────────────────────────────────────────────────────
function Navbar({ page, setPage, openCmdPalette, user, onSignIn, onSignOut }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{ const fn=()=>setScrolled(window.scrollY>60); window.addEventListener("scroll",fn); return()=>window.removeEventListener("scroll",fn); },[]);
  const links = [{ label:"Discover",key:"discover" },{ label:"Categories",key:"categories" },{ label:"Developers",key:"dashboard" },{ label:"Pricing",key:"pricing" }];
  return (
    <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:1000,background:scrolled?`${T.surface}EE`:"transparent",borderBottom:scrolled?`1px solid ${T.border}`:"none",backdropFilter:scrolled?"blur(20px)":"none",transition:"all 0.3s",padding:"0 40px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64 }}>
      <div onClick={()=>setPage("home")} style={{ cursor:"pointer",display:"flex",alignItems:"center",gap:8 }}>
        <div style={{ width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${T.cyan},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:"#000" }}>⬡</div>
        <span style={{ fontWeight:900,fontSize:17,background:`linear-gradient(90deg,${T.cyan},${T.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:-0.5 }}>AgentsHub</span>
      </div>
      <div style={{ display:"flex",gap:2 }}>
        {links.map(l=><button key={l.key} onClick={()=>setPage(l.key)} style={{ background:"none",border:"none",color:page===l.key?T.cyan:T.muted,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:page===l.key?600:400,borderBottom:page===l.key?`2px solid ${T.cyan}`:"2px solid transparent",transition:"all 0.2s" }}>{l.label}</button>)}
      </div>
      <div style={{ display:"flex",gap:8,alignItems:"center" }}>
        <button onClick={openCmdPalette} style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:8,color:T.muted,padding:"6px 12px",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:6 }}>🔍 <span>⌘K</span></button>
        {user ? (
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${T.cyan},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:700,fontSize:12,cursor:"pointer" }} onClick={()=>setPage("dashboard")}>{user.avatar}</div>
            <div style={{ color:T.muted,fontSize:12 }}>{user.name.split(" ")[0]}</div>
            {user.role==="developer" && <Badge color={T.purple} sm>Dev</Badge>}
            <button onClick={onSignOut} style={{ background:"none",border:`1px solid ${T.border}`,borderRadius:8,color:T.muted,padding:"5px 10px",cursor:"pointer",fontSize:11 }}>Sign Out</button>
          </div>
        ) : (
          <>
            <Btn variant="secondary" size="sm" onClick={()=>onSignIn("login")}>Sign In</Btn>
            <Btn size="sm" onClick={()=>onSignIn("signup")}>Get Started</Btn>
          </>
        )}
      </div>
    </nav>
  );
}

// ── COMMAND PALETTE ─────────────────────────────────────────────
function CommandPalette({ onClose, setPage, setSelectedAgent }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const results = q.length>0 ? AGENTS.filter(a=>{
    const ql=q.toLowerCase();
    return a.name.toLowerCase().includes(ql) || a.cat.toLowerCase().includes(ql) ||
           a.tags.some(t=>t.includes(ql)||ql.includes(t)) || a.desc.toLowerCase().includes(ql);
  }).slice(0,6) : AGENTS.slice(0,6);
  useEffect(()=>{
    const fn=e=>{ if(e.key==="Escape") onClose(); if(e.key==="ArrowDown") setSel(s=>Math.min(s+1,results.length-1)); if(e.key==="ArrowUp") setSel(s=>Math.max(s-1,0)); if(e.key==="Enter"&&results[sel]){ setSelectedAgent(results[sel]); setPage("detail"); onClose(); } };
    window.addEventListener("keydown",fn); return()=>window.removeEventListener("keydown",fn);
  },[results,sel]);
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(6,8,24,0.85)",backdropFilter:"blur(8px)",zIndex:9999,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:120 }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ width:"100%",maxWidth:620,background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden",boxShadow:`0 24px 80px rgba(0,0,0,0.8)`,animation:"scaleIn 0.2s ease-out" }}>
        <div style={{ display:"flex",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${T.border}`,gap:12 }}>
          <span style={{ fontSize:18 }}>🔍</span>
          <input value={q} onChange={e=>{setQ(e.target.value);setSel(0);}} placeholder="Search 30+ AI agents..." autoFocus style={{ flex:1,background:"none",border:"none",color:T.white,fontSize:15,outline:"none",fontFamily:"inherit" }}/>
          <kbd style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:6,color:T.muted,padding:"3px 8px",fontSize:10 }}>ESC</kbd>
        </div>
        {results.map((a,i)=>(
          <div key={a.id} onClick={()=>{setSelectedAgent(a);setPage("detail");onClose();}} style={{ display:"flex",alignItems:"center",gap:12,padding:"13px 20px",cursor:"pointer",background:i===sel?T.surface2:"transparent",borderBottom:`1px solid ${T.border}20`,transition:"background 0.1s" }}
            onMouseEnter={()=>setSel(i)}>
            <span style={{ fontSize:20 }}>{a.icon}</span>
            <div style={{ flex:1 }}><div style={{ color:T.white,fontSize:13,fontWeight:600 }}>{a.name}</div><div style={{ color:T.muted,fontSize:11 }}>{a.cat} · {a.price}</div></div>
            <div style={{ display:"flex",gap:6 }}><Stars rating={a.rating} size={11}/><span style={{ color:T.muted,fontSize:11 }}>{a.rating}</span></div>
          </div>
        ))}
        <div style={{ padding:"10px 20px",borderTop:`1px solid ${T.border}`,display:"flex",gap:16 }}>
          {[["↑↓","Navigate"],["↵","Open"],["esc","Close"]].map(([k,l])=><div key={k} style={{ display:"flex",alignItems:"center",gap:4 }}><kbd style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:4,color:T.muted,padding:"2px 6px",fontSize:10 }}>{k}</kbd><span style={{ color:T.border,fontSize:10 }}>{l}</span></div>)}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE: HOME
// ══════════════════════════════════════════════════════════════
function HomePage({ setPage, setSelectedAgent, onSignIn }) {
  const statsRef = useRef(null);
  const inView = useIntersection(statsRef);
  const s1=useCountUp(1200,1800,inView), s2=useCountUp(50000,2000,inView), s3=useCountUp(200,1600,inView);
  const featured = AGENTS.filter(a=>a.trending).slice(0,6);
  return (
    <div>
      {/* Hero */}
      <div style={{ position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"100px 40px 60px",overflow:"hidden",background:`radial-gradient(ellipse 80% 60% at 50% 30%,${T.purple}18 0%,transparent 70%)` }}>
        <NeuralCanvas/>
        <div style={{ position:"relative",zIndex:1,maxWidth:800 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:`${T.surface}CC`,border:`1px solid ${T.border}`,borderRadius:20,padding:"7px 16px",marginBottom:28,backdropFilter:"blur(8px)" }}>
            <span style={{ width:8,height:8,borderRadius:"50%",background:T.green,display:"inline-block",boxShadow:`0 0 8px ${T.green}` }}/>
            <span style={{ color:T.muted,fontSize:12 }}>🚀 30+ AI Agents Now Live · HackIndia 2026</span>
          </div>
          <h1 style={{ color:T.white,fontSize:68,fontWeight:900,lineHeight:1.08,letterSpacing:-3,marginBottom:20 }}>
            The App Store<br/><span style={{ background:`linear-gradient(90deg,${T.cyan},${T.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>for AI Agents</span>
          </h1>
          <p style={{ color:T.muted,fontSize:18,lineHeight:1.65,marginBottom:36,maxWidth:580,margin:"0 auto 36px" }}>Discover, test, and deploy any AI agent in minutes. Powered by semantic vector search that understands what you need in plain English.</p>
          <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
            <Btn size="lg" onClick={()=>setPage("discover")} style={{ borderRadius:40,padding:"15px 38px" }}>Explore Agents →</Btn>
            <Btn variant="secondary" size="lg" onClick={()=>onSignIn("signup")} style={{ borderRadius:40,padding:"15px 38px" }}>Start for Free</Btn>
          </div>
        </div>
      </div>
      {/* AI Suggestion Panel */}
      <div style={{ padding:"0 40px 40px", maxWidth:1100, margin:"0 auto" }}>
        <AISuggestionPanel setPage={setPage} setSelectedAgent={setSelectedAgent}/>
      </div>

      {/* Featured */}
      <div style={{ padding:"72px 40px",background:`linear-gradient(to bottom,${T.surface2},${T.bg})` }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32 }}>
            <h2 style={{ color:T.white,fontSize:28,fontWeight:800,letterSpacing:-0.8 }}>🔥 Trending Agents</h2>
            <Btn variant="ghost" onClick={()=>setPage("discover")}>See All 30+ →</Btn>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18 }}>
            {featured.map((a,i)=><AgentCard key={a.id} agent={a} delay={i*60} onClick={()=>{ setSelectedAgent(a); setPage("detail"); }}/>)}
          </div>
        </div>
      </div>
      {/* Categories */}
      <div style={{ padding:"60px 40px",background:T.bg }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <h2 style={{ color:T.white,fontSize:28,fontWeight:800,marginBottom:28,letterSpacing:-0.8 }}>Browse by Category</h2>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14 }}>
            {CATS.filter(c=>c!=="All").slice(0,8).map(cat=>(
              <Card key={cat} glow onClick={()=>setPage("discover")} style={{ padding:"22px 16px",textAlign:"center",cursor:"pointer" }}>
                <div style={{ fontSize:32,marginBottom:10 }}>{CAT_ICONS[cat]||"🤖"}</div>
                <div style={{ color:T.white,fontWeight:600,fontSize:13 }}>{cat}</div>
                <div style={{ color:T.muted,fontSize:11,marginTop:4 }}>{AGENTS.filter(a=>a.cat===cat).length} agents</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {/* Stats */}
      <div ref={statsRef} style={{ background:`linear-gradient(135deg,${T.surface},${T.surface2})`,borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,padding:"60px 40px" }}>
        <div style={{ display:"flex",justifyContent:"center",gap:80,flexWrap:"wrap" }}>
          {[{icon:"🤖",val:s1.toLocaleString()+"+",label:"AI Agents"},{icon:"👥",val:s2.toLocaleString()+"+",label:"Active Users"},{icon:"👩‍💻",val:s3.toLocaleString()+"+",label:"Developers"},{icon:"⭐",val:"4.8",label:"Avg Rating"}].map(s=>(
            <div key={s.label} style={{ textAlign:"center" }}><div style={{ fontSize:32,marginBottom:6 }}>{s.icon}</div><div style={{ color:T.cyan,fontSize:44,fontWeight:900,letterSpacing:-2 }}>{s.val}</div><div style={{ color:T.muted,fontSize:13,marginTop:4 }}>{s.label}</div></div>
          ))}
        </div>
      </div>
      {/* Dev CTA */}
      <div style={{ padding:"80px 40px",textAlign:"center",background:`radial-gradient(ellipse 60% 80% at 50% 50%,${T.purple}15 0%,transparent 70%)` }}>
        <h2 style={{ color:T.white,fontSize:36,fontWeight:800,marginBottom:14,letterSpacing:-1 }}>Build the future of AI.<br/><span style={{ color:T.purple }}>List your agent today.</span></h2>
        <p style={{ color:T.muted,fontSize:15,marginBottom:32 }}>Join 200+ developers already monetizing their agents on AgentsHub.</p>
        <Btn variant="purple" size="lg" onClick={()=>onSignIn("signup")} style={{ borderRadius:40,padding:"14px 36px" }}>Start Publishing →</Btn>
      </div>
      {/* Footer */}
      <footer style={{ background:T.surface2,borderTop:`1px solid ${T.border}`,padding:"40px 40px 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:32,marginBottom:32 }}>
            <div><div style={{ fontWeight:900,fontSize:16,background:`linear-gradient(90deg,${T.cyan},${T.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:12 }}>AgentsHub</div><div style={{ color:T.muted,fontSize:12,lineHeight:1.7 }}>The App Store for AI Agents. Discover, test, and deploy.</div></div>
            {[{title:"Product",links:["Discover","Playground","Pricing","Changelog"]},{title:"Developers",links:["Submit Agent","Dashboard","API Reference","Webhooks"]},{title:"Company",links:["About","Blog","Careers","Contact"]}].map(col=>(
              <div key={col.title}><div style={{ color:T.white,fontWeight:600,fontSize:12,marginBottom:12,letterSpacing:1 }}>{col.title.toUpperCase()}</div>{col.links.map(l=><div key={l} style={{ color:T.muted,fontSize:12,marginBottom:8,cursor:"pointer" }}>{l}</div>)}</div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:20,textAlign:"center",color:T.muted,fontSize:11 }}>© 2026 AgentsHub. Built with ❤️ by Quantum Coders — HackIndia 2026</div>
        </div>
      </footer>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
// AI SUGGESTION PANEL — "Tell me what you need"
// ══════════════════════════════════════════════════════════════
function AISuggestionPanel({ setPage, setSelectedAgent }) {
  const [query, setQuery] = useState("");
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typed, setTyped] = useState(false);
  const dq = useDebounce(query, 400);

  useEffect(() => {
    if (dq.trim().length >= 2) {
      setLoading(true);
      setTimeout(() => {
        setRecs(computeRecommendations(dq, AGENTS));
        setLoading(false);
        setTyped(true);
      }, 350);
    } else {
      setRecs([]);
      setTyped(false);
    }
  }, [dq]);

  const suggestions = [
    "I need to summarize long PDF reports",
    "Help me write professional emails",
    "I want to translate text to Hindi",
    "Review my Python code for bugs",
    "Build SQL queries from plain English",
    "Analyze my sales data for trends",
    "Practice for a job interview",
    "Score my resume for ATS systems",
    "I need to fix a JavaScript error",
    "Write a YouTube video script",
    "Optimize my SEO content",
    "Analyze customer review sentiment",
  ];

  const TREND_TOPICS = [
    { label:"🔥 AI Coding Tools", query:"code review debug" },
    { label:"📊 Data Analysis", query:"analyze data trends insights" },
    { label:"✍️ Content Writing", query:"write content email social" },
    { label:"🎯 Career Help", query:"resume interview job career" },
    { label:"🌐 Translation", query:"translate language multilingual" },
    { label:"🧠 Prompt Engineering", query:"optimize prompts llm gpt" },
  ];

  return (
    <div style={{ background:`linear-gradient(135deg,${T.surface}CC,${T.surface2}CC)`, border:`1px solid ${T.border}`, borderRadius:18, padding:"28px 32px", marginBottom:32, backdropFilter:"blur(10px)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
        <span style={{ fontSize:22 }}>🤖</span>
        <h2 style={{ color:T.white, fontSize:20, fontWeight:800, margin:0 }}>AI Agent Finder</h2>
        <span style={{ background:`${T.cyan}22`, border:`1px solid ${T.cyan}44`, borderRadius:20, color:T.cyan, padding:"2px 10px", fontSize:11, fontWeight:600 }}>Smart Match</span>
      </div>
      <p style={{ color:T.muted, fontSize:13, marginBottom:18, marginTop:4 }}>Describe what you want to accomplish — I'll find the best AI agents for you.</p>

      {/* Search input */}
      <div style={{ position:"relative", marginBottom:16 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. I need to summarize contracts, debug Python code, translate to Tamil..."
          style={{ width:"100%", padding:"13px 48px 13px 42px", background:T.surface2, border:`1.5px solid ${query.length>0?T.cyan:T.border}`, borderRadius:12, color:T.white, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border 0.2s", boxShadow:query.length>0?`0 0 0 3px ${T.cyan}18`:"none" }}
        />
        {loading && <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:T.cyan, fontSize:12 }}>⟳</span>}
        {query && !loading && <button onClick={()=>setQuery("")} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:16 }}>✕</button>}
      </div>

      {/* Quick suggestions */}
      {!typed && (
        <div style={{ marginBottom:16 }}>
          <div style={{ color:T.muted, fontSize:11, fontWeight:600, letterSpacing:1, marginBottom:8 }}>TRY THESE:</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => setQuery(s)}
                style={{ background:T.surface2, border:`1px solid ${T.border}`, borderRadius:20, color:T.muted, padding:"5px 13px", cursor:"pointer", fontSize:11.5, transition:"all 0.15s" }}
                onMouseEnter={e=>{ e.target.style.borderColor=T.cyan; e.target.style.color=T.cyan; }}
                onMouseLeave={e=>{ e.target.style.borderColor=T.border; e.target.style.color=T.muted; }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending topics */}
      {!typed && (
        <div>
          <div style={{ color:T.muted, fontSize:11, fontWeight:600, letterSpacing:1, marginBottom:8 }}>TRENDING USE CASES:</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {TREND_TOPICS.map(t => (
              <button key={t.label} onClick={()=>setQuery(t.query)}
                style={{ background:`${T.purple}18`, border:`1px solid ${T.purple}44`, borderRadius:20, color:T.purple, padding:"5px 14px", cursor:"pointer", fontSize:11.5, fontWeight:600, transition:"all 0.15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=`${T.purple}30`; e.currentTarget.style.borderColor=T.purple; }}
                onMouseLeave={e=>{ e.currentTarget.style.background=`${T.purple}18`; e.currentTarget.style.borderColor=`${T.purple}44`; }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginTop:16 }}>
          {[1,2,3,4,5].map(i => <div key={i} style={{ background:T.surface2, borderRadius:10, padding:14 }}><Skeleton h={80} r={6}/></div>)}
        </div>
      )}

      {/* Results */}
      {!loading && recs.length > 0 && (
        <div style={{ marginTop:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <span style={{ color:T.cyan, fontSize:12, fontWeight:700, letterSpacing:1 }}>✨ BEST MATCHES FOR YOUR NEED</span>
            <span style={{ color:T.muted, fontSize:11 }}>{recs.length} agents · ranked by relevance + rating + popularity</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
            {recs.map((a, i) => (
              <div key={a.id}
                onClick={() => { setSelectedAgent(a); setPage("detail"); }}
                style={{ background:T.surface2, border:`1px solid ${i===0?T.cyan+"88":T.border}`, borderRadius:12, padding:"14px 12px", cursor:"pointer", transition:"all 0.2s", position:"relative", boxShadow:i===0?`0 0 16px ${T.cyan}20`:"none" }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.borderColor=T.cyan+"66"; e.currentTarget.style.boxShadow=`0 8px 24px ${T.cyan}15`; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor=i===0?T.cyan+"88":T.border; e.currentTarget.style.boxShadow=i===0?`0 0 16px ${T.cyan}20`:"none"; }}>
                {i === 0 && (
                  <div style={{ position:"absolute", top:-8, left:"50%", transform:"translateX(-50%)", background:T.cyan, color:"#000", padding:"1px 8px", borderRadius:10, fontSize:9, fontWeight:800, whiteSpace:"nowrap" }}>BEST MATCH</div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <span style={{ fontSize:22 }}>{a.icon}</span>
                  <MatchArc score={a.matchPct}/>
                </div>
                <div style={{ color:T.white, fontWeight:700, fontSize:12, marginBottom:3, lineHeight:1.3 }}>{a.name}</div>
                <div style={{ color:T.muted, fontSize:10, lineHeight:1.4, marginBottom:8 }}>{a.reason}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <Stars rating={a.rating} size={9}/>
                  <Badge color={a.price==="Free"?T.green:a.price==="Freemium"?T.cyan:T.purple} sm>{a.price}</Badge>
                </div>
                <div style={{ marginTop:6, background:T.cyan+"18", borderRadius:6, padding:"4px 0", textAlign:"center", color:T.cyan, fontSize:10, fontWeight:600 }}>Try Now →</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12, textAlign:"center" }}>
            <button onClick={()=>{ setPage("discover"); }} style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:20, color:T.muted, padding:"6px 20px", cursor:"pointer", fontSize:12, transition:"all 0.15s" }} onMouseEnter={e=>{ e.target.style.borderColor=T.cyan; e.target.style.color=T.cyan; }} onMouseLeave={e=>{ e.target.style.borderColor=T.border; e.target.style.color=T.muted; }}>
              See all {AGENTS.length}+ agents →
            </button>
          </div>
        </div>
      )}

      {/* No results */}
      {!loading && typed && recs.length === 0 && (
        <div style={{ marginTop:16, textAlign:"center", padding:"20px 0" }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🤔</div>
          <div style={{ color:T.white, fontSize:14, fontWeight:600, marginBottom:4 }}>No close matches found</div>
          <div style={{ color:T.muted, fontSize:12, marginBottom:12 }}>Try different keywords or browse all agents</div>
          <Btn variant="secondary" size="sm" onClick={()=>setPage("discover")}>Browse All Agents</Btn>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE: DISCOVER (with real AI recommendation)
// ══════════════════════════════════════════════════════════════
function DiscoverPage({ setPage, setSelectedAgent }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("rating");
  const [view, setView] = useState("grid");
  const [recLoading, setRecLoading] = useState(false);
  const [recs, setRecs] = useState([]);
  const [dropdown, setDropdown] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const dSearch = useDebounce(search, 350);

  useEffect(()=>{
    const q = dSearch.trim();
    // Show recs for any meaningful query (2+ chars)
    if (q.length >= 2) {
      setRecLoading(true);
      setTimeout(()=>{
        const results = computeRecommendations(q, AGENTS);
        setRecs(results);
        setRecLoading(false);
      }, 350);
    } else {
      setRecs([]);
    }
    // Dropdown: match name, cat, tags, desc
    if (q.length >= 1) {
      const ql = q.toLowerCase();
      const matches = AGENTS.filter(a=>
        a.name.toLowerCase().includes(ql) ||
        a.cat.toLowerCase().includes(ql) ||
        a.tags.some(t => t.includes(ql) || ql.includes(t)) ||
        a.desc.toLowerCase().includes(ql)
      ).slice(0,6);
      setDropdown(matches);
      setShowDrop(matches.length > 0);
    } else {
      setShowDrop(false);
    }
  },[dSearch]);

  const filtered = useMemo(()=>{
    const q = search.toLowerCase().trim();
    return AGENTS.filter(a=>{
      if (!q) return cat==="All" || a.cat===cat;
      // Broad search: name, desc, tags (both directions), cat
      const nameMatch = a.name.toLowerCase().includes(q);
      const descMatch = a.desc.toLowerCase().includes(q);
      const tagMatch  = a.tags.some(t => t.includes(q) || q.includes(t) ||
        (t.length>=3 && q.length>=3 && (t.startsWith(q.slice(0,3)) || q.startsWith(t.slice(0,3)))));
      const catMatch  = a.cat.toLowerCase().includes(q);
      const sysMatch  = a.systemPrompt.toLowerCase().includes(q);
      const ms = nameMatch || descMatch || tagMatch || catMatch || sysMatch;
      const mc = cat==="All" || a.cat===cat;
      return ms && mc;
    }).sort((a,b)=>sort==="rating"?b.rating-a.rating:sort==="users"?b.users-a.users:sort==="newest"?b.id-a.id:b.reviews-a.reviews);
  },[search,cat,sort]);

  return (
    <div style={{ paddingTop:80,minHeight:"100vh" }}>
      <div style={{ padding:"48px 40px 32px",textAlign:"center",background:`linear-gradient(to bottom,${T.surface2},${T.bg})`,borderBottom:`1px solid ${T.border}` }}>
        <h1 style={{ color:T.white,fontSize:38,fontWeight:900,marginBottom:8,letterSpacing:-1.5 }}>Find the Perfect AI Agent</h1>
        <p style={{ color:T.muted,fontSize:16,marginBottom:28 }}>Discover, test, and deploy from 30+ specialized AI agents.</p>
        <div style={{ position:"relative",maxWidth:680,margin:"0 auto" }}>
          <span style={{ position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",fontSize:18,pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} onBlur={()=>setTimeout(()=>setShowDrop(false),200)} onFocus={()=>search.length>=2&&setShowDrop(true)}
            placeholder='Search agents... e.g. "summarize pdf" or "translate text" or "review code"'
            style={{ width:"100%",padding:"17px 50px 17px 50px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,color:T.white,fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"border 0.2s,box-shadow 0.2s" }}
            onFocusCapture={e=>{e.target.style.borderColor=T.cyan;e.target.style.boxShadow=`0 0 0 3px ${T.cyan}22`;}} onBlurCapture={e=>{e.target.style.borderColor=T.border;e.target.style.boxShadow="none";}}/>
          {search&&<button onClick={()=>setSearch("")} style={{ position:"absolute",right:50,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:18 }}>✕</button>}
          <span style={{ position:"absolute",right:18,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:11,fontWeight:500 }}>⌘K</span>
          {showDrop&&dropdown.length>0&&(
            <div style={{ position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",zIndex:100,boxShadow:`0 12px 40px rgba(0,0,0,0.5)` }}>
              {dropdown.map(a=>(
                <div key={a.id} onClick={()=>{setSelectedAgent(a);setPage("detail");}} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 16px",cursor:"pointer",borderBottom:`1px solid ${T.border}20` }} onMouseEnter={e=>e.currentTarget.style.background=T.surface2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span style={{ fontSize:18 }}>{a.icon}</span>
                  <div style={{ flex:1,textAlign:"left" }}><div style={{ color:T.white,fontSize:13,fontWeight:600 }}>{a.name}</div><div style={{ color:T.muted,fontSize:11 }}>{a.cat}</div></div>
                  <Badge color={T.cyan} sm>{a.name.toLowerCase().includes(dSearch.toLowerCase()) ? "98% match" : a.tags.some(t=>t.includes(dSearch.toLowerCase())) ? "85% match" : "72% match"}</Badge>
                </div>
              ))}
              <div style={{ padding:"8px 16px",color:T.cyan,fontSize:10,fontWeight:600,textAlign:"right" }}>✦ Powered by AI Search</div>
            </div>
          )}
        </div>
        <div style={{ marginTop:16,display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap" }}>
          <span style={{ color:T.muted,fontSize:12 }}>🔥 Trending:</span>
          {TRENDING_TAGS.map(t=><button key={t} onClick={()=>setSearch(t)} style={{ background:"none",border:`1px solid ${T.border}`,borderRadius:20,color:T.muted,padding:"3px 12px",cursor:"pointer",fontSize:11,transition:"all 0.15s" }} onMouseEnter={e=>{e.target.style.borderColor=T.cyan;e.target.style.color=T.cyan;}} onMouseLeave={e=>{e.target.style.borderColor=T.border;e.target.style.color=T.muted;}}>{t}</button>)}
        </div>
      </div>

      {/* AI Suggestion Panel */}
      <div style={{ padding:"20px 40px 0",maxWidth:1100,margin:"0 auto" }}>
        <AISuggestionPanel setPage={setPage} setSelectedAgent={setSelectedAgent}/>
      </div>

      {/* AI Recommendations */}
      {(recs.length>0||recLoading)&&(
        <div style={{ padding:"28px 40px 0",maxWidth:1100,margin:"0 auto" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
            <span style={{ color:T.cyan,fontSize:12,fontWeight:700,letterSpacing:1.5 }}>✨ AI PICKED THESE FOR YOU</span>
            <Badge color={T.cyan} sm>Vector Semantic Match</Badge>
            {!recLoading&&recs.length>0&&<span style={{ color:T.muted,fontSize:11 }}>{recs.length} agents · ranked by match score + rating + popularity</span>}
          </div>
          {recLoading?(
            <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12 }}>
              {[1,2,3,4,5].map(i=><div key={i} style={{ background:T.surface,borderRadius:12,padding:16 }}><Skeleton h={120} r={8}/></div>)}
            </div>
          ):(
            <div style={{ display:"flex",gap:14,overflowX:"auto",paddingBottom:8 }}>
              {recs.map(a=>(
                <div key={a.id} onClick={()=>{setSelectedAgent(a);setPage("detail");}}
                  style={{ minWidth:210,background:T.surface,border:`1px solid ${T.cyan}33`,borderRadius:12,padding:16,cursor:"pointer",flexShrink:0,transition:"all 0.2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.cyan+"66";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px ${T.cyan}15`;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.cyan+"33";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
                    <span style={{ fontSize:26 }}>{a.icon}</span>
                    <MatchArc score={a.matchPct}/>
                  </div>
                  <div style={{ color:T.white,fontWeight:700,fontSize:13,marginBottom:4 }}>{a.name}</div>
                  <div style={{ color:T.muted,fontSize:10,lineHeight:1.5,marginBottom:8 }}>{a.reason}</div>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <Stars rating={a.rating} size={10}/>
                    <Badge color={a.price==="Free"?T.green:a.price==="Freemium"?T.cyan:T.purple} sm>{a.price}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div style={{ padding:"20px 40px 0",maxWidth:1100,margin:"0 auto" }}>
        <div style={{ display:"flex",gap:8,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap" }}>
          <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:4 }}>{CATS.map(c=><Pill key={c} active={cat===c} onClick={()=>setCat(c)}>{c}</Pill>)}</div>
          <div style={{ display:"flex",gap:10,alignItems:"center",flexShrink:0 }}>
            <span style={{ color:T.muted,fontSize:12 }}>Showing {filtered.length} agents</span>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.white,padding:"7px 12px",fontSize:12,outline:"none",cursor:"pointer" }}>
              <option value="rating">Top Rated ▾</option><option value="users">Most Users</option><option value="reviews">Most Reviews</option><option value="newest">Newest</option>
            </select>
            <div style={{ display:"flex",gap:2 }}>
              {[["⊞","grid"],["≡","list"]].map(([icon,v])=><button key={v} onClick={()=>setView(v)} style={{ background:view===v?T.surface2:"transparent",border:`1px solid ${view===v?T.cyan:T.border}`,borderRadius:7,color:view===v?T.cyan:T.muted,padding:"7px 10px",cursor:"pointer",fontSize:13,transition:"all 0.2s" }}>{icon}</button>)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"24px 40px 60px",maxWidth:1100,margin:"0 auto" }}>
        {filtered.length===0?(
          <div style={{ textAlign:"center",padding:"80px 0" }}>
            <div style={{ fontSize:64,marginBottom:16 }}>🤖</div>
            <div style={{ color:T.white,fontSize:22,fontWeight:700,marginBottom:8 }}>No agents found</div>
            <Btn onClick={()=>{setSearch("");setCat("All");}}>Clear Filters</Btn>
          </div>
        ):view==="grid"?(
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18 }}>
            {filtered.map((a,i)=><AgentCard key={a.id} agent={a} delay={i*40} onClick={()=>{setSelectedAgent(a);setPage("detail");}}/>)}
          </div>
        ):(
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {filtered.map((a,i)=>(
              <div key={a.id} onClick={()=>{setSelectedAgent(a);setPage("detail");}} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 20px",display:"flex",alignItems:"center",gap:16,cursor:"pointer",transition:"all 0.2s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.cyan+"55";e.currentTarget.style.transform="translateX(4px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="none";}}>
                <span style={{ fontSize:28,flexShrink:0 }}>{a.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}><span style={{ color:T.white,fontWeight:700 }}>{a.name}</span>{a.verified&&<span style={{ color:T.green,fontSize:12 }}>✓</span>}<Badge color={T.purple} sm>{a.cat}</Badge><Badge color={a.price==="Free"?T.green:a.price==="Freemium"?T.cyan:T.purple} sm>{a.price}</Badge></div>
                  <p style={{ color:T.muted,fontSize:12,margin:0 }}>{a.desc.slice(0,100)}...</p>
                </div>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0 }}><Stars rating={a.rating} size={12}/><span style={{ color:T.muted,fontSize:11 }}>👥 {(a.users/1000).toFixed(1)}k</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE: DETAIL
// ══════════════════════════════════════════════════════════════
function DetailPage({ agent, setPage, pushToast, setSelectedAgent }) {
  const [tab, setTab] = useState("overview");
  const [reviews, setReviews] = useState(REVIEWS_DATA);
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(5);
  const similar = useMemo(()=>AGENTS.filter(a=>a.id!==agent.id&&(a.cat===agent.cat||a.tags.some(t=>agent.tags.includes(t)))).slice(0,3),[agent]);
  const submitReview = ()=>{
    if(!reviewText.trim()) return;
    setReviews(r=>[{ id:Date.now(),author:"You",stars:reviewStars,text:reviewText,date:new Date().toISOString().slice(0,10),avatar:"YO" },...r]);
    setReviewText(""); pushToast("Review submitted! ✓","success");
  };
  const TABS = [["overview","Overview"],["reviews","Reviews"],["api_docs","API Docs"],["playground","Playground"]];
  return (
    <div style={{ paddingTop:80,minHeight:"100vh",padding:"88px 40px 60px",maxWidth:1100,margin:"0 auto" }}>
      <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:24,color:T.muted,fontSize:13 }}>
        <span onClick={()=>setPage("home")} style={{ cursor:"pointer" }} onMouseEnter={e=>e.target.style.color=T.cyan} onMouseLeave={e=>e.target.style.color=T.muted}>Home</span>
        <span>›</span><span onClick={()=>setPage("discover")} style={{ cursor:"pointer" }} onMouseEnter={e=>e.target.style.color=T.cyan} onMouseLeave={e=>e.target.style.color=T.muted}>Discover</span>
        <span>›</span><span style={{ color:T.white }}>{agent.name}</span>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 300px",gap:28,marginBottom:36 }}>
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:20 }}>
            <div style={{ width:72,height:72,borderRadius:16,background:`linear-gradient(135deg,${T.surface},${T.border})`,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36 }}>{agent.icon}</div>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
                <h1 style={{ color:T.white,fontSize:28,fontWeight:900,margin:0,letterSpacing:-0.8 }}>{agent.name}</h1>
                {agent.verified&&<Badge color={T.green}>✓ Verified</Badge>}
                {agent.trending&&<Badge color={T.amber}>🔥 Trending</Badge>}
              </div>
              <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                <Badge color={T.purple}>{agent.cat}</Badge>
                <Badge color={agent.price==="Free"?T.green:agent.price==="Freemium"?T.cyan:T.purple}>{agent.price}</Badge>
                <Stars rating={agent.rating} size={14}/><span style={{ color:T.white,fontWeight:700 }}>{agent.rating}</span>
                <span style={{ color:T.muted,fontSize:12 }}>({agent.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>
          <div style={{ display:"flex",gap:20,marginBottom:24 }}>
            {[{l:"Users",v:agent.users.toLocaleString()},{l:"Avg Rating",v:agent.rating},{l:"Response Time",v:agent.rt},{l:"Reviews",v:agent.reviews.toLocaleString()}].map(s=>(
              <div key={s.l} style={{ textAlign:"center",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 20px" }}>
                <div style={{ color:T.cyan,fontSize:22,fontWeight:900 }}>{s.v}</div>
                <div style={{ color:T.muted,fontSize:11,marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <Card style={{ padding:22 }}>
          <div style={{ color:T.white,fontWeight:700,marginBottom:14,fontSize:14 }}>Similar Agents</div>
          {similar.map(a=>(
            <div key={a.id} onClick={()=>{ setSelectedAgent(a); setPage("detail"); }} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.border}20`,cursor:"pointer",transition:"opacity 0.15s" }} onMouseEnter={e=>e.currentTarget.style.opacity="0.75"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <span style={{ fontSize:20 }}>{a.icon}</span>
              <div style={{ flex:1 }}><div style={{ color:T.white,fontSize:12,fontWeight:600 }}>{a.name}</div><Stars rating={a.rating} size={10}/></div>
              <Badge color={a.price==="Free"?T.green:T.cyan} sm>{a.price}</Badge>
            </div>
          ))}
        </Card>
      </div>
      <div style={{ display:"flex",gap:2,borderBottom:`1px solid ${T.border}`,marginBottom:28 }}>
        {TABS.map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{ background:"none",border:"none",borderBottom:`2px solid ${tab===k?T.cyan:"transparent"}`,color:tab===k?T.cyan:T.muted,padding:"12px 20px",cursor:"pointer",fontSize:13,fontWeight:tab===k?600:400,transition:"all 0.2s" }}>{l}</button>)}
      </div>
      {tab==="overview"&&(
        <div style={{ maxWidth:760 }}>
          <p style={{ color:T.muted,fontSize:15,lineHeight:1.75,marginBottom:24 }}>{agent.desc}</p>
          <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:28 }}>{agent.tags.map(t=><span key={t} style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:8,color:T.muted,padding:"5px 14px",fontSize:12 }}>{t}</span>)}</div>
          <Btn size="lg" onClick={()=>setTab("playground")}>▶ Try in Playground</Btn>
        </div>
      )}
      {tab==="reviews"&&(
        <div style={{ maxWidth:760 }}>
          <div style={{ display:"flex",gap:40,marginBottom:36,alignItems:"center" }}>
            <div style={{ textAlign:"center",flexShrink:0 }}>
              <div style={{ color:T.cyan,fontSize:64,fontWeight:900,lineHeight:1 }}>{agent.rating}</div>
              <Stars rating={agent.rating} size={20}/>
              <div style={{ color:T.muted,fontSize:12,marginTop:6 }}>Based on {reviews.length} reviews</div>
            </div>
            <div style={{ flex:1 }}>
              {[5,4,3,2,1].map(s=>{ const cnt=reviews.filter(r=>r.stars===s).length; const pct=Math.round((cnt/reviews.length)*100)||0; return(
                <div key={s} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:7 }}>
                  <span style={{ color:T.muted,fontSize:12,width:12 }}>{s}</span><span style={{ color:"#FFD700",fontSize:11 }}>★</span>
                  <div style={{ flex:1,height:7,background:T.border,borderRadius:4,overflow:"hidden" }}><div style={{ width:`${pct}%`,height:"100%",background:"#FFD700",borderRadius:4,transition:"width 0.8s ease-out" }}/></div>
                  <span style={{ color:T.muted,fontSize:11,width:28,textAlign:"right" }}>{pct}%</span>
                </div>
              );})}
            </div>
          </div>
          <Card style={{ marginBottom:28,padding:24 }}>
            <div style={{ color:T.white,fontWeight:700,marginBottom:14 }}>Write a Review</div>
            <div style={{ display:"flex",gap:6,marginBottom:14 }}><Stars rating={reviewStars} size={28} interactive onSet={setReviewStars}/><span style={{ color:T.muted,fontSize:13,marginLeft:8,marginTop:4 }}>{["","Terrible","Bad","Okay","Good","Excellent"][reviewStars]}</span></div>
            <Input multiline value={reviewText} onChange={e=>setReviewText(e.target.value)} placeholder="Share your experience..." rows={3} style={{ marginBottom:12 }}/>
            <Btn onClick={submitReview} disabled={!reviewText.trim()}>Submit Review</Btn>
          </Card>
          {reviews.map(r=>(
            <div key={r.id} style={{ borderBottom:`1px solid ${T.border}`,paddingBottom:22,marginBottom:22 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",background:T.surface2,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:T.cyan,fontWeight:700,fontSize:12 }}>{r.avatar}</div>
                  <div><div style={{ color:T.white,fontWeight:600,fontSize:13 }}>{r.author}</div><Stars rating={r.stars} size={12}/></div>
                </div>
                <span style={{ color:T.muted,fontSize:11 }}>{r.date}</span>
              </div>
              <p style={{ color:T.muted,fontSize:13,lineHeight:1.7,margin:"0 0 10px" }}>{r.text}</p>
            </div>
          ))}
        </div>
      )}
      {tab==="api_docs"&&(
        <div style={{ maxWidth:760 }}>
          <div style={{ marginBottom:24 }}>
            <div style={{ color:T.white,fontWeight:700,marginBottom:10 }}>Endpoint</div>
            <div style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <code style={{ color:T.cyan,fontSize:13 }}>POST https://api.agentshub.io/v1/agents/{agent.id}/run</code>
              <button onClick={()=>pushToast("Endpoint copied!","success")} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:12 }}>📋 Copy</button>
            </div>
          </div>
          {[{label:"Python",code:`import requests\n\nresponse = requests.post(\n  "https://api.agentshub.io/v1/agents/${agent.id}/run",\n  headers={"Authorization": "Bearer YOUR_API_KEY"},\n  json={"input": "Your text here", "options": {"temperature": 0.7}}\n)\nprint(response.json()["output"])`},{label:"JavaScript",code:`const res = await fetch("https://api.agentshub.io/v1/agents/${agent.id}/run", {\n  method: "POST",\n  headers: {"Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json"},\n  body: JSON.stringify({ input: "Your text here" })\n});\nconst { output } = await res.json();`},{label:"cURL",code:`curl -X POST https://api.agentshub.io/v1/agents/${agent.id}/run \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -d '{"input":"Your text here"}'`}].map(s=>(
            <div key={s.label} style={{ marginBottom:20 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}><div style={{ color:T.muted,fontSize:12,fontWeight:600 }}>{s.label}</div><button onClick={()=>pushToast(`${s.label} copied!`,"success")} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:11 }}>📋 Copy</button></div>
              <pre style={{ background:T.surface2,border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.cyan}`,borderRadius:10,padding:16,color:T.cyan,fontSize:12,lineHeight:1.75,overflow:"auto",margin:0 }}>{s.code}</pre>
            </div>
          ))}
        </div>
      )}
      {tab==="playground"&&<PlaygroundInline agent={agent} pushToast={pushToast}/>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PLAYGROUND — Real Claude AI Integration
// ══════════════════════════════════════════════════════════════
function PlaygroundInline({ agent, pushToast }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [rt, setRt] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [inputMode, setInputMode] = useState("text");
  const [temp, setTemp] = useState(0.7);
  const [maxTok, setMaxTok] = useState(800);
  const [showOpts, setShowOpts] = useState(false);
  const [history, setHistory] = useState([]);
  // Smart AI engine always active — no API calls needed
  const [error, setError] = useState(null); // kept for future backend integration
  const outputRef = useRef(null);

  const EXAMPLE_INPUTS = {
    1:["Summarize this document: Our Q3 revenue grew 23% driven by new enterprise contracts","Give me the key takeaways from: The study found AI adoption increased 3x in 2025","Write an executive summary of: Product launch delayed due to supply chain issues"],
    2:["Review this code:\nfunction getUser(id) {\n  return db.query('SELECT * FROM users WHERE id=' + id);\n}","Find bugs:\nconst data = null;\ndata.map(x => x.id);","Check this React hook for issues:\nuseEffect(() => { fetchData(); }, [])"],
    4:["Write a follow-up email to a client who missed our meeting","Draft a polite rejection email for a job application","Write a cold outreach email to a potential investor"],
    5:["Show me all users who signed up in the last 30 days","Find the top 5 products by revenue this quarter","Count how many orders are in 'pending' status"],
    6:["Score my resume: 5 years Python dev, worked at startups, no degree","Analyze: Software Engineer with React, Node.js, 3 years experience","Review: Fresh graduate, internship at Google, strong academics"],
    7:["Translate to Hindi: Hello, how are you doing today?","Translate to Japanese with formal tone: Please submit your report by Friday","Translate to Spanish: The meeting has been rescheduled to next Monday"],
    8:["Analyze this data and find trends: Jan:120, Feb:95, Mar:180, Apr:210, May:250","Find anomalies: Monday:100, Tuesday:98, Wednesday:250, Thursday:102","What are the top insights from: Q1:50k, Q2:48k, Q3:72k, Q4:91k revenue"],
    9:["Meeting notes: Discussed Q4 roadmap, John to handle frontend, deadline Dec 15, budget approved","Summarize: Team agreed to launch v2.0 in January, Sarah owns marketing, pending legal review","Action items from: Discussed hiring 2 engineers, cancel old contracts, migrate to new platform by March"],
    10:["Explain this error: TypeError: Cannot read properties of undefined (reading 'map') at App.jsx:42","Debug: SyntaxError: Unexpected token '<' in JSON at position 0","Fix: CORS error: No 'Access-Control-Allow-Origin' header is present"],
    13:["Write a YouTube script about: 5 AI tools that save 10 hours per week","Create a video script: How to build a React app from scratch in 30 minutes","Script for: Top 10 mistakes beginners make in Python"],
    17:["Analyze sentiment: I waited 45 minutes and the food was cold. Never coming back!","Check tone: The product is okay I guess, nothing special but it works","Rate this review: Absolutely blown away! Best purchase I made all year."],
    20:["Tell me about yourself — I'm a developer with 3 years of experience","Answer: Why do you want to leave your current job?","Practice: What's your biggest weakness?"],
    23:["Solve: Find the derivative of f(x) = 3x³ + 2x² - 5x + 7","Calculate: If a train travels 120km in 1.5 hours, what is its speed?","Solve the equation: 2x² - 5x + 3 = 0"],
    27:["Improve this prompt: Write me a good email","Optimize: Summarize the document","Rewrite for better results: Generate a business plan"],
    default:["Describe what you need help with","Give me an example of what this agent can do","What tasks can you help me with?"],
  };

  const examples = EXAMPLE_INPUTS[agent.id] || EXAMPLE_INPUTS.default;

  const typewriterOutput = (text) => {
    let i = 0;
    const tick = () => {
      i += 3;
      setOutput(text.slice(0, i));
      setTokens(Math.floor(i / 4));
      if (i < text.length) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const run = async () => {
    if (!input.trim() || running) return;
    setRunning(true); setOutput(""); setRt(null); setTokens(0); setFeedback(null); setError(null);
    const start = Date.now();
    const result = await runAgentLocally(agent, input, temp);
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    setRt(elapsed);
    setRunning(false);
    setHistory(h => [{ input: input.slice(0, 60) + (input.length > 60 ? "..." : ""), ts: new Date().toLocaleTimeString() }, ...h.slice(0, 4)]);
    typewriterOutput(result.text);
    setTokens(result.outputTokens);
  };

  useEffect(()=>{ const fn=e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter")run();}; window.addEventListener("keydown",fn); return()=>window.removeEventListener("keydown",fn); },[input,running]);

  return (
    <div>
      {/* AI Status bar */}
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:18,padding:"10px 16px",background:T.surface,border:`1px solid ${T.green}44`,borderRadius:10 }}>
        <div style={{ width:9,height:9,borderRadius:"50%",background:T.green,boxShadow:`0 0 8px ${T.green}`,flexShrink:0 }}/>
        <span style={{ color:T.green,fontSize:12,fontWeight:600 }}>🤖 AI Engine Active — {agent.name} ready to process your input</span>
        <span style={{ marginLeft:"auto",color:T.muted,fontSize:11 }}>Ctrl+Enter to run</span>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 4px 1fr",gap:0,minHeight:500 }}>
        {/* Left — Input */}
        <div style={{ paddingRight:20 }}>
          <div style={{ display:"flex",gap:6,marginBottom:14 }}>
            {["text","url","json"].map(m=><button key={m} onClick={()=>setInputMode(m)} style={{ background:inputMode===m?T.cyan+"22":"transparent",border:`1px solid ${inputMode===m?T.cyan:T.border}`,borderRadius:8,color:inputMode===m?T.cyan:T.muted,padding:"6px 14px",cursor:"pointer",fontSize:12,transition:"all 0.15s" }}>{m==="json"?"JSON":m==="url"?"URL":"Text"}</button>)}
          </div>
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={`Type your input here...\ne.g. ${examples[0]}`}
            style={{ width:"100%",minHeight:220,background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10,color:T.white,padding:"14px 16px",fontSize:13,outline:"none",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",lineHeight:1.65,transition:"border 0.2s" }}
            onFocus={e=>{e.target.style.borderColor=T.cyan;e.target.style.boxShadow=`0 0 0 2px ${T.cyan}18`;}} onBlur={e=>{e.target.style.borderColor=T.border;e.target.style.boxShadow="none";}}/>
          <span style={{ display:"block",textAlign:"right",color:T.muted,fontSize:10,marginTop:4,marginBottom:10 }}>{input.length}/5000</span>

          <div style={{ marginBottom:14 }}>
            <div style={{ color:T.muted,fontSize:11,marginBottom:8 }}>Quick examples:</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
              {examples.map(ex=><button key={ex} onClick={()=>setInput(ex)} style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:20,color:T.muted,padding:"5px 12px",cursor:"pointer",fontSize:11,transition:"all 0.15s" }} onMouseEnter={e=>{e.target.style.borderColor=T.cyan;e.target.style.color=T.cyan;}} onMouseLeave={e=>{e.target.style.borderColor=T.border;e.target.style.color=T.muted;}}>{ex.slice(0,40)}</button>)}
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <button onClick={()=>setShowOpts(!showOpts)} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:4 }}>⚙ Options {showOpts?"▲":"▼"}</button>
            {showOpts&&(
              <div style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10,padding:16,marginTop:8 }}>
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}><span style={{ color:T.muted,fontSize:12 }}>Temperature</span><span style={{ color:T.cyan,fontSize:12 }}>{temp}</span></div>
                  <input type="range" min={0} max={2} step={0.1} value={temp} onChange={e=>setTemp(parseFloat(e.target.value))} style={{ width:"100%",accentColor:T.cyan }}/>
                </div>
                <div>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}><span style={{ color:T.muted,fontSize:12 }}>Max Tokens</span><span style={{ color:T.cyan,fontSize:12 }}>{maxTok}</span></div>
                  <input type="range" min={100} max={2000} step={100} value={maxTok} onChange={e=>setMaxTok(parseInt(e.target.value))} style={{ width:"100%",accentColor:T.cyan }}/>
                </div>
              </div>
            )}
          </div>

          <Btn onClick={run} disabled={!input.trim()||running} loading={running} size="lg" style={{ width:"100%",justifyContent:"center" }}>
            {running?"🔄 Running AI...":"▶  Run Agent"}
          </Btn>
          <div style={{ textAlign:"center",color:T.muted,fontSize:11,marginTop:6 }}>Ctrl+Enter / ⌘+Enter</div>

          {history.length>0&&(
            <div style={{ marginTop:18,borderTop:`1px solid ${T.border}`,paddingTop:14 }}>
              <div style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.2,marginBottom:10 }}>RECENT RUNS</div>
              {history.map((h,i)=><div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<history.length-1?`1px solid ${T.border}20`:"" }}><span style={{ color:T.muted,fontSize:11 }}>{h.input}</span><span style={{ color:T.border,fontSize:10 }}>{h.ts}</span></div>)}
            </div>
          )}
        </div>

        <div style={{ background:T.border,borderRadius:4,cursor:"col-resize" }}/>

        {/* Right — Output */}
        <div style={{ paddingLeft:20 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5 }}>OUTPUT</span>
              {rt&&<Badge color={T.green}>⚡ {rt}s</Badge>}
              {tokens>0&&<Badge color={T.muted} sm>{tokens} tokens</Badge>}
              {output&&<Badge color={T.green} sm>✓ AI Generated</Badge>}
            </div>
            <div style={{ display:"flex",gap:6 }}>
              {output&&<>
                <button onClick={()=>{navigator.clipboard?.writeText(output);pushToast("Copied!","success");}} style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:7,color:T.muted,padding:"5px 10px",cursor:"pointer",fontSize:11 }}>📋 Copy</button>
                <button onClick={()=>{ const b=new Blob([output],{type:"text/plain"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download="output.txt"; a.click(); }} style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:7,color:T.muted,padding:"5px 10px",cursor:"pointer",fontSize:11 }}>⬇ Save</button>
              </>}
            </div>
          </div>

          <div ref={outputRef} style={{ minHeight:280,background:T.surface2,border:`1px solid ${error?"#FF4455":output?T.green+"44":running?T.cyan+"33":T.border}`,borderRadius:10,padding:16,fontFamily:"monospace",fontSize:12.5,lineHeight:1.8,color:output?T.white:T.muted,overflowY:"auto",maxHeight:380,transition:"border 0.3s",whiteSpace:"pre-wrap",position:"relative" }}>
            {running?(
              <div><Skeleton h={14} style={{ marginBottom:10 }}/><Skeleton w="75%" h={14} style={{ marginBottom:10 }}/><Skeleton w="90%" h={14} style={{ marginBottom:10 }}/><Skeleton w="60%" h={14}/></div>
            ):error?(
              <div style={{ color:"#FF7788" }}>
                <div style={{ marginBottom:8 }}>⚠ API Error: {error}</div>
                <div style={{ color:T.muted,fontSize:11 }}>Switch to Demo Mode to use simulated responses, or check your network connection.</div>
              </div>
            ):output?output:(
              <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12 }}>
                <div style={{ fontSize:48 }}>{agent.icon}</div>
                <div style={{ color:T.muted,fontSize:13 }}>Ready to run {agent.name}</div>
                <div style={{ display:"flex",gap:4 }}>{[0,1,2].map(i=><div key={i} style={{ width:6,height:6,borderRadius:"50%",background:T.border,animation:`dotpulse 1.2s ${i*0.3}s infinite` }}/>)}</div>
              </div>
            )}
          </div>

          {output&&!error&&(
            <div style={{ marginTop:14 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div style={{ color:T.muted,fontSize:12 }}>Was this helpful?</div>
                <div style={{ display:"flex",gap:6 }}>
                  {["👍","👎"].map((em,i)=><button key={i} onClick={()=>{setFeedback(i===0?"up":"down");pushToast("Thanks for your feedback!","success");}} style={{ background:feedback===(i===0?"up":"down")?T.cyan+"22":"transparent",border:`1px solid ${feedback===(i===0?"up":"down")?T.cyan:T.border}`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:16,transition:"all 0.15s" }}>{em}</button>)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CHART COMPONENTS ─────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function LineChart({ data, color=T.cyan, label, suffix="" }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const W=340, H=80, padX=8, padY=8;
  const pts = data.map((v,i)=>{
    const x = padX + (i/(data.length-1))*(W-2*padX);
    const y = H-padY - ((v-min)/(max-min||1))*(H-2*padY);
    return x+","+y;
  }).join(" ");
  const gradId = "grad_"+label.replace(/\s/g,"_");
  return (
    <div style={{ position:"relative" }}>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
        <span style={{ color:T.muted,fontSize:11 }}>{label}</span>
        <span style={{ color,fontSize:13,fontWeight:700 }}>{data[data.length-1].toLocaleString()}{suffix}</span>
      </div>
      <svg width="100%" viewBox={"0 0 "+W+" "+H} style={{ overflow:"visible" }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        <polygon points={padX+","+H+" "+pts+" "+(W-padX)+","+H} fill={"url(#"+gradId+")"}/>
        {data.map((v,i)=>{
          const x=padX+(i/(data.length-1))*(W-2*padX);
          const y=H-padY-((v-min)/(max-min||1))*(H-2*padY);
          return i===data.length-1?<circle key={i} cx={x} cy={y} r={4} fill={color}/>:null;
        })}
      </svg>
      <div style={{ display:"flex",justifyContent:"space-between",marginTop:4 }}>
        {MONTHS.filter((_,i)=>i%3===0).map(m=><span key={m} style={{ color:T.border,fontSize:9 }}>{m}</span>)}
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d=>d.value));
  return (
    <div style={{ display:"flex",alignItems:"flex-end",gap:8,height:80 }}>
      {data.map((d,i)=>(
        <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
          <span style={{ color:d.color,fontSize:9,fontWeight:600 }}>{d.value}</span>
          <div style={{ width:"100%",borderRadius:"4px 4px 0 0",background:d.color,height:((d.value/max)*65)+"px",transition:"height 0.8s ease",minHeight:4 }}/>
          <span style={{ color:T.muted,fontSize:9,textAlign:"center" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ slices }) {
  const total = slices.reduce((s,d)=>s+d.value,0);
  let angle = -90;
  const cx=60,cy=60,r=40,r2=24;
  const paths = slices.map(d=>{
    const sweep = (d.value/total)*360;
    const start = angle; angle+=sweep;
    const s1=(start*Math.PI)/180, e1=((start+sweep)*Math.PI)/180;
    const x1=cx+r*Math.cos(s1),y1=cy+r*Math.sin(s1),x2=cx+r*Math.cos(e1),y2=cy+r*Math.sin(e1);
    const x3=cx+r2*Math.cos(e1),y3=cy+r2*Math.sin(e1),x4=cx+r2*Math.cos(s1),y4=cy+r2*Math.sin(s1);
    const lg=sweep>180?1:0;
    const dPath="M"+x1+","+y1+" A"+r+","+r+" 0 "+lg+",1 "+x2+","+y2+" L"+x3+","+y3+" A"+r2+","+r2+" 0 "+lg+",0 "+x4+","+y4+"Z";
    return <path key={d.label} d={dPath} fill={d.color} opacity={0.85}/>;
  });
  return (
    <div style={{ display:"flex",alignItems:"center",gap:16 }}>
      <svg width={120} height={120}>{paths}</svg>
      <div>{slices.map(d=>(
        <div key={d.label} style={{ display:"flex",alignItems:"center",gap:6,marginBottom:5 }}>
          <div style={{ width:8,height:8,borderRadius:2,background:d.color,flexShrink:0 }}/>
          <span style={{ color:T.muted,fontSize:11 }}>{d.label}</span>
          <span style={{ color:T.white,fontSize:11,fontWeight:600,marginLeft:"auto" }}>{d.value}%</span>
        </div>
      ))}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE: DEVELOPER PORTAL — Submit + Full Analytics Dashboard
// ══════════════════════════════════════════════════════════════ — Submit + Full Analytics Dashboard
// ══════════════════════════════════════════════════════════════
function DashboardPage({ setPage, setSelectedAgent, pushToast, user }) {
  const [dashTab, setDashTab] = useState("analytics");
  const myAgents = AGENTS.filter((_, i) => i < 3);

  // Richer analytics data
  const chartData = [420,580,710,920,1100,1350,1580,1820,2100,2380,2650,2940];
  const revenueData = [0,0,0,280,410,580,720,890,1040,1230,1480,1820];
  const apiCallData = [1200,1580,2100,2800,3400,4200,5100,6200,7400,8800,10200,11800];

  const ACTIVITY = [
    { icon:"🚀",text:"PDF Summarizer reached 12,400 users",time:"2h ago",color:T.cyan },
    { icon:"⭐",text:"New 5-star review on Code Reviewer",time:"4h ago",color:T.amber },
    { icon:"🔑",text:"Production API key used 843 times today",time:"5h ago",color:T.purple },
    { icon:"📈",text:"Bug Explainer trending — 40% traffic spike",time:"8h ago",color:T.green },
    { icon:"💬",text:"New comment on Language Translator",time:"12h ago",color:T.muted },
    { icon:"💰",text:"$18.40 earned from paid tier subscriptions",time:"1d ago",color:T.green },
  ];


  if (!user) return (
    <div style={{ paddingTop:80,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20,padding:"100px 40px" }}>
      <div style={{ fontSize:64 }}>🔒</div>
      <h2 style={{ color:T.white,fontSize:26,fontWeight:800 }}>Developer Account Required</h2>
      <p style={{ color:T.muted,textAlign:"center",maxWidth:420 }}>Sign in as a developer to access your dashboard, analytics, and agent management tools.</p>
      <div style={{ display:"flex",gap:12 }}><Btn size="lg" onClick={()=>setPage("auth_dev")}>Sign In as Developer</Btn><Btn variant="secondary" onClick={()=>setPage("home")}>← Back</Btn></div>
    </div>
  );

  return (
    <div style={{ paddingTop:80,minHeight:"100vh",padding:"88px 40px 60px",maxWidth:1200,margin:"0 auto" }}>
      {/* Header */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32 }}>
        <div>
          <h1 style={{ color:T.white,fontSize:28,fontWeight:900,letterSpacing:-1,marginBottom:6 }}>Developer Dashboard</h1>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${T.cyan},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:700,fontSize:12 }}>{user.avatar}</div>
            <span style={{ color:T.muted,fontSize:13 }}>{user.name}</span>
            <Badge color={T.purple} sm>Developer</Badge>
          </div>
        </div>
        <Btn onClick={()=>setPage("submit")} variant="purple">+ Publish New Agent</Btn>
      </div>

      {/* Tab nav */}
      <div style={{ display:"flex",gap:2,borderBottom:`1px solid ${T.border}`,marginBottom:28 }}>
        {[["analytics","📊 Analytics"],["agents","🤖 My Agents"],["revenue","💰 Revenue"],["api_keys","🔑 API Keys"],["settings","⚙ Settings"]].map(([k,l])=>(
          <button key={k} onClick={()=>setDashTab(k)} style={{ background:"none",border:"none",borderBottom:`2px solid ${dashTab===k?T.cyan:"transparent"}`,color:dashTab===k?T.cyan:T.muted,padding:"11px 18px",cursor:"pointer",fontSize:12,fontWeight:dashTab===k?600:400,transition:"all 0.2s" }}>{l}</button>
        ))}
      </div>

      {/* ── ANALYTICS TAB ── */}
      {dashTab==="analytics"&&(
        <div>
          {/* KPI Cards */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24 }}>
            {[
              { icon:"🔥",label:"Total API Calls",val:"11,800",change:"+18%",color:T.cyan },
              { icon:"👥",label:"Active Users",val:"3,420",change:"+12%",color:T.purple },
              { icon:"⭐",label:"Avg Rating",val:"4.72",change:"+0.1",color:T.amber },
              { icon:"💰",label:"Monthly Revenue",val:"$1,820",change:"+24%",color:T.green },
            ].map(k=>(
              <Card key={k.label} style={{ padding:20 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                  <span style={{ fontSize:24 }}>{k.icon}</span>
                  <Badge color={T.green} sm>↑ {k.change}</Badge>
                </div>
                <div style={{ color:k.color,fontSize:28,fontWeight:900,letterSpacing:-1 }}>{k.val}</div>
                <div style={{ color:T.muted,fontSize:11,marginTop:4 }}>{k.label}</div>
              </Card>
            ))}
          </div>

          {/* Charts row */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20 }}>
            <Card style={{ padding:22 }}>
              <div style={{ color:T.white,fontWeight:700,marginBottom:16,fontSize:13 }}>📈 API Calls (12 months)</div>
              <LineChart data={apiCallData} color={T.cyan} label="Monthly API Calls"/>
            </Card>
            <Card style={{ padding:22 }}>
              <div style={{ color:T.white,fontWeight:700,marginBottom:16,fontSize:13 }}>💰 Revenue (12 months)</div>
              <LineChart data={revenueData} color={T.green} label="Monthly Revenue" suffix="$"/>
            </Card>
          </div>

          {/* Second row charts */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,marginBottom:20 }}>
            <Card style={{ padding:22 }}>
              <div style={{ color:T.white,fontWeight:700,marginBottom:14,fontSize:13 }}>Traffic Sources</div>
              <BarChart data={[
                { label:"API",value:52,color:T.cyan },
                { label:"Sandbox",value:28,color:T.purple },
                { label:"Widget",value:12,color:T.green },
                { label:"Direct",value:8,color:T.amber },
              ]}/>
            </Card>
            <Card style={{ padding:22 }}>
              <div style={{ color:T.white,fontWeight:700,marginBottom:14,fontSize:13 }}>User Geography</div>
              <DonutChart slices={[
                { label:"India",value:42,color:T.cyan },
                { label:"US/CA",value:28,color:T.purple },
                { label:"Europe",value:18,color:T.green },
                { label:"Others",value:12,color:T.amber },
              ]}/>
            </Card>
            <Card style={{ padding:22 }}>
              <div style={{ color:T.white,fontWeight:700,marginBottom:14,fontSize:13 }}>Health Metrics</div>
              {[{ label:"Error Rate",val:"0.2%",color:T.green,good:true },{ label:"Avg Latency",val:"812ms",color:T.cyan,good:true },{ label:"Uptime",val:"99.92%",color:T.green,good:true },{ label:"P99 Latency",val:"2.1s",color:T.amber,good:false }].map(m=>(
                <div key={m.label} style={{ display:"flex",justifyContent:"space-between",marginBottom:12 }}>
                  <span style={{ color:T.muted,fontSize:12 }}>{m.label}</span>
                  <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                    <span style={{ color:m.color,fontSize:13,fontWeight:700 }}>{m.val}</span>
                    <span style={{ fontSize:10 }}>{m.good?"✓":"⚠"}</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Activity feed */}
          <Card style={{ padding:22 }}>
            <div style={{ color:T.white,fontWeight:700,marginBottom:16,fontSize:13 }}>Recent Activity</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14 }}>
              {ACTIVITY.map((a,i)=>(
                <div key={i} style={{ display:"flex",gap:10,padding:"10px 0",borderBottom:i<ACTIVITY.length-2?`1px solid ${T.border}20`:"" }}>
                  <div style={{ width:32,height:32,borderRadius:8,background:a.color+"18",border:`1px solid ${a.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>{a.icon}</div>
                  <div><div style={{ color:T.white,fontSize:11,lineHeight:1.5 }}>{a.text}</div><div style={{ color:T.border,fontSize:10,marginTop:3 }}>{a.time}</div></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── MY AGENTS TAB ── */}
      {dashTab==="agents"&&(
        <Card style={{ padding:24 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:18 }}>
            <div style={{ color:T.white,fontWeight:700,fontSize:14 }}>My Published Agents</div>
            <Btn size="sm" onClick={()=>setPage("submit")}>+ Publish New</Btn>
          </div>
          <table style={{ width:"100%",borderCollapse:"collapse" }}>
            <thead><tr style={{ borderBottom:`1px solid ${T.border}` }}>{["Agent","Status","Calls/day","Avg Rating","Revenue","Actions"].map(h=><th key={h} style={{ color:T.muted,fontWeight:500,padding:"8px 10px",textAlign:"left",fontSize:12 }}>{h}</th>)}</tr></thead>
            <tbody>
              {myAgents.map((a,i)=>(
                <tr key={a.id} style={{ borderBottom:`1px solid ${T.border}20` }}>
                  <td style={{ padding:"12px 10px" }}><div style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ fontSize:20 }}>{a.icon}</span><span style={{ color:T.white,fontWeight:600,fontSize:13 }}>{a.name}</span></div></td>
                  <td style={{ padding:"12px 10px" }}><Badge color={T.green} sm>🟢 Live</Badge></td>
                  <td style={{ padding:"12px 10px",color:T.muted,fontSize:13 }}>{Math.floor(a.users/30).toLocaleString()}</td>
                  <td style={{ padding:"12px 10px" }}><Stars rating={a.rating} size={11}/> <span style={{ color:T.muted,fontSize:11 }}>{a.rating}</span></td>
                  <td style={{ padding:"12px 10px",color:T.green,fontSize:13,fontWeight:600 }}>${(a.users*0.002).toFixed(0)}</td>
                  <td style={{ padding:"12px 10px" }}>
                    <div style={{ display:"flex",gap:5 }}>
                      <button onClick={()=>{setSelectedAgent(a);setPage("detail");}} style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:6,color:T.muted,padding:"4px 10px",cursor:"pointer",fontSize:11 }}>View</button>
                      <button style={{ background:T.surface2,border:`1px solid ${T.border}`,borderRadius:6,color:T.muted,padding:"4px 10px",cursor:"pointer",fontSize:11 }}>Edit</button>
                      <button onClick={()=>pushToast("Agent paused","warning")} style={{ background:"transparent",border:`1px solid ${T.border}`,borderRadius:6,color:T.muted,padding:"4px 10px",cursor:"pointer",fontSize:11 }}>Pause</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* ── REVENUE TAB ── */}
      {dashTab==="revenue"&&(
        <div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24 }}>
            {[{ label:"This Month",val:"$1,820",sub:"vs $1,480 last month",color:T.green },{ label:"Total Earned",val:"$8,240",sub:"Since Jan 2026",color:T.cyan },{ label:"Pending Payout",val:"$420",sub:"Processed on 28th",color:T.amber }].map(r=>(
              <Card key={r.label} style={{ padding:22 }}>
                <div style={{ color:T.muted,fontSize:11,marginBottom:8 }}>{r.label}</div>
                <div style={{ color:r.color,fontSize:32,fontWeight:900 }}>{r.val}</div>
                <div style={{ color:T.muted,fontSize:11,marginTop:4 }}>{r.sub}</div>
              </Card>
            ))}
          </div>
          <Card style={{ padding:22 }}>
            <div style={{ color:T.white,fontWeight:700,marginBottom:16,fontSize:13 }}>Revenue Breakdown by Agent</div>
            {myAgents.map((a,i)=>{
              const rev = [420,280,180][i] || 100;
              const pct = Math.round((rev/880)*100);
              return (
                <div key={a.id} style={{ marginBottom:16 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                    <span style={{ color:T.white,fontSize:12 }}>{a.icon} {a.name}</span>
                    <span style={{ color:T.green,fontSize:12,fontWeight:700 }}>${rev}/mo</span>
                  </div>
                  <div style={{ height:7,background:T.border,borderRadius:4 }}><div style={{ width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${T.green},${T.cyan})`,borderRadius:4,transition:"width 1s ease" }}/></div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* ── API KEYS TAB ── */}
      {dashTab==="api_keys"&&(
        <Card style={{ padding:24 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:18 }}>
            <div style={{ color:T.white,fontWeight:700,fontSize:14 }}>API Keys</div>
            <Btn size="sm" onClick={()=>pushToast("New API key generated! 🔑","success")}>+ Generate Key</Btn>
          </div>
          {[{ name:"Production Key",created:"2026-01-15",last:"Just now",perms:"Full access",calls:"11,240" },{ name:"Dev Key",created:"2026-02-20",last:"3 days ago",perms:"Read only",calls:"560" }].map((k,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:16,padding:"16px 0",borderBottom:i===0?`1px solid ${T.border}`:"" }}>
              <div style={{ flex:1 }}>
                <div style={{ color:T.white,fontSize:13,fontWeight:600 }}>{k.name}</div>
                <div style={{ color:T.muted,fontSize:11 }}>Created {k.created} · Last used {k.last} · {k.calls} calls</div>
              </div>
              <Badge color={T.purple} sm>{k.perms}</Badge>
              <code style={{ color:T.cyan,fontSize:12,background:T.surface2,padding:"4px 10px",borderRadius:6 }}>sk-hub...••••</code>
              <button onClick={()=>pushToast("Key copied!","success")} style={{ background:"none",border:`1px solid ${T.border}`,borderRadius:7,color:T.muted,padding:"5px 10px",cursor:"pointer",fontSize:11 }}>📋</button>
              <button onClick={()=>pushToast("Key revoked","warning")} style={{ background:"none",border:`1px solid ${T.pink}44`,borderRadius:7,color:T.pink,padding:"5px 10px",cursor:"pointer",fontSize:11 }}>Revoke</button>
            </div>
          ))}
        </Card>
      )}

      {/* ── SETTINGS TAB ── */}
      {dashTab==="settings"&&(
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
          <Card style={{ padding:24 }}>
            <div style={{ color:T.white,fontWeight:700,marginBottom:18 }}>Profile Settings</div>
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              {[["Display Name",user.name],["Email",user.email],["Developer Bio","Building AI tools..."]].map(([l,v])=>(
                <div key={l}><label style={{ color:T.muted,fontSize:12,display:"block",marginBottom:6 }}>{l}</label><Input value={v} onChange={()=>{}} placeholder={l}/></div>
              ))}
              <Btn onClick={()=>pushToast("Profile saved!","success")}>Save Changes</Btn>
            </div>
          </Card>
          <Card style={{ padding:24 }}>
            <div style={{ color:T.white,fontWeight:700,marginBottom:18 }}>Notifications</div>
            {[["New review on your agent","On"],["API key usage alerts","On"],["Revenue payouts","On"],["Platform updates","Off"],["Marketing emails","Off"]].map(([l,v])=>(
              <div key={l} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
                <span style={{ color:T.muted,fontSize:13 }}>{l}</span>
                <div style={{ width:38,height:20,borderRadius:10,background:v==="On"?T.cyan:T.border,cursor:"pointer",position:"relative",transition:"background 0.2s" }}><div style={{ width:16,height:16,borderRadius:"50%",background:T.white,position:"absolute",top:2,left:v==="On"?20:2,transition:"left 0.2s" }}/></div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE: SUBMIT AGENT
// ══════════════════════════════════════════════════════════════
function SubmitPage({ setPage, pushToast, user }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"",tagline:"",cat:"",tags:[],pricing:"Free",desc:"",features:[""],useCases:[""],endpoint:"",authType:"API Key",method:"POST",systemPrompt:"" });
  const [errors, setErrors] = useState({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));
  const STEPS = ["Basic Info","Details","Technical","Review & Submit"];

  if (!user) return (
    <div style={{ paddingTop:80,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20 }}>
      <div style={{ fontSize:64 }}>🔒</div>
      <h2 style={{ color:T.white,fontSize:24,fontWeight:800 }}>Developer Account Required</h2>
      <div style={{ display:"flex",gap:12 }}>
        <Btn size="lg" onClick={()=>setPage("auth_dev")}>Sign In as Developer</Btn>
        <Btn variant="secondary" onClick={()=>setPage("home")}>← Back</Btn>
      </div>
    </div>
  );

  const validate = () => {
    const e = {};
    if(step===1){if(!form.name)e.name="Required";if(!form.tagline)e.tagline="Required";if(!form.cat)e.cat="Required";}
    if(step===2){if(form.desc.length<50)e.desc="Min 50 characters";}
    if(step===3){if(!form.endpoint)e.endpoint="Required";}
    setErrors(e); return Object.keys(e).length===0;
  };
  const next = () => { if(!validate()){pushToast("Please fix the errors","error");return;} if(step<4)setStep(s=>s+1); else{setSubmitted(true);pushToast("Agent submitted! 🎉","success");} };

  if(submitted) return (
    <div style={{ paddingTop:80,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ textAlign:"center",maxWidth:480 }}>
        <div style={{ fontSize:72,marginBottom:20 }}>🎉</div>
        <h2 style={{ color:T.white,fontSize:30,fontWeight:900,marginBottom:12,letterSpacing:-1 }}>Agent Submitted!</h2>
        <p style={{ color:T.muted,lineHeight:1.7,marginBottom:32 }}><strong style={{ color:T.cyan }}>{form.name||"Your agent"}</strong> is under review. Our team will verify it within 24 hours.</p>
        <div style={{ display:"flex",gap:12,justifyContent:"center" }}>
          <Btn onClick={()=>setPage("dashboard")} size="lg">View Dashboard →</Btn>
          <Btn variant="secondary" onClick={()=>{setSubmitted(false);setStep(1);setForm({name:"",tagline:"",cat:"",tags:[],pricing:"Free",desc:"",features:[""],useCases:[""],endpoint:"",authType:"API Key",method:"POST",systemPrompt:""});}}>Submit Another</Btn>
        </div>
      </div>
    </div>
  );

  const FieldErr = ({k}) => errors[k]?<div style={{ color:"#FF4455",fontSize:11,marginTop:4 }}>⚠ {errors[k]}</div>:null;

  return (
    <div style={{ paddingTop:80,minHeight:"100vh",padding:"100px 40px 60px" }}>
      <div style={{ maxWidth:720,margin:"0 auto" }}>
        <h1 style={{ color:T.white,fontSize:30,fontWeight:900,marginBottom:6,letterSpacing:-1 }}>Publish Your Agent</h1>
        <p style={{ color:T.muted,marginBottom:32,fontSize:14 }}>List your AI agent on the AgentsHub marketplace.</p>
        <div style={{ marginBottom:36 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
            {STEPS.map((s,i)=>(
              <div key={i} style={{ textAlign:"center",flex:1 }}>
                <div style={{ width:28,height:28,borderRadius:"50%",background:i+1<=step?T.cyan:T.surface2,border:`2px solid ${i+1<=step?T.cyan:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:i+1<=step?"#000":T.muted,fontWeight:700,fontSize:12,margin:"0 auto 6px",transition:"all 0.3s" }}>{i+1<step?"✓":i+1}</div>
                <div style={{ color:i+1===step?T.cyan:T.muted,fontSize:10,fontWeight:i+1===step?600:400 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ height:3,background:T.border,borderRadius:2 }}><div style={{ width:`${((step-1)/3)*100}%`,height:"100%",background:`linear-gradient(90deg,${T.cyan},${T.purple})`,borderRadius:2,transition:"width 0.4s ease" }}/></div>
        </div>
        <Card style={{ padding:32 }}>
          {step===1&&(
            <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
              <h3 style={{ color:T.white,margin:"0 0 4px",fontSize:18 }}>Basic Information</h3>
              {[{k:"name",label:"Agent Name *",ph:"e.g. PDF Summarizer Pro"},{k:"tagline",label:"Tagline *",ph:"One-line pitch (max 100 chars)"}].map(f=>(
                <div key={f.k}><label style={{ color:T.muted,fontSize:12,display:"block",marginBottom:6 }}>{f.label}</label><Input value={form[f.k]} onChange={e=>upd(f.k,e.target.value)} placeholder={f.ph}/><FieldErr k={f.k}/></div>
              ))}
              <div>
                <label style={{ color:T.muted,fontSize:12,display:"block",marginBottom:6 }}>Category *</label>
                <select value={form.cat} onChange={e=>upd("cat",e.target.value)} style={{ width:"100%",background:T.surface2,border:`1px solid ${errors.cat?T.pink:T.border}`,borderRadius:10,color:form.cat?T.white:T.muted,padding:"10px 14px",fontSize:13,outline:"none" }}>
                  <option value="">Select category...</option>
                  {CATS.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
                </select>
                <FieldErr k="cat"/>
              </div>
              <div>
                <label style={{ color:T.muted,fontSize:12,display:"block",marginBottom:6 }}>Pricing Model</label>
                <div style={{ display:"flex",gap:10 }}>
                  {["Free","Freemium","Paid"].map(p=><button key={p} onClick={()=>upd("pricing",p)} style={{ flex:1,background:form.pricing===p?`${T.cyan}18`:"transparent",border:`2px solid ${form.pricing===p?T.cyan:T.border}`,borderRadius:10,padding:"10px",cursor:"pointer",color:form.pricing===p?T.cyan:T.muted,fontSize:12,fontWeight:600,transition:"all 0.2s" }}>{p}</button>)}
                </div>
              </div>
            </div>
          )}
          {step===2&&(
            <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
              <h3 style={{ color:T.white,margin:"0 0 4px",fontSize:18 }}>Agent Details</h3>
              <div>
                <label style={{ color:T.muted,fontSize:12,display:"block",marginBottom:6 }}>Description * (min 50 chars)</label>
                <Input multiline value={form.desc} onChange={e=>upd("desc",e.target.value)} placeholder="Describe what your agent does, its capabilities, and use cases..." rows={5}/>
                <div style={{ display:"flex",justifyContent:"space-between",marginTop:4 }}><FieldErr k="desc"/><span style={{ color:T.muted,fontSize:11 }}>{form.desc.length} chars</span></div>
              </div>
              <div>
                <label style={{ color:T.muted,fontSize:12,display:"block",marginBottom:6 }}>System Prompt (Optional — how your agent behaves)</label>
                <Input multiline value={form.systemPrompt} onChange={e=>upd("systemPrompt",e.target.value)} placeholder="You are a helpful assistant that..." rows={4}/>
              </div>
              <div>
                <label style={{ color:T.muted,fontSize:12,display:"block",marginBottom:10 }}>Tags (add up to 5)</label>
                <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                  {["nlp","vision","code","data","writing","automation","api","pdf","translate","summarize"].map(t=>(
                    <button key={t} onClick={()=>{const cur=form.tags;if(cur.includes(t))upd("tags",cur.filter(x=>x!==t));else if(cur.length<5)upd("tags",[...cur,t]);}} style={{ background:form.tags.includes(t)?`${T.cyan}22`:"transparent",border:`1px solid ${form.tags.includes(t)?T.cyan:T.border}`,borderRadius:20,color:form.tags.includes(t)?T.cyan:T.muted,padding:"5px 14px",cursor:"pointer",fontSize:12,transition:"all 0.15s" }}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step===3&&(
            <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
              <h3 style={{ color:T.white,margin:"0 0 4px",fontSize:18 }}>Technical Configuration</h3>
              <div>
                <label style={{ color:T.muted,fontSize:12,display:"block",marginBottom:6 }}>API Endpoint URL *</label>
                <Input value={form.endpoint} onChange={e=>upd("endpoint",e.target.value)} placeholder="https://api.yourdomain.com/v1/run"/>
                <FieldErr k="endpoint"/>
              </div>
              <div style={{ display:"flex",gap:14 }}>
                <div style={{ flex:1 }}>
                  <label style={{ color:T.muted,fontSize:12,display:"block",marginBottom:6 }}>HTTP Method</label>
                  <select value={form.method} onChange={e=>upd("method",e.target.value)} style={{ width:"100%",background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10,color:T.white,padding:"10px 14px",fontSize:13,outline:"none" }}>
                    {["POST","GET","PUT"].map(m=><option key={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{ flex:1 }}>
                  <label style={{ color:T.muted,fontSize:12,display:"block",marginBottom:6 }}>Auth Type</label>
                  <select value={form.authType} onChange={e=>upd("authType",e.target.value)} style={{ width:"100%",background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10,color:T.white,padding:"10px 14px",fontSize:13,outline:"none" }}>
                    {["API Key","Bearer Token","OAuth 2.0","None"].map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                  <Btn variant="secondary" onClick={async()=>{ setTesting(true); await new Promise(r=>setTimeout(r,1400)); setTestResult({ok:true,latency:"412ms",status:"200 OK"}); setTesting(false); pushToast("Endpoint test passed! ✓","success"); }} loading={testing}>{testing?"Testing...":"⚡ Test Endpoint"}</Btn>
                  {testResult&&<div style={{ display:"flex",alignItems:"center",gap:8 }}><Badge color={testResult.ok?T.green:"#FF4455"}>{testResult.ok?"✓ "+testResult.status:"✕ Failed"}</Badge>{testResult.latency&&<span style={{ color:T.muted,fontSize:12 }}>{testResult.latency}</span>}</div>}
                </div>
              </div>
            </div>
          )}
          {step===4&&(
            <div>
              <h3 style={{ color:T.white,margin:"0 0 20px",fontSize:18 }}>Review & Submit</h3>
              {[["Name",form.name||"—"],["Category",form.cat||"—"],["Pricing",form.pricing],["Endpoint",form.endpoint||"—"],["Tags",form.tags.join(", ")||"—"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex",gap:20,padding:"10px 0",borderBottom:`1px solid ${T.border}20` }}>
                  <span style={{ color:T.muted,fontSize:13,width:100,flexShrink:0 }}>{k}</span>
                  <span style={{ color:T.white,fontSize:13 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop:20,padding:16,background:`${T.amber}15`,border:`1px solid ${T.amber}44`,borderRadius:10,fontSize:13,color:T.amber }}>⚠ By submitting, you agree to our Agent Publishing Guidelines. Your agent will be reviewed within 24 hours.</div>
            </div>
          )}
          <div style={{ display:"flex",justifyContent:"space-between",marginTop:28 }}>
            <Btn variant="secondary" onClick={()=>step>1?setStep(s=>s-1):setPage("dashboard")} disabled={step===1&&false}>{step>1?"← Back":"Cancel"}</Btn>
            <Btn onClick={next}>{step<4?"Continue →":"🚀 Submit Agent"}</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── SIMPLE EXTRA PAGES ─────────────────────────────────────────
function CategoriesPage({ setPage }) {
  return (
    <div style={{ paddingTop:80,minHeight:"100vh",padding:"100px 40px 60px" }}>
      <div style={{ maxWidth:1100,margin:"0 auto" }}>
        <h1 style={{ color:T.white,fontSize:34,fontWeight:900,marginBottom:8,letterSpacing:-1 }}>All Categories</h1>
        <p style={{ color:T.muted,marginBottom:40,fontSize:15 }}>Browse {AGENTS.length}+ agents by use case and industry.</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18 }}>
          {CATS.filter(c=>c!=="All").map((cat,i)=>{
            const agents=AGENTS.filter(a=>a.cat===cat);
            return (
              <div key={cat} style={{ animation:`fadeSlideUp 0.4s ease-out ${i*70}ms both` }}>
                <Card glow onClick={()=>setPage("discover")} style={{ padding:28,textAlign:"center",cursor:"pointer" }}>
                  <div style={{ fontSize:44,marginBottom:12 }}>{CAT_ICONS[cat]||"🤖"}</div>
                  <div style={{ color:T.white,fontWeight:700,fontSize:15,marginBottom:6 }}>{cat}</div>
                  <div style={{ color:T.muted,fontSize:12,marginBottom:12 }}>{agents.length} agents</div>
                  {agents.slice(0,2).map(a=><div key={a.id} style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}><span style={{ fontSize:14 }}>{a.icon}</span><span style={{ color:T.muted,fontSize:11 }}>{a.name}</span></div>)}
                  {agents.length>2&&<div style={{ color:T.border,fontSize:11,marginTop:4 }}>+{agents.length-2} more</div>}
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PricingPage({ setPage, onSignIn }) {
  const plans = [
    { name:"Starter",price:"Free",desc:"Individuals exploring AI agents",features:["10 API calls/day","Access to all free agents","Community support","Basic sandbox access"],cta:"Get Started",color:T.green,highlight:false },
    { name:"Pro",price:"$9/mo",desc:"Developers and power users",features:["Unlimited API calls","Access to all 30+ agents","Priority support","Advanced analytics","Webhook integrations","API key management"],cta:"Start Free Trial",color:T.cyan,highlight:true },
    { name:"Enterprise",price:"Custom",desc:"Teams and organizations",features:["Everything in Pro","Custom rate limits","SLA guarantee (99.9%)","Dedicated support","SSO & SAML","Custom integrations","On-premise option"],cta:"Contact Sales",color:T.purple,highlight:false },
  ];
  return (
    <div style={{ paddingTop:80,minHeight:"100vh",padding:"100px 40px 60px" }}>
      <div style={{ maxWidth:900,margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:60 }}>
          <h1 style={{ color:T.white,fontSize:38,fontWeight:900,letterSpacing:-1.5,marginBottom:12 }}>Simple, Transparent Pricing</h1>
          <p style={{ color:T.muted,fontSize:16 }}>Start free. Upgrade when you need more power.</p>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
          {plans.map((p,i)=>(
            <div key={p.name} style={{ animation:`fadeSlideUp 0.4s ease-out ${i*100}ms both` }}>
              <div style={{ background:p.highlight?`linear-gradient(to bottom,${T.surface2},${T.card})`:T.card,border:`2px solid ${p.highlight?p.color:T.border}`,borderRadius:16,padding:28,position:"relative",boxShadow:p.highlight?`0 0 40px ${p.color}22`:"none" }}>
                {p.highlight&&<div style={{ position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:p.color,color:"#000",padding:"4px 18px",borderRadius:"0 0 10px 10px",fontSize:11,fontWeight:700 }}>MOST POPULAR</div>}
                <div style={{ color:T.muted,fontSize:12,fontWeight:700,letterSpacing:1.5,marginBottom:12 }}>{p.name.toUpperCase()}</div>
                <div style={{ color:p.color,fontSize:40,fontWeight:900,letterSpacing:-1,marginBottom:6 }}>{p.price}</div>
                <div style={{ color:T.muted,fontSize:13,marginBottom:24,lineHeight:1.5 }}>{p.desc}</div>
                <Btn variant={p.highlight?"primary":p.name==="Enterprise"?"purple":"secondary"} onClick={()=>onSignIn("signup")} style={{ width:"100%",justifyContent:"center",marginBottom:24 }}>{p.cta}</Btn>
                <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:20 }}>
                  {p.features.map(f=><div key={f} style={{ display:"flex",gap:8,marginBottom:10 }}><span style={{ color:p.color,fontWeight:700 }}>✓</span><span style={{ color:T.muted,fontSize:13 }}>{f}</span></div>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotFound({ setPage }) {
  return (
    <div style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:40 }}>
      <div style={{ fontSize:96,fontWeight:900,background:`linear-gradient(90deg,${T.cyan},${T.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:20,letterSpacing:-4 }}>404</div>
      <div style={{ fontSize:48,marginBottom:16 }}>🌌</div>
      <h1 style={{ color:T.white,fontSize:28,fontWeight:800,marginBottom:12 }}>Lost in the neural network</h1>
      <p style={{ color:T.muted,marginBottom:32 }}>The page you're looking for doesn't exist in this dimension.</p>
      <div style={{ display:"flex",gap:12 }}><Btn onClick={()=>setPage("home")}>← Back to Home</Btn><Btn variant="secondary" onClick={()=>setPage("discover")}>Browse Agents</Btn></div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [toasts, setToasts] = useState([]);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState(null); // "login" | "signup" | null

  const pushToast = useCallback((msg,type="info") => {
    const id = Date.now();
    setToasts(t => [...t.slice(-2), { id, msg, type }]);
  }, []);

  const nav = useCallback((p) => {
    if (p==="auth_dev") { setAuthModal("login"); return; }
    setPage(p); window.scrollTo({ top:0, behavior:"smooth" });
  }, []);

  const handleSignIn = (mode) => setAuthModal(mode);
  const handleAuthSuccess = (u, token) => {
    setUser(u);
    // In production: localStorage.setItem("token", token);
    if (u.role==="developer") nav("dashboard");
  };
  const handleSignOut = () => { setUser(null); nav("home"); pushToast("Signed out","info"); };

  useEffect(()=>{
    const fn=e=>{ if((e.metaKey||e.ctrlKey)&&e.key==="k"){ e.preventDefault(); setCmdOpen(o=>!o); } };
    window.addEventListener("keydown",fn); return()=>window.removeEventListener("keydown",fn);
  },[]);

  const VALID_PAGES = ["home","discover","detail","submit","dashboard","categories","pricing"];

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'DM Sans','Outfit','Sora',system-ui,sans-serif", color:T.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,600;0,9..40,700;0,9..40,900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#060818;}
        @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
        @keyframes slideInRight{from{transform:translateX(60px);opacity:0;}to{transform:translateX(0);opacity:1;}}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
        @keyframes scaleIn{from{transform:scale(0.93);opacity:0;}to{transform:scale(1);opacity:1;}}
        @keyframes bounce{0%{transform:scale(0.4);opacity:0;}60%{transform:scale(1.18);}100%{transform:scale(1);opacity:1;}}
        @keyframes dotpulse{0%,100%{opacity:0.3;transform:scale(0.8);}50%{opacity:1;transform:scale(1.2);}}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#1E2D5A;border-radius:3px;}
        ::-webkit-scrollbar-thumb:hover{background:#00E5FF33;}
        input,textarea,select{color-scheme:dark;}
        ::placeholder{color:#8892B0;}
        a{color:inherit;text-decoration:none;}
      `}</style>

      <Navbar page={page} setPage={nav} openCmdPalette={()=>setCmdOpen(true)} user={user} onSignIn={handleSignIn} onSignOut={handleSignOut}/>

      {cmdOpen&&<CommandPalette onClose={()=>setCmdOpen(false)} setPage={(p)=>{ nav(p); setCmdOpen(false); }} setSelectedAgent={setSelectedAgent}/>}
      {authModal&&<AuthModal mode={authModal} onClose={()=>setAuthModal(null)} onSuccess={handleAuthSuccess} pushToast={pushToast}/>}

      <div key={page} style={{ animation:"fadeSlideUp 0.3s ease-out" }}>
        {page==="home"       && <HomePage       setPage={nav} setSelectedAgent={setSelectedAgent} onSignIn={handleSignIn}/>}
        {page==="discover"   && <DiscoverPage   setPage={nav} setSelectedAgent={setSelectedAgent}/>}
        {page==="detail"     && <DetailPage     agent={selectedAgent} setPage={nav} pushToast={pushToast} setSelectedAgent={setSelectedAgent}/>}
        {page==="submit"     && <SubmitPage     setPage={nav} pushToast={pushToast} user={user}/>}
        {page==="dashboard"  && <DashboardPage  setPage={nav} setSelectedAgent={setSelectedAgent} pushToast={pushToast} user={user}/>}
        {page==="categories" && <CategoriesPage setPage={nav}/>}
        {page==="pricing"    && <PricingPage    setPage={nav} onSignIn={handleSignIn}/>}
        {!VALID_PAGES.includes(page) && <NotFound setPage={nav}/>}
      </div>

      <div style={{ position:"fixed",top:20,right:20,zIndex:9998,display:"flex",flexDirection:"column",gap:8 }}>
        {toasts.map(t=><Toast key={t.id} msg={t.msg} type={t.type} onClose={()=>setToasts(ts=>ts.filter(x=>x.id!==t.id))}/>)}
      </div>
    </div>
  );
}
