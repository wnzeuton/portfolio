import { useState, useEffect, useRef } from "react";

const GOLD_DIM = "#a8824a";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500&family=Zen+Kaku+Gothic+New:wght@300;400;500&display=swap');

  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  @keyframes wipPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.15; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInRight {
    from { transform: translateX(105%); }
    to   { transform: translateX(0); }
  }
  @keyframes slideOutLeft {
    from { transform: translateX(0); }
    to   { transform: translateX(-105%); }
  }
  @keyframes slideInLeft {
    from { transform: translateX(-105%); }
    to   { transform: translateX(0); }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); }
    to   { transform: translateX(105%); }
  }

  .pf-root {
    font-family: 'Zen Kaku Gothic New', sans-serif;
    background: #f5f0e8;
    color: #1a1612;
    min-height: 100vh;
  }

  .pf-inner {
    max-width: 960px;
    margin: 0 auto;
    padding: 4rem 1.25rem 7rem;
  }

  .gold-shimmer {
    background: linear-gradient(90deg, #a87828 0%, #c9a050 30%, #dbb84a 50%, #c9a050 70%, #a87828 100%);
    background-size: 600px 100%;
    animation: shimmer 6s ease-in-out infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 1px 1px rgba(80, 45, 0, 0.18));
  }

  .gold-bar {
    height: 1.5px;
    background: linear-gradient(90deg, transparent 0%, #a87828 20%, #dbb84a 50%, #a87828 80%, transparent 100%);
    animation: fadeUp 0.5s ease-out both;
    margin-bottom: 4rem;
    opacity: 0.85;
  }

  .pf-eyebrow { font-size: 12px; letter-spacing: 0.12em; color: #7a6040; font-weight: 400; margin-bottom: 0.5rem; animation: fadeUp 0.5s 0.1s ease-out both; }

  .pf-name {
    font-family: 'Shippori Mincho', serif;
    font-size: 76px; font-weight: 400; letter-spacing: -0.03em; line-height: 1.0; color: #1a1612; margin: 0;
    text-shadow: 0 2px 12px rgba(160, 110, 20, 0.18);
    animation: fadeUp 0.6s 0.2s ease-out both;
  }

  .pf-phonetic { font-family: 'Shippori Mincho', serif; font-size: 19px; font-weight: 400; color: #7a6040; letter-spacing: 0.06em; margin-top: 0.75rem; margin-bottom: 3.75rem; animation: fadeUp 0.5s 0.35s ease-out both; }

  .pf-gh-activity { border-left: 3px solid #c9a96e; padding-left: 11px; margin-bottom: 1.75rem; animation: fadeUp 0.5s 0.55s ease-out both; display: flex; flex-direction: column; gap: 10px; }
  .pf-commit { display: flex; align-items: center; gap: 9px; overflow: hidden; }
  .pf-commit-repo { font-size: 12px; font-weight: 400; color: #a8824a; text-decoration: none; white-space: nowrap; flex-shrink: 0; }
  .pf-commit-repo:hover { opacity: 0.75; }
  .pf-commit-sep { font-size: 11px; color: #c4b49a; flex-shrink: 0; }
  .pf-commit-msg { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 11.5px; color: #3d3228; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .pf-commit-sha { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 11px; color: #6a5540; border: 0.5px solid #c4b49a; padding: 1px 6px; border-radius: 3px; text-decoration: none; white-space: nowrap; flex-shrink: 0; transition: background 0.2s; }
  .pf-commit-sha:hover { background: #ede6d8; }
  .pf-commit-age { font-size: 11px; color: #8a7560; white-space: nowrap; flex-shrink: 0; }

  .pf-heatmap { display: flex; flex-direction: column; gap: 4px; }
  .pf-heatmap-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
  .pf-heatmap-lbl { font-size: 10px; font-weight: 300; color: #7a6040; letter-spacing: 0.1em; text-transform: uppercase; }
  .pf-heatmap-total { font-size: 11px; font-weight: 400; color: #a8824a; }
  .pf-heatmap-cells { display: flex; gap: 4px; }
  .pf-heatmap-cell { width: 18px; height: 18px; border-radius: 3px; flex-shrink: 0; position: relative; }
  .pf-heatmap-cell::after {
    content: attr(data-tip); position: absolute; bottom: calc(100% + 6px); left: 50%;
    transform: translateX(-50%); background: #1a1612; color: #dbb84a;
    font-family: 'SFMono-Regular', Consolas, monospace; font-size: 10px;
    white-space: nowrap; padding: 3px 7px; border-radius: 3px;
    pointer-events: none; opacity: 0; transition: opacity 0.15s; z-index: 10;
  }
  .pf-heatmap-cell:hover::after { opacity: 1; }
  .pf-heatmap-days { display: flex; gap: 4px; }
  .pf-heatmap-day { width: 18px; font-size: 9px; color: #a08c6e; text-align: center; font-weight: 300; letter-spacing: 0; }

  .pf-nav {
    display: flex; gap: 3.5rem; margin-bottom: 3rem;
    border-bottom: 0.5px solid #c4b49a; padding-bottom: 1.5rem; align-items: center;
    animation: fadeUp 0.5s 0.45s ease-out both;
  }

  .pf-nav-item {
    font-size: 13px; font-weight: 400; letter-spacing: 0.1em; color: #8a7560;
    cursor: pointer; background: none; border: none; padding: 0; transition: color 0.2s;
  }
  .pf-nav-item:hover { color: #1a1612; }
  .pf-nav-item.active { color: #1a1612; font-weight: 500; }

  .pf-nav-right {
    margin-left: auto; font-size: 13px; color: #7a6040; font-weight: 400;
    letter-spacing: 0.06em; text-decoration: none; transition: opacity 0.2s;
  }
  .pf-nav-right:hover { opacity: 0.7; }

  .pf-section-row { display: flex; align-items: center; gap: 14px; margin-bottom: 2.25rem; }
  .pf-section-en { font-size: 13px; letter-spacing: 0.2em; color: #7a6040; font-weight: 700; text-transform: uppercase; white-space: nowrap; }

  .pf-section-rule {
    flex: 1; height: 0.5px;
    background: linear-gradient(90deg, #a87828 0%, #c9a050 25%, #dbb84a 50%, #c9a050 75%, #a87828 100%);
    background-size: 600px 100%;
    animation: shimmer 9s ease-in-out infinite;
    opacity: 0.9;
  }

  .pf-search-wrap { margin-bottom: 3.5rem; }
  .pf-search-label { font-size: 12px; letter-spacing: 0.12em; color: #5a4530; font-weight: 400; text-transform: uppercase; display: block; margin-bottom: 0.6rem; }
  .pf-search {
    width: 100%; background: transparent; border: none; border-bottom: 0.5px solid #c4b49a;
    padding: 0.5rem 0; font-family: 'Zen Kaku Gothic New', sans-serif; font-size: 13px;
    font-weight: 300; color: #1a1612; outline: none; transition: border-color 0.2s; letter-spacing: 0.02em;
  }
  .pf-search::placeholder { color: #9a7850; }
  .pf-search:focus { border-bottom-color: #c9a96e; }

  .pf-projects-grid {
    display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 3rem;
    border-top: 0.5px solid #c4b49a; border-left: 0.5px solid #c4b49a;
  }

  .pf-project {
    padding: 2.25rem 2rem; border-right: 0.5px solid #c4b49a; border-bottom: 0.5px solid #c4b49a;
    cursor: pointer; transition: background 0.35s; background: #f5f0e8;
  }
  .pf-project:hover { background: #ede6d8; }
  .pf-project:hover .pf-ptitle { color: #a8824a; }

  .pf-pmeta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem; }
  .pf-porg { font-size: 11px; letter-spacing: 0.1em; color: #8a7560; font-weight: 300; text-transform: uppercase; }
  .pf-pdate { font-size: 12px; color: #6a5540; font-weight: 400; }

  .pf-ptitle {
    font-family: 'Shippori Mincho', serif; font-size: 22px; font-weight: 500;
    line-height: 1.25; margin-bottom: 0.9rem; color: #1a1612; transition: color 0.3s;
  }

  .pf-pdesc { font-size: 13px; font-weight: 300; line-height: 1.9; color: #3d3228; margin-bottom: 1.25rem; }

  .pf-pfoot { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 6px; }
  .pf-stack { display: flex; flex-wrap: wrap; gap: 4px; }
  .pf-pill {
    font-size: 11px; font-weight: 300; letter-spacing: 0.05em; color: #8a7560;
    border: 0.5px solid #c4b49a; padding: 2px 7px; border-radius: 2px; background: transparent;
  }

  .pf-wip { display: flex; align-items: center; gap: 5px; }
  .pf-wip-dot { width: 5px; height: 5px; border-radius: 50%; background: #c9a96e; animation: wipPulse 2s infinite; flex-shrink: 0; }
  .pf-wip-txt { font-size: 12px; color: #8a6820; letter-spacing: 0.08em; font-weight: 400; text-transform: uppercase; }

  .pf-gh { font-size: 11px; color: #8a7560; font-weight: 300; text-decoration: none; letter-spacing: 0.04em; transition: color 0.2s; }
  .pf-gh:hover { color: #a8824a; }

  .pf-project-expanded {
    border: 0.5px solid #c4b49a; border-left: 2px solid #c9a96e;
    padding: 2.75rem 2.5rem 2.25rem; background: #ede6d8;
    margin-bottom: 3rem; overflow: hidden; will-change: transform;
  }
  .pf-pdetail {
    font-size: 13px; font-weight: 300; line-height: 1.9; color: #3d3228;
    max-width: 600px; margin-top: 1.25rem; padding-top: 1.25rem;
    border-top: 0.5px solid #c4b49a;
    animation: fadeUp 0.3s 0.35s ease-out both;
  }
  .pf-back {
    font-size: 12px; color: #8a7560; font-weight: 300; letter-spacing: 0.08em;
    cursor: pointer; background: none; border: none; padding: 0; transition: color 0.2s;
  }
  .pf-back:hover { color: #a8824a; }

  .pf-exp-row { display: grid; grid-template-columns: 1fr auto; gap: 0 1rem; padding: 1.75rem 0; border-bottom: 0.5px solid #d4c4a8; }
  .pf-exp-row:first-child { border-top: 0.5px solid #d4c4a8; }
  .pf-eorg { font-family: 'Shippori Mincho', serif; font-size: 19px; font-weight: 500; color: #1a1612; grid-column: 1; }
  .pf-edate { font-size: 12px; color: #6a5540; font-weight: 400; white-space: nowrap; grid-column: 2; grid-row: 1; padding-top: 3px; text-align: right; }
  .pf-erole { font-size: 12px; letter-spacing: 0.08em; font-weight: 400; grid-column: 1; margin-top: 3px; text-transform: uppercase; }
  .pf-edesc { font-size: 12px; color: #3d3228; font-weight: 300; line-height: 1.7; grid-column: 1; margin-top: 5px; }

  .pf-also { margin-top: 2.5rem; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .pf-also-lbl { font-size: 11px; letter-spacing: 0.14em; color: #a08c6e; font-weight: 300; text-transform: uppercase; white-space: nowrap; }

  .pf-footer {
    margin-top: 6rem; display: flex; justify-content: space-between; align-items: center;
    padding-top: 1.5rem; position: relative;
  }
  .pf-footer::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, #c9a96e 25%, #dbb84a 50%, #c9a96e 75%, transparent 100%);
    opacity: 0.6;
  }
  .pf-footer-txt { font-size: 10px; color: #a08c6e; font-weight: 300; letter-spacing: 0.08em; }

  .pf-about-bio {
    font-family: 'Shippori Mincho', serif; font-size: 17px; font-weight: 400;
    line-height: 1.9; color: #1a1612; margin-bottom: 2.25rem; max-width: 580px;
  }
  .pf-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 2.5rem; margin-bottom: 2.25rem; }
  .pf-about-sub { font-size: 13px; letter-spacing: 0.14em; font-weight: 400; text-transform: uppercase; margin-bottom: 0.75rem; }
  .pf-about-line { font-size: 13.5px; font-weight: 300; color: #3d3228; line-height: 1.75; display: block; margin-bottom: 0.3rem; }
  .pf-about-link { font-size: 13.5px; font-weight: 300; color: #3d3228; line-height: 1.75; display: block; margin-bottom: 0.3rem; text-decoration: none; transition: color 0.2s; }
  .pf-about-link:hover { color: #a8824a; }
  .pf-metric-val { font-family: 'Shippori Mincho', serif; font-size: 26px; font-weight: 500; color: #1a1612; display: block; letter-spacing: -0.02em; }
  .pf-metric-lbl { font-size: 11px; font-weight: 300; color: #8a7560; letter-spacing: 0.06em; display: block; margin-top: 3px; }

  .pf-note { padding: 2.25rem 0; border-bottom: 0.5px solid #b8a070; }
  .pf-note:first-child { border-top: 0.5px solid #b8a070; }
  .pf-note-date { font-size: 10px; color: #8a7560; font-weight: 300; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
  .pf-note-short { font-size: 13px; font-weight: 300; color: #3d3228; line-height: 1.8; }
  .pf-note-title { font-family: 'Shippori Mincho', serif; font-size: 17px; font-weight: 500; color: #1a1612; margin-bottom: 0.5rem; }
  .pf-note-preview { font-size: 13px; font-weight: 300; color: #5a4e3e; line-height: 1.85; max-width: 520px; }

  .pf-contact-link {
    font-family: 'Shippori Mincho', serif; font-size: 28px; font-weight: 400; color: #1a1612;
    text-decoration: none; display: block; margin-bottom: 1.5rem; transition: color 0.3s;
  }
  .pf-contact-link:hover { color: #a8824a; }
  .pf-status { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #8a6820; font-weight: 400; letter-spacing: 0.06em; margin-top: 0.5rem; }

  .faded { opacity: 0.2; transition: opacity 0.2s; }
`;

const PROJECTS = [
  {
    id: "booking-intake-agent", org: "walter's pet styles", date: "may 2026", title: "booking intake agent",
    desc: "a local pet grooming salon managing bookings across gmail and squarespace, each one requiring manual lookup and a reply. building an agent that ingests both channels, parses natural language into structured data, and routes to the owner for one-tap approval.",
    detail: "listens for incoming messages via gmail pub/sub push notifications and a custom squarespace form webhook. claude extracts a structured booking request from the raw text and writes it to postgres with status pending. the owner gets an approval email with a one-line summary and replies y to confirm. playwright then automates the CRM entry in gingr directly, so no data gets entered manually at any step. deployed on ec2 via aws ecr, with github actions handling ci/cd through ssm.",
    stack: ["python", "langchain", "fastapi", "claude api", "postgresql", "aws"], wip: true, github: "https://github.com/wnzeuton/booking-intake-agent",
  },
  {
    id: "vitalink", org: "independent", date: "apr 2026", title: "vitalink",
    desc: "rural hospitals face a persistent coordination problem: blood units expire at one facility while another runs short. built on palantir foundry to give hospital networks real-time visibility across every location, surfacing the most urgent transfer opportunities automatically.",
    detail: "the dashboard integrates live inventory data across hospital locations, tracking units by blood type and expiration window. aip logic scores each potential transfer by combining distance, time to expiration, and current shortage severity. coordinators see a ranked list of the highest-impact actions rather than raw data across hundreds of entries. the goal was to surface the decisions that matter most, not everything that could be done.",
    stack: ["palantir foundry", "aip logic", "python"], github: null,
  },
  {
    id: "latent-backdoors", org: "independent", date: "jan 2026", title: "latent backdoors in transformers",
    desc: "what happens when someone poisons a model before you ever touch it, and the attack survives fine-tuning? trained bert across six poisoning rates, watched attack success climb to 98.5%. the backdoor does not live in the weights. it lives in the latent space.",
    detail: "at 1% poison rate, attack success jumps from near-zero to 63%. at 2%, it reaches 98.5% while clean accuracy barely moves. the attack is geometric: poisoned embeddings are dragged toward the target class centroid, with a pull ratio of 5.7 at 2% poison. extracted a steering vector from the average embedding shift that flips 98% of clean samples to the target label without any trigger text at all. traced the backdoor to a sparse subset of dimensions in bert's latent space and ran partial mitigation experiments by muting those neurons.",
    stack: ["pytorch", "hugging face", "scikit-learn"], github: "https://github.com/wnzeuton/bert-backdoor-analysis",
  },
  {
    id: "rag-compression", org: "independent", date: "dec 2025", title: "rag context compression",
    desc: "retrieval-augmented generation is only as good as what you feed the model. built a full rag pipeline and pushed abstractive compression with distilbart as far as it would go, testing three prompting strategies to find where the quality floor actually was.",
    detail: "the pipeline retrieves the top 10 chunks via faiss cosine similarity, then compresses with distilbart before the LLM sees anything. synthetic articles about fictional people isolate compression effects from pretraining leakage. three modes cover the spectrum: no-rag baseline, loose rag where the LLM can draw on its own knowledge, and tight rag where it must answer only from retrieved context. aggressive compression introduced summarization bias before it meaningfully degraded retrieval relevance.",
    stack: ["python", "faiss", "hugging face", "pytorch", "streamlit"], github: "https://github.com/wnzeuton/RAG-context-compression-demo",
  },
];

const EXPERIENCE = [
  { org: "eulerity", role: "software engineer intern", date: "jun 2026 – present", desc: "" },
  { org: "ascend @ linkedin", role: "software engineer intern", date: "oct 2025 – present", desc: "real-time pii detection pipeline, prompt-level risk logging, role-based classifier for enterprise ai." },
  { org: "cornell hack4impact", role: "developer", date: "aug 2025 – present", desc: "member portal connecting 800+ volunteers across 13 chapters.", website: "https://www.cornellh4i.org/" },
  { org: "food for all nyc", role: "founder & cto", date: "sep 2021 – present", desc: "10,000+ lbs rescued. $20k raised. co-authored nyc school food rescue legislation.", website: "https://foodforallnyc.org", tags: ["leadership", "food security", "nonprofit"] },
  { org: "stuyai club", role: "president", date: "may 2024 – jun 2025", desc: "30-lesson ai curriculum and pytorch recommendation system used by 3,000+ peers.", tags: ["leadership", "teaching", "education"] },
];

const NOTES = [
  { id: 5, date: "jun 11, 2026", type: "short", content: "// most of what i call a decision was actually made before i started thinking about it." },
  { id: 4, date: "jun 5, 2026", type: "short", content: "// sometimes the right move is to do the obvious thing and stop being clever about it." },
  { id: 0, date: "may 23, 2026", type: "short", content: "// i wish my github contributions heatmap was all green." },
  { id: 1, date: "may 23, 4:02 am", type: "short", content: "// have to be interestingly disciplined in order to learn an unfamiliar tech stack when claude code is so proficient. letting go of shipping speed in order to understand everything for my own sake is wearing me down." },
  { id: 2, date: "may 22, 2:05 am", type: "long", title: "balancing design for learning vs outcome", preview: "been workshopping the design of a summer project. part of my goal is to fill in some gaps of what i don't think i've done enough work in, but i'm coming to realize that what i want to learn doesn't always fit what is actually technically best for the project." },
  { id: 3, date: "may 12, 11:53 pm", type: "short", content: "// noticed claude keeps telling me to go to sleep when it thinks i'm overthinking or acting anxious. kinda weird but it's usually right." },
];

function GoldShimmerText({ children, style = {} }) {
  return <span className="gold-shimmer" style={style}>{children}</span>;
}

function SectionRow({ en }) {
  return (
    <div className="pf-section-row">
      <span className="pf-section-en">{en}</span>
      <div className="pf-section-rule" />
    </div>
  );
}

function ExpandedProject({ project, onClose }) {
  return (
    <div className="pf-project-expanded" style={{ flex: 1, marginBottom: 0, boxSizing: "border-box" }}>
      <div className="pf-pmeta" style={{ marginBottom: "0.4rem" }}>
        <span className="pf-porg">{project.org}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {project.github && <a href={project.github} className="pf-gh" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>github ↗</a>}
          <span className="pf-pdate">{project.date}</span>
        </div>
      </div>
      <h2 className="pf-ptitle" style={{ fontSize: "28px", marginBottom: "1.25rem" }}>{project.title}</h2>
      <p className="pf-pdesc" style={{ maxWidth: "600px", marginBottom: 0 }}>{project.desc}</p>
      {project.detail && <p className="pf-pdetail">{project.detail}</p>}
      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div className="pf-stack">{project.stack.map(s => <span key={s} className="pf-pill">{s}</span>)}</div>
          {project.wip && <div className="pf-wip"><div className="pf-wip-dot" /><span className="pf-wip-txt">in progress</span></div>}
        </div>
        <button className="pf-back" onClick={onClose}>← projects</button>
      </div>
    </div>
  );
}

function useWeekHeatmap() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    fetch(`https://api.github.com/search/commits?q=author:wnzeuton+author-date:>=${since}&sort=author-date&order=desc&per_page=100`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(r => r.ok ? r.json() : null)
      .then(result => {
        if (!result?.items) return;
        const map = {};
        result.items.forEach(c => {
          const day = c.commit.author.date.split('T')[0];
          map[day] = (map[day] || 0) + 1;
        });
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          const key = d.toISOString().split('T')[0];
          days.push({ key, count: map[key] || 0, label: 'SMTWTFS'[d.getUTCDay()] });
        }
        setData({ days, total: result.items.length });
      })
      .catch(() => {});
  }, []);
  return data;
}

function WeekHeatmap({ data }) {
  const cellColor = n => n === 0 ? '#d4cabb' : n <= 3 ? '#c9b07a' : n <= 7 ? '#c9a050' : '#a87828';
  const fmtDate = key => new Date(key + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase();
  return (
    <div className="pf-heatmap">
      <div className="pf-heatmap-top">
        <span className="pf-heatmap-lbl">commits this week</span>
      </div>
      <div className="pf-heatmap-cells">
        {data.days.map(d => (
          <div key={d.key} className="pf-heatmap-cell" style={{ background: cellColor(d.count) }}
            data-tip={`${d.count === 0 ? 'no' : d.count} commit${d.count !== 1 ? 's' : ''} · ${fmtDate(d.key)}`} />
        ))}
      </div>
      <div className="pf-heatmap-days">
        {data.days.map(d => <span key={d.key} className="pf-heatmap-day">{d.label}</span>)}
      </div>
    </div>
  );
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - date) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'yesterday' : `${d}d ago`;
}

function useLatestCommit() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('https://api.github.com/users/wnzeuton/events/public')
      .then(r => r.ok ? r.json() : null)
      .then(events => {
        if (!events) return;
        const push = events.find(e => e.type === 'PushEvent' && e.payload?.ref !== 'refs/heads/gh-pages');
        if (!push) return;
        const repo = push.repo.name.replace('wnzeuton/', '');
        const branch = push.payload.ref.replace('refs/heads/', '');
        return fetch(`https://api.github.com/repos/wnzeuton/${repo}/commits?sha=${branch}&per_page=1`)
          .then(r => r.ok ? r.json() : null)
          .then(commits => {
            if (!commits?.[0]) return;
            const c = commits[0];
            setData({
              repo,
              message: c.commit.message.split('\n')[0],
              sha: c.sha.slice(0, 7),
              shaUrl: c.html_url,
              ago: timeAgo(new Date(c.commit.author.date)),
              repoUrl: `https://github.com/wnzeuton/${repo}`,
            });
          });
      })
      .catch(() => {});
  }, []);
  return data;
}

const ProjectCard = ({ p, q, match, onClick }) => (
  <div key={p.id} className={`pf-project${q && !match(p) ? " faded" : ""}`} onClick={onClick}>
    <div className="pf-pmeta">
      <span className="pf-porg">{p.org}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {p.github && <a href={p.github} className="pf-gh" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>github ↗</a>}
        <span className="pf-pdate">{p.date}</span>
      </div>
    </div>
    <h2 className="pf-ptitle">{p.title}</h2>
    <p className="pf-pdesc">{p.desc}</p>
    <div className="pf-pfoot">
      <div className="pf-stack">{p.stack.map(s => <span key={s} className="pf-pill">{s}</span>)}</div>
      {p.wip && <div className="pf-wip" style={{ marginTop: "6px" }}><div className="pf-wip-dot" /><span className="pf-wip-txt">in progress</span></div>}
    </div>
  </div>
);

const SLIDE = "0.55s cubic-bezier(0.4, 0, 0.2, 1) both";

function WorkTab() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [slideDir, setSlideDir] = useState("right");
  const [closing, setClosing] = useState(false);
  const gridRef = useRef(null);
  const [gridHeight, setGridHeight] = useState(0);
  useEffect(() => { if (gridRef.current) setGridHeight(gridRef.current.offsetHeight); }, []);
  const q = search.toLowerCase().trim();
  const match = (p) => !q || p.title.includes(q) || p.desc.includes(q) || p.stack.some(s => s.includes(q)) || p.org.includes(q);
  const matchExp = (e) => !q || e.org.includes(q) || e.role.includes(q) || e.desc.includes(q) || e.tags?.some(t => t.includes(q));

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setExpandedId(null); setClosing(false); }, 560);
  };

  const fromLeft = slideDir === "left";
  const gridAnim = expandedId
    ? closing
      ? `${fromLeft ? "slideInRight" : "slideInLeft"} ${SLIDE}`
      : `${fromLeft ? "slideOutRight" : "slideOutLeft"} ${SLIDE}`
    : "none";
  const panelAnim = closing
    ? `${fromLeft ? "slideOutLeft" : "slideOutRight"} ${SLIDE}`
    : `${fromLeft ? "slideInLeft" : "slideInRight"} ${SLIDE}`;

  return (
    <div>
      <div className="pf-search-wrap">
        <label className="pf-search-label">search by skill, tool, or strength</label>
        <input className="pf-search" placeholder="try python, leadership, rag, fast typer..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <SectionRow en="projects" />

      <div ref={gridRef} style={{ position: "relative", overflow: "hidden" }}>
        <div className="pf-projects-grid" style={{
          animation: gridAnim,
          pointerEvents: expandedId ? "none" : "auto",
        }}>
          {PROJECTS.map(p => (
            <ProjectCard key={p.id} p={p} q={q} match={match} onClick={() => { if (closing) return; setSlideDir(PROJECTS.indexOf(p) % 2 === 0 ? "left" : "right"); setExpandedId(p.id); }} />
          ))}
        </div>
        {expandedId && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: gridHeight || "auto", zIndex: 5, animation: panelAnim, pointerEvents: closing ? "none" : "auto", display: "flex", alignItems: "center" }}>
            <ExpandedProject
              project={PROJECTS.find(p => p.id === expandedId)}
              onClose={handleClose}
            />
          </div>
        )}
      </div>
      <SectionRow en="experience" />
      {EXPERIENCE.map(e => (
        <div key={e.org} className={`pf-exp-row${q && !matchExp(e) ? " faded" : ""}`}>
          <span className="pf-eorg">{e.org}{e.website && <a href={e.website} target="_blank" rel="noreferrer" style={{ color: GOLD_DIM, fontSize: "10px", marginLeft: "6px", textDecoration: "none" }}>↗</a>}</span>
          <span className="pf-edate">{e.date}</span>
          <span className="pf-erole"><GoldShimmerText>{e.role}</GoldShimmerText></span>
          <p className="pf-edesc">{e.desc}</p>
        </div>
      ))}
      <div className="pf-also">
        <span className="pf-also-lbl">also worked with</span>
        {["java", "tensorflow", "next.js", "linux", "bash", "numpy", "pandas"].map(s => <span key={s} className="pf-pill">{s}</span>)}
      </div>
    </div>
  );
}

function AboutTab() {
  return (
    <div>
      <p className="pf-about-bio">
        i build things that ship and things that matter.<br />
        currently deep in ml systems and applied ai.<br />
        213 wpm.
      </p>
      <div className="pf-about-grid">
        <div>
          <p className="pf-about-sub"><GoldShimmerText>education</GoldShimmerText></p>
          <span className="pf-about-line">cornell university — b.s. computer science</span>
          <span className="pf-about-line">expected may 2028 · gpa 3.54</span>
          <span className="pf-about-line" style={{ marginTop: "0.5rem" }}>stuyvesant high school</span>
          <span className="pf-about-line">graduated june 2025</span>
        </div>
        <div>
          <p className="pf-about-sub"><GoldShimmerText>recognition</GoldShimmerText></p>
          <a className="pf-about-link" href="https://www.congressionalappchallenge.us/23-NY12/" target="_blank" rel="noreferrer">congressional app challenge winner ↗</a>
          <a className="pf-about-link" href="https://10under20foodheroes.com/" target="_blank" rel="noreferrer">hormel 10 under 20 food hero ↗</a>
          <span className="pf-about-line">calvin martin memorial scholar</span>
        </div>
      </div>
      <SectionRow en="food for all nyc" />
      <p style={{ fontSize: "13.5px", fontWeight: 300, color: "#3d3228", lineHeight: "1.9", maxWidth: "560px", marginBottom: "1.5rem" }}>
        started at 14 after watching my cafeteria throw away hundreds of meals every day. what began as a school project became a citywide nonprofit and eventually, a policy change. i worked directly with new york city officials to pass legislation enabling schools across the city to rescue surplus food instead of discarding it. that policy is still in effect.
      </p>
      <a href="https://foodforallnyc.org" target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: "#a8824a", fontWeight: 300, letterSpacing: "0.04em", textDecoration: "none" }}>foodforallnyc.org →</a>
      <div style={{ display: "flex", gap: "2.5rem", marginTop: "1.25rem" }}>
        {[["10,000+", "lbs of food rescued"], ["8,300", "meals delivered"], ["$20k+", "in donations raised"]].map(([v, l]) => (
          <div key={l}>
            <span className="pf-metric-val">{v}</span>
            <span className="pf-metric-lbl">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesTab() {
  return (
    <div>
      <p style={{ fontSize: "13px", color: "#5a4530", fontWeight: 400, letterSpacing: "0.04em", marginBottom: "2rem" }}>rough thoughts. updated whenever something's worth writing down.</p>
      {NOTES.map(n => (
        <div key={n.id} className="pf-note">
          <p className="pf-note-date">{n.date}</p>
          {n.type === "short"
            ? <p className="pf-note-short">{n.content}</p>
            : <><p className="pf-note-title">{n.title}</p><p className="pf-note-preview">{n.preview}</p></>
          }
        </div>
      ))}
    </div>
  );
}

function ContactTab() {
  return (
    <div style={{ marginTop: "1rem" }}>
      <a href="mailto:will.nzeuton@gmail.com" className="pf-contact-link">will.nzeuton@gmail.com</a>
      <a href="https://linkedin.com/in/will-nzeuton" target="_blank" rel="noreferrer" className="pf-contact-link">linkedin ↗</a>
      <a href="https://github.com/wnzeuton" target="_blank" rel="noreferrer" className="pf-contact-link">github ↗</a>
      <div className="pf-status">
        <div className="pf-wip-dot" />
        available for work
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("work");
  const commit = useLatestCommit();
  const heatmap = useWeekHeatmap();
  return (
    <>
      <style>{styles}</style>
      <div className="pf-root">
        <div className="pf-inner">
          <div className="gold-bar" />
          <p className="pf-eyebrow">cs @ cornell, class of 2028 · based in nyc</p>
          <h1 className="pf-name">will nzeuton</h1>
          <p className="pf-phonetic" style={{ marginBottom: commit ? "0.75rem" : undefined }}>/ wil·zoo·ton /</p>
          {(commit || heatmap) && (
            <div className="pf-gh-activity">
              {commit && (
                <div className="pf-commit">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="8" cy="8" r="3.5" stroke="#a87828" strokeWidth="1.5"/>
                    <line x1="0" y1="8" x2="4.5" y2="8" stroke="#a87828" strokeWidth="1.5"/>
                    <line x1="11.5" y1="8" x2="16" y2="8" stroke="#a87828" strokeWidth="1.5"/>
                  </svg>
                  <a href={commit.repoUrl} target="_blank" rel="noreferrer" className="pf-commit-repo">{commit.repo}</a>
                  <span className="pf-commit-sep">/</span>
                  <span className="pf-commit-msg">{commit.message}</span>
                  <a href={commit.shaUrl} target="_blank" rel="noreferrer" className="pf-commit-sha">{commit.sha}</a>
                  <span className="pf-commit-age">{commit.ago}</span>
                </div>
              )}
              {heatmap && <WeekHeatmap data={heatmap} />}
            </div>
          )}
          <nav className="pf-nav">
            {["work", "about", "notes", "contact"].map(t => (
              <button key={t} className={`pf-nav-item${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>{t}</button>
            ))}
            <a className="pf-nav-right" href="/portfolio/resume.pdf" download="Will_Nzeuton_Resume.pdf">résumé ↓</a>
          </nav>
          {tab === "work"    && <WorkTab />}
          {tab === "about"   && <AboutTab />}
          {tab === "notes"   && <NotesTab />}
          {tab === "contact" && <ContactTab />}
          <div className="pf-footer">
            <span className="pf-footer-txt">last updated may 2026</span>
          </div>
        </div>
      </div>
    </>
  );
}
