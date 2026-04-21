import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./client";
import {
  admins,
  siteSettings,
  navItems,
  heroContent,
  aboutContent,
  statCards,
  typingWords,
  philosophyItems,
  aboutFacts,
  serviceCards,
  experiences,
  experienceBullets,
  skills,
  certifications,
  education,
  blogCategories,
} from "./schema";
import { sql } from "drizzle-orm";

async function upsertKV(
  table: typeof siteSettings | typeof heroContent | typeof aboutContent,
  key: string,
  value: string,
) {
  await db
    .insert(table)
    .values({ key, value })
    .onConflictDoNothing({ target: (table as any).key });
}

async function run() {
  console.log("Seeding database…");

  // ── Admin ──
  const email = process.env.SEED_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? "shoaibramani1@gmail.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe#2026!";
  const hash = await bcrypt.hash(password, 12);
  await db
    .insert(admins)
    .values({ email, passwordHash: hash })
    .onConflictDoNothing({ target: admins.email });
  console.log(`  ✓ admin: ${email}`);

  // ── Site settings ──
  const settings: Record<string, string> = {
    site_title: "Shoaib Ramani — Corporate Development & Strategic Finance",
    meta_description:
      "Corporate Development & Strategic Finance Analyst — M&A, FP&A, and deal architecture. Based in Woburn, MA.",
    og_image: "",
    favicon: "",
    ga4_id: "",
    linkedin: "https://www.linkedin.com/in/shoaib-ramani",
    email: "shoaibramani1@gmail.com",
    phone: "+1 (502) 260-6388",
    footer_tagline: "Corporate Development & Strategic Finance",
  };
  for (const [k, v] of Object.entries(settings)) await upsertKV(siteSettings, k, v);

  // ── Nav ──
  const nav = [
    { label: "Home", url: "/", order: 0 },
    { label: "About", url: "/about", order: 1 },
    { label: "Experience", url: "/experience", order: 2 },
    { label: "Skills", url: "/skills", order: 3 },
    { label: "Blog", url: "/blog", order: 4 },
    { label: "Resume", url: "/resume", order: 5 },
    { label: "Contact", url: "/contact", order: 6 },
  ];
  for (const n of nav) {
    await db.insert(navItems).values(n).onConflictDoNothing();
  }

  // ── Hero ──
  const hero: Record<string, string> = {
    eyebrow: "Corporate Development & Strategic Finance",
    h1: "Shoaib Ramani",
    subheadline: "Building M&A Infrastructure. Driving Institutional Exits.",
    body: "Working directly with the CEO at FinAccurate LLC on a disciplined M&A roll-up strategy building toward $10M+ EBITDA. I don't just run the numbers — I shape the decisions behind them.",
    primary_cta_label: "View My Work",
    primary_cta_url: "/experience",
    secondary_cta_label: "Download Resume",
    secondary_cta_url: "/resume",
    headshot_url: "",
  };
  for (const [k, v] of Object.entries(hero)) await upsertKV(heroContent, k, v);

  const words = ["M&A Analyst", "FP&A Strategist", "Corporate Finance", "Deal Architect"];
  for (let i = 0; i < words.length; i++) {
    await db.insert(typingWords).values({ word: words[i], order: i }).onConflictDoNothing();
  }

  const stats = [
    { number: "5+", label: "Years in Finance", order: 0 },
    { number: "3", label: "Countries Worked Across", order: 1 },
    { number: "5+", label: "Startups Advised", order: 2 },
    { number: "$10M+", label: "EBITDA Target Managed", order: 3 },
  ];
  for (const s of stats) await db.insert(statCards).values(s).onConflictDoNothing();

  const services = [
    {
      icon: "handshake",
      title: "M&A & Deal Architecture",
      body: "Acquisition underwriting, integration performance, roll-up strategy. Built to scale, priced to move.",
      order: 0,
    },
    {
      icon: "line-chart",
      title: "FP&A & Financial Modeling",
      body: "CEO dashboards, synergy tracking, exit planning, EBITDA analysis. Numbers that move decisions.",
      order: 1,
    },
    {
      icon: "trending-up",
      title: "Strategic Finance & VC",
      body: "Investor materials, deal flow management, investment memos. Clarity that moves capital.",
      order: 2,
    },
  ];
  for (const s of services) await db.insert(serviceCards).values(s).onConflictDoNothing();

  // ── About ──
  const about: Record<string, string> = {
    pull_quote: "Where does real value get built?",
    bio_html: `<p>As Corporate Development & Strategic Finance Analyst at FinAccurate LLC, I work directly with the CEO on a disciplined M&A roll-up strategy, building toward $10M+ EBITDA and institutional exit. I own the financial architecture behind every deal: acquisition underwriting, integration performance, FP&A, and exit planning.</p><p>But to understand where I am, you have to understand where I started. I began in India, earning a Bachelor of Commerce from MIT-WPU with an early instinct for commerce, trade, and numbers. At SG Analytics, I supported Nasdaq clients' analytical decisions across EMEA, APAC, and the Americas — learning by doing, building simple to complex financial models across sectors, and understanding that the best analysis doesn't just inform, it drives conviction.</p><p>I then crossed the Atlantic for my M.S. in Finance at Hult International Business School, sharpening my lens on corporate strategy, capital markets, and value creation at scale. That led me to SevenTrain Ventures, working alongside founders at CMRO.ai, Stateset, Response.cx, SportsX, and RentersX. I saw how capital moves, how founders think, and how the gap between a great idea and a funded one is almost always a clarity problem.</p><p>Now that lens has a purpose. My operating philosophy: build systems that scale, tell stories that move capital, and execute like the outcome depends on it — because it does. Always open. Always learning. Always building.</p>`,
    personal_touch:
      "Beyond the spreadsheets: I've played cricket for 8+ years, lift at the gym most mornings, and spend weekends on the golf course or chasing down a good film. I build the same way I play — long-term, patient, competitive.",
    headshot_url: "",
  };
  for (const [k, v] of Object.entries(about)) await upsertKV(aboutContent, k, v);

  const philosophy = [
    {
      headline: "Build systems that scale.",
      subtitle: "Infrastructure first. The model has to hold at 1× and at 100×.",
      order: 0,
    },
    {
      headline: "Tell stories that move capital.",
      subtitle: "Data drives conviction. Narrative moves it across the table.",
      order: 1,
    },
    {
      headline: "Execute like the outcome depends on it.",
      subtitle: "Because it does. Always open. Always learning. Always building.",
      order: 2,
    },
  ];
  for (const p of philosophy) await db.insert(philosophyItems).values(p).onConflictDoNothing();

  const facts = [
    { key: "Based In", value: "Woburn, Massachusetts, USA", order: 0 },
    {
      key: "Currently",
      value: "Corporate Development & Strategic Finance Analyst @ FinAccurate LLC",
      order: 1,
    },
    {
      key: "Education",
      value: "MS Finance, Hult International Business School · BCom, MIT-WPU",
      order: 2,
    },
    { key: "Open To", value: "M&A, FP&A, and Strategic Finance roles", order: 3 },
    { key: "Languages", value: "English, Hindi, Punjabi", order: 4 },
  ];
  for (const f of facts) await db.insert(aboutFacts).values(f).onConflictDoNothing();

  // ── Experience ──
  const exps = [
    {
      company: "FinAccurate LLC",
      role: "Corporate Development & Strategic Finance Analyst",
      startDate: "Apr 2026",
      endDate: null as string | null,
      isPresent: true,
      location: "Woburn, MA",
      impact: "Owns the financial architecture behind an M&A roll-up targeting $10M+ EBITDA.",
      order: 0,
      bullets: [
        "Works directly with the CEO on a disciplined M&A roll-up strategy building toward $10M+ EBITDA and institutional exit.",
        "Owns acquisition underwriting, integration performance, FP&A, and exit planning.",
        "Shapes the strategic decisions behind every deal — not just the numbers.",
      ],
    },
    {
      company: "SevenTrain Ventures",
      role: "Associate",
      startDate: "May 2025",
      endDate: "Aug 2025",
      isPresent: false,
      location: "New York, NY",
      impact: "Investor materials, deal flow, and portfolio strategy across 5+ high-growth startups.",
      order: 1,
      bullets: [
        "Crafted data-driven investor materials and managed end-to-end deal flows across 5+ high-growth startups.",
        "Conducted deep-dive financial modeling, valuation analysis, and strategic planning for AI, fintech, and sports infrastructure ventures.",
        "Managed CRM-driven deal flow and produced investment memos for internal portfolio evaluation.",
        "Led competitive intelligence and market research to guide capital allocation.",
        "Oversaw NTRL — scaling a consumer brand through data, digital ops, and GTM.",
      ],
    },
    {
      company: "TedXHultBoston",
      role: "Public Relations Executive",
      startDate: "Feb 2025",
      endDate: "Aug 2025",
      isPresent: false,
      location: "Greater Boston",
      impact: "Brand, partnerships, and stakeholder communications for the Hult TEDx chapter.",
      order: 2,
      bullets: [
        "Led public relations and stakeholder outreach across the Hult TEDx ecosystem.",
      ],
    },
    {
      company: "SG Analytics",
      role: "Analyst → Associate Analyst",
      startDate: "Jul 2022",
      endDate: "Jul 2024",
      isPresent: false,
      location: "Pune, India",
      impact: "Nasdaq IR Insight analytics and custom financial models across EMEA, APAC, AMERS.",
      order: 3,
      bullets: [
        "Database services in investment research insights with the Nasdaq IR Insight platform.",
        "Integrated MS Excel analytics to maximize data insights and optimize decision-making.",
        "Built and modified financial models; created buy-side and sell-side custom firm and contact profiles.",
        "Owned quality checks and associate deliverables across EMEA, APAC, and AMERS.",
      ],
    },
  ];

  for (const e of exps) {
    const { bullets, ...rest } = e;
    const inserted = await db.insert(experiences).values(rest).returning();
    const expId = inserted[0]?.id;
    if (!expId) continue;
    for (let i = 0; i < bullets.length; i++) {
      await db.insert(experienceBullets).values({ experienceId: expId, text: bullets[i], order: i });
    }
  }

  // ── Skills ──
  const skillRows = [
    ...[
      "M&A",
      "FP&A",
      "Financial Modeling",
      "Acquisition Underwriting",
      "EBITDA Analysis",
      "Synergy Tracking",
      "Valuation",
      "Exit Planning",
      "Investment Memos",
      "Portfolio Management",
    ].map((name, i) => ({ name, category: "Financial", order: i })),
    ...["Advanced Excel", "MS Office Suite", "Nasdaq IR Insight", "CRM Tools"].map((name, i) => ({
      name,
      category: "Technical",
      order: i,
    })),
    ...[
      "Strategic Thinking",
      "Executive Communication",
      "Deal Flow Management",
      "Cross-functional Collaboration",
    ].map((name, i) => ({ name, category: "Soft Skills", order: i })),
  ];
  for (const s of skillRows) await db.insert(skills).values(s).onConflictDoNothing();

  // ── Certifications ──
  const certs = [
    { name: "Microsoft Office Specialist (MOS)", issuingBody: "Microsoft", year: "", description: "", order: 0 },
    { name: "Certified Industrial Accountant", issuingBody: "ICA", year: "", description: "", order: 1 },
    {
      name: "Mergers & Acquisitions Financial Modeling",
      issuingBody: "Professional Training",
      year: "",
      description: "",
      order: 2,
    },
    { name: "Professional Ethics", issuingBody: "", year: "", description: "", order: 3 },
    {
      name: "FP&A Excel Modeling Specialization",
      issuingBody: "",
      year: "",
      description: "",
      order: 4,
    },
  ];
  for (const c of certs) await db.insert(certifications).values(c).onConflictDoNothing();

  // ── Education ──
  const edu = [
    {
      institution: "Hult International Business School",
      degree: "Master of Science — MS",
      field: "Finance",
      startDate: "Sep 2024",
      endDate: "Aug 2025",
      location: "Boston, MA",
      description: "",
      order: 0,
    },
    {
      institution: "MIT World Peace University",
      degree: "Bachelor of Commerce (BCom)",
      field: "Banking, Corporate, Finance & Securities Law",
      startDate: "Sep 2017",
      endDate: "May 2020",
      location: "Pune, India",
      description: "",
      order: 1,
    },
  ];
  for (const e of edu) await db.insert(education).values(e).onConflictDoNothing();

  // ── Blog categories ──
  const cats = [
    { name: "M&A", slug: "m-and-a" },
    { name: "FP&A", slug: "fp-and-a" },
    { name: "Markets", slug: "markets" },
    { name: "Career", slug: "career" },
  ];
  for (const c of cats) await db.insert(blogCategories).values(c).onConflictDoNothing();

  console.log("Seed complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
