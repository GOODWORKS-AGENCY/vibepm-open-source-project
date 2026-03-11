import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowUp, Brain, Sparkles, Database, Cpu,
  Zap, ChevronDown, Check, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/LandingNav";
import { EmblemNeural, EmblemLattice, EmblemPipeline, EmblemLoop, EmblemSpark } from "@/components/landing/Emblems";

const suggestions = [
  "SaaS Dashboard",
  "Task Manager",
  "E-commerce Platform",
  "CRM System",
  "DevOps Pipeline",
];

const features = [
  {
    num: "01",
    title: "Brain dump your vision",
    desc: "Describe your project in plain language. Paste notes, upload docs, sketch out modules — raw and unstructured is perfectly fine. The AI extracts structure from chaos.",
    visual: "braindump",
  },
  {
    num: "02",
    title: "AI builds your knowledge base",
    desc: "The system analyzes your input and generates a complete knowledge architecture — skills, tools, workflows, entity schemas, and business rules. Everything an agent needs to build autonomously.",
    visual: "knowledge",
  },
  {
    num: "03",
    title: "Tasks seed automatically",
    desc: "Tasks are created with dependencies, XP rewards, priority ordering, and surgical context references. Each task knows exactly which knowledge files to load.",
    visual: "tasks",
  },
  {
    num: "04",
    title: "Agents ship your product",
    desc: "AI agents claim tasks, load context, build features, verify output, and mark complete. The loop closes itself. You watch your project come to life.",
    visual: "agents",
  },
];

const showcaseApps = [
  { name: "Project Tracker", color: "from-blue-400/20 to-cyan-400/20" },
  { name: "Knowledge Base", color: "from-purple-400/20 to-pink-400/20" },
  { name: "Agent Dashboard", color: "from-amber-400/20 to-orange-400/20" },
  { name: "Export Engine", color: "from-emerald-400/20 to-teal-400/20" },
  { name: "Task Pipeline", color: "from-rose-400/20 to-red-400/20" },
];

const faqs = [
  {
    q: "What is VibePM?",
    a: "VibePM is an AI-powered project scaffolding platform that transforms your ideas into complete development frameworks — tasks, knowledge files, agent configurations, and database migrations — all from a simple brain dump.",
  },
  {
    q: "Do I need coding experience?",
    a: "No. Describe your project in plain language and VibePM generates everything: task queues, knowledge files, CLAUDE.md configs, and deployment-ready exports. Technical users can customize every output.",
  },
  {
    q: "How does the AI pipeline work?",
    a: "You describe your project → AI extracts entities, modules, and business rules → generates WAT knowledge files (Skills, Tools, Workflows) → seeds tasks with dependencies and context references → agents execute autonomously.",
  },
  {
    q: "What agents are supported?",
    a: "VibePM generates framework files compatible with Claude Code, Cursor, Windsurf, Codex, Aider, Continue.dev, and any agent that reads markdown and queries a database.",
  },
  {
    q: "Can I export everything?",
    a: "Yes. Export your entire project as a ZIP file containing CLAUDE.md, rules files, knowledge base, task seeds, pipeline configs, and database migrations. Drop it into any repo and start building.",
  },
  {
    q: "Is my data secure?",
    a: "Your projects are stored securely with authentication and row-level security. All AI processing happens through encrypted API calls. You own everything you create.",
  },
];

function FeatureVisual({ type }: { type: string }) {
  const emblems: Record<string, React.ReactNode> = {
    braindump: <EmblemNeural className="w-full h-full text-purple-900" />,
    knowledge: <EmblemLattice className="w-full h-full text-teal-900" />,
    tasks: <EmblemPipeline className="w-full h-full text-amber-900" />,
    agents: <EmblemLoop className="w-full h-full text-rose-900" />,
  };

  const cards: Record<string, React.ReactNode> = {
    braindump: (
      <div className="rounded-2xl bg-white shadow-lg shadow-black/5 border border-black/[0.06] p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-black/40">
          <Brain className="h-3.5 w-3.5" /> Brain Dump
        </div>
        <div className="space-y-2">
          <div className="h-2.5 w-3/4 rounded-full bg-black/[0.06]" />
          <div className="h-2.5 w-full rounded-full bg-black/[0.06]" />
          <div className="h-2.5 w-2/3 rounded-full bg-black/[0.06]" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="rounded-full bg-purple-100 px-3 py-1 text-[10px] font-medium text-purple-600">modules</div>
          <div className="rounded-full bg-cyan-100 px-3 py-1 text-[10px] font-medium text-cyan-600">entities</div>
          <div className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-medium text-amber-600">rules</div>
        </div>
      </div>
    ),
    knowledge: (
      <div className="rounded-2xl bg-white shadow-lg shadow-black/5 border border-black/[0.06] p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-black/40">
          <Sparkles className="h-3.5 w-3.5" /> Knowledge Base
        </div>
        {["auth.skill.md", "user-crud.tool.md", "onboarding.workflow.md"].map((f) => (
          <div key={f} className="flex items-center gap-3 rounded-lg bg-black/[0.02] px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs text-black/60">{f}</span>
          </div>
        ))}
      </div>
    ),
    tasks: (
      <div className="rounded-2xl bg-white shadow-lg shadow-black/5 border border-black/[0.06] p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-black/40">
          <Database className="h-3.5 w-3.5" /> Task Queue
        </div>
        {[
          { code: "P01-01", title: "Create auth module", xp: 25 },
          { code: "P01-02", title: "Build user CRUD", xp: 20 },
          { code: "P01-03", title: "Setup dashboard", xp: 30 },
        ].map((t) => (
          <div key={t.code} className="flex items-center justify-between rounded-lg bg-black/[0.02] px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-black/30">{t.code}</span>
              <span className="text-xs text-black/70">{t.title}</span>
            </div>
            <span className="text-[10px] font-medium text-purple-500">{t.xp} XP</span>
          </div>
        ))}
      </div>
    ),
    agents: (
      <div className="rounded-2xl bg-white shadow-lg shadow-black/5 border border-black/[0.06] p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-black/40">
          <Cpu className="h-3.5 w-3.5" /> Agent Loop
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <Zap className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <div className="text-xs font-medium text-black/80">claude-code</div>
            <div className="text-[10px] text-black/40">Building P01-03...</div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-600">Active</span>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
            initial={{ width: "0%" }}
            whileInView={{ width: "68%" }}
            transition={{ duration: 1.5, ease: "easeOut" as const }}
            viewport={{ once: true }}
          />
        </div>
      </div>
    ),
  };

  return (
    <div className="relative">
      {/* Emblem behind the card */}
      <div className="absolute -inset-8 flex items-center justify-center opacity-60 pointer-events-none">
        {emblems[type]}
      </div>
      {/* Card on top */}
      <div className="relative z-10">
        {cards[type]}
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-base font-medium text-black/80 sm:text-lg">{q}</span>
        <ChevronDown
          className={`h-5 w-5 text-black/30 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-sm leading-relaxed text-black/50 sm:text-base">{a}</p>
      </motion.div>
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function Landing() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim()) {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{
      background: "linear-gradient(180deg, hsl(200 60% 92%) 0%, hsl(210 40% 96%) 30%, hsl(30 50% 95%) 70%, hsl(25 60% 92%) 100%)",
    }}>
      <LandingNav />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-5xl font-extrabold tracking-tight text-black/90 sm:text-6xl lg:text-[4.5rem] lg:leading-[1.1]"
          >
            Turn your ideas into
            <br />
            AI-ready projects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mx-auto mt-6 max-w-xl text-lg text-black/45 sm:text-xl"
          >
            VibePM generates complete development frameworks in minutes.
            Tasks, knowledge files, agent configs — all from your words.
          </motion.p>

          {/* ─── TEXTAREA CTA ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="relative rounded-2xl bg-white shadow-xl shadow-black/[0.08] border border-black/[0.06]">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your project idea..."
                className="w-full resize-none rounded-2xl bg-transparent px-6 py-5 text-base text-black/80 placeholder:text-black/30 focus:outline-none min-h-[120px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <button
                onClick={handleSubmit}
                className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-orange-500/40 hover:scale-105 active:scale-95"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </div>
          </motion.div>

          {/* ─── SUGGESTION CHIPS ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6"
          >
            <p className="text-[11px] font-medium uppercase tracking-widest text-black/25 mb-3">
              Not sure where to start? Try one of these:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(`Build me a ${s.toLowerCase()}`)}
                  className="rounded-full border border-black/[0.08] bg-white/60 px-4 py-2 text-sm text-black/50 backdrop-blur-sm transition-all hover:border-black/15 hover:text-black/70 hover:bg-white/80 hover:shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CHALLENGES (ForwardPath-style emblem section) ─── */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center">
            <span className="text-[11px] font-medium uppercase tracking-widest text-black/30">Challenges</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-black/85 sm:text-5xl">
              What you think you need,<br />isn't what you need
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-black/40">
              Most teams try to solve AI development with the wrong tools. Here's what doesn't work.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-16 grid gap-6 sm:grid-cols-3"
          >
            {[
              { emblem: <EmblemSpark className="w-24 h-24 text-purple-800" />, text: "AI is not solved by adding another SaaS tool" },
              { emblem: <EmblemNeural className="w-24 h-24 text-teal-800" />, text: "AI is not solved with traditional consulting" },
              { emblem: <EmblemPipeline className="w-24 h-24 text-amber-800" />, text: "AI is not solved as a side project off someone's desk" },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center rounded-2xl bg-white/50 backdrop-blur-sm border border-black/[0.04] p-8"
              >
                <div className="mb-5">{item.emblem}</div>
                <p className="text-sm font-medium text-black/55 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CONSIDER YOURSELF LIMITLESS ─── */}
      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-black/85 sm:text-5xl">
              Consider yourself limitless
            </h2>
          </motion.div>

          <div className="mt-20 space-y-32">
            {features.map((feature, i) => (
              <motion.div
                key={feature.num}
                {...fadeUp}
                transition={{ duration: 0.6 }}
                className={`flex flex-col items-center gap-12 lg:flex-row ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Visual */}
                <div className="flex-1 w-full max-w-md">
                  <FeatureVisual type={feature.visual} />
                </div>

                {/* Text */}
                <div className="flex-1 max-w-lg">
                  <div className="flex items-center gap-3 text-sm text-black/25">
                    <span className="font-mono font-bold">{feature.num}</span>
                    <span>/</span>
                    <span className="font-mono">04</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold text-black/85 sm:text-3xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-black/45">
                    {feature.desc}
                  </p>
                  <Button
                    asChild
                    variant="link"
                    className="mt-4 h-auto p-0 text-black/60 hover:text-black/90 gap-1 font-medium"
                  >
                    <Link to="/auth">
                      Start building <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHOWCASE STRIP ─── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="inline-flex gap-8 text-sm font-medium text-black/30">
              <span className="text-black/70 border-b-2 border-black/70 pb-1">Application</span>
              <span className="pb-1">Prompt</span>
            </div>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
          >
            {showcaseApps.map((app) => (
              <div
                key={app.name}
                className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${app.color} border border-black/[0.04] flex items-end p-4`}
              >
                <span className="text-xs font-medium text-black/40">{app.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-black/85 sm:text-5xl">
              Pricing plans for every need
            </h2>
            <p className="mt-4 text-base text-black/40 sm:text-lg">
              Scale as you go with plans designed to match your growth.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-16 grid gap-6 sm:grid-cols-2"
          >
            {/* Free */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-sm border border-black/[0.06] p-8 shadow-lg shadow-black/[0.03]">
              <h3 className="font-display text-xl font-bold text-black/80">Start for free</h3>
              <p className="mt-2 text-sm text-black/40">Get access to:</p>
              <ul className="mt-6 space-y-3">
                {["All core features", "AI analysis pipeline", "Knowledge generation", "Task seeding", "ZIP export"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-black/60">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-8 w-full rounded-full bg-black text-white hover:bg-black/90 font-medium"
              >
                <Link to="/auth">Start building</Link>
              </Button>
            </div>

            {/* Pro */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-sm border border-black/[0.06] p-8 shadow-lg shadow-black/[0.03]">
              <h3 className="font-display text-xl font-bold text-black/80">Pro plans from</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-5xl font-extrabold text-black/85">$20</span>
                <span className="text-sm text-black/35">/mo</span>
              </div>
              <p className="mt-4 text-sm text-black/40">
                More credits, multi-agent support, priority generation, and team collaboration.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-8 w-full rounded-full border-black/10 font-medium hover:bg-black/[0.03]"
              >
                <Link to="/auth">See all plans</Link>
              </Button>
              <div className="mt-6 pt-6 border-t border-black/[0.06]">
                <p className="text-xs text-black/30">
                  Looking for enterprise solutions?{" "}
                  <Link to="/auth" className="text-black/50 underline underline-offset-2 hover:text-black/70">
                    Contact sales
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-black/85 sm:text-5xl">
              Frequently asked questions
            </h2>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-4xl font-bold tracking-tight text-black/85 sm:text-6xl">
              So, what are we building?
            </h2>
            <div className="mt-12">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full bg-black px-12 font-display text-base font-semibold text-white hover:bg-black/90 shadow-xl shadow-black/10"
              >
                <Link to="/auth">Get started</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-black/[0.06] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="font-display text-sm font-bold text-black/60">VibePM</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/framework" className="text-xs text-black/30 hover:text-black/60 transition-colors">
              Framework
            </Link>
            <Link to="/system" className="text-xs text-black/30 hover:text-black/60 transition-colors">
              System
            </Link>
            <span className="text-xs text-black/20">
              MIT License · Open Source
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
