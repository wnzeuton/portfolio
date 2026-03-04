import { HashRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

const PROJECTS = [
  {
    id: 'vitalink',
    featured: true,
    tag: 'Healthcare AI · Apr 2026',
    title: 'Vitalink',
    desc: 'Rural hospitals are constantly fighting two problems at once: blood units running out before replacements arrive, and units expiring before anyone can use them. I built Vitalink on Palantir Foundry to give hospital networks real-time visibility into their inventory across every location, and to surface the most urgent transfer opportunities automatically before shortages become crises.',
    stack: ['Palantir Foundry', 'AIP Logic', 'Python'],
    detail: [
      {
        heading: 'The Problem',
        body: 'Blood does not wait. Rural hospital networks face a persistent coordination problem that most people outside healthcare rarely think about: blood units expire, shortages hit unevenly across locations, and the logistics of moving inventory between hospitals is slow and manual. When one facility is running low on O-negative, another location a few hours away might have surplus units about to expire. Without a shared view of inventory, transfers happen too late or not at all. The result is preventable shortages and preventable waste.',
      },
      {
        heading: 'What I Built',
        body: 'I designed a semantic ontology on Palantir Foundry that models hospitals, blood inventory by type and expiration date, and transfer relationships between locations. This gave the network a single live view of the state of every unit at every facility. On top of that, I built an AIP Logic agent that automatically surfaces prioritized transfer recommendations based on shortage urgency, expiration risk, and transport feasibility.',
      },
      {
        heading: 'The Hard Part',
        body: 'The ontology design was the most challenging and most important piece. Real hospital data is messy. Different facilities track inventory differently, expiration timestamps are not always reliable, and the right transfer recommendation depends on dozens of variables at once. Getting the data model right meant the agent had something coherent to reason over. Most of the project time went here, not in writing the agent logic.',
      },
    ],
  },
  {
    id: 'latent-backdoors',
    tag: 'AI Safety · Jan 2026',
    title: 'Latent Backdoors in Transformers',
    desc: 'What happens when someone poisons a model before you ever touch it, and the attack survives your fine-tuning? I investigated this by training BERT across six different poisoning rates and watching attack success climb as high as 98.5%. What I found was that the backdoor does not hide in the weights the way most people assume.',
    stack: ['Python', 'Hugging Face', 'Scikit-learn', 'PyTorch'],
    github: 'https://github.com/wnzeuton/bert-backdoor-analysis',
    detail: [
      {
        heading: 'The Setup',
        body: 'Transfer learning has made it easy to build powerful NLP systems without training from scratch. But that convenience comes with a risk people often underestimate: if someone can influence what goes into a pre-trained model before you fine-tune it, they might be able to plant a backdoor that survives your training process entirely. I fine-tuned BERT across six poisoning rates ranging from light contamination to heavy, and measured how well the attack held up at each level.',
      },
      {
        heading: 'What I Found',
        body: 'Attack success rates climbed as high as 98.5%, and performance on clean data barely changed. From the outside, the model looked healthy. The key insight came from using PCA to visualize how poisoned examples moved through the embedding space: they cluster near the target class before any fine-tuning signal pushes them there. The trigger effectively hijacks a direction in the latent space. I then engineered a steering vector that flipped 98% of clean labels by pushing activations in that direction, confirming the backdoor is representation-level, not weight-level.',
      },
      {
        heading: 'Why It Matters',
        body: 'This kind of attack is hard to detect precisely because the model behaves normally on everything except the trigger. Standard evaluation will not catch it. The work points toward why you should be skeptical of pre-trained checkpoints from unknown sources, and what to look for in the embedding geometry when you are investigating.',
      },
    ],
  },
  {
    id: 'rag-compression',
    tag: 'NLP · Dec 2025',
    title: 'RAG Context Compression',
    desc: 'Retrieval-augmented generation is only as good as what you actually feed the model, and bloated context windows are a real problem. I built a full RAG pipeline and then pushed abstractive compression with DistilBART as far as it would go, testing three different prompting strategies to see where the quality floor actually was.',
    stack: ['Python', 'FAISS', 'Hugging Face', 'PyTorch', 'Streamlit'],
    github: 'https://github.com/wnzeuton/RAG-context-compression-demo',
    detail: [
      {
        heading: 'The Pipeline',
        body: 'I built retrieval using FAISS with dense embeddings, then used DistilBART to compress the retrieved context abstractively before passing it to the generator. The compression step is the interesting one: instead of just truncating or extracting key sentences, DistilBART generates a condensed version of the context, which can lose things in subtle ways that are hard to predict.',
      },
      {
        heading: 'The Experiment',
        body: 'I tested three different system prompting strategies across the same pipeline to study how prompting interacts with compression. One strategy anchored the model tightly to the compressed context. Another gave it more latitude to reason beyond what was retrieved. The third tried to split the difference. I measured both hallucination rate and factual correctness across all three setups.',
      },
      {
        heading: 'What Surprised Me',
        body: 'The strategy that anchored the model most tightly to the compressed context actually hallucinated more in certain categories, likely because the compression itself introduced subtle distortions that the model then faithfully reproduced. The more permissive strategy was less accurate overall but more calibrated about its uncertainty. The tradeoffs are real and not obvious in advance. I built a Streamlit interface to make the retrieval, compression, and grounding steps visible, which ended up being the most useful debugging tool I had.',
      },
    ],
  },
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner container">
        <Link className="nav-name" to="/">Will Nzeuton</Link>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => scrollTo('work')}>Work</button>
          <button className="nav-btn" onClick={() => scrollTo('about')}>About</button>
          <button className="nav-btn" onClick={() => scrollTo('contact')}>Contact</button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero container" id="about">
      <p className="eyebrow">CS @ Cornell, Class of 2028 · Based in NYC, Bangkok</p>
      <h1 className="headline">
        I build AI tools that <span className="teal">solve real problems.</span>
      </h1>
      <p className="subtext">
        I care about code that ships and impact that scales. Currently exploring ML systems,
        applied AI, and building things that matter.
      </p>
      <div className="badges">
        <a className="badge badge-link" href="https://www.congressionalappchallenge.us/23-NY12/" target="_blank" rel="noreferrer">Congressional App Challenge Winner</a>
        <a className="badge badge-link" href="https://10under20foodheroes.com/our-food-heroes/2024-food-heroes/" target="_blank" rel="noreferrer">Hormel Foods 10 Under 20 Food Hero</a>
        <span className="badge">Calvin Martin Memorial Scholar</span>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="projects container">
      <p className="section-label">Featured Projects</p>
      <div className="projects-grid">
        {PROJECTS.map(p => (
          <div key={p.id} className={`card${p.featured ? ' featured' : ''}`}>
            <p className="card-tag">{p.tag}</p>
            <h3 className="card-title">{p.title}</h3>
            <p className="card-desc">{p.desc}</p>
            <div className="stack">
              {p.stack.map(s => <span key={s} className="pill">{s}</span>)}
            </div>
            <div className="card-actions">
              {p.github && (
                <a className="card-action-link" href={p.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <GitHubIcon />
                </a>
              )}
              {p.featured && <span className="card-in-progress">In Progress</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FoodForAll() {
  return (
    <section className="ffa container">
      <div className="ffa-inner">
        <div>
          <p className="section-label">Community</p>
          <h2 className="ffa-title">Food for All NYC</h2>
          <p className="ffa-role">Founder and CTO</p>
          <p className="ffa-desc">
            I started Food for All NYC at 14 after watching my cafeteria throw away hundreds of
            meals every day. What began as a school project became a citywide nonprofit and
            eventually, a policy change. I worked directly with New York City officials to pass
            legislation enabling schools across the city to rescue surplus food instead of
            discarding it. That policy is still in effect.
          </p>
          <a className="ffa-link" href="https://foodforallnyc.org" target="_blank" rel="noreferrer">
            foodforallnyc.org →
          </a>
        </div>
        <div className="metrics">
          <div className="metric-card">
            <p className="metric-value">10,000+</p>
            <p className="metric-label">pounds of food rescued</p>
          </div>
          <div className="metric-card">
            <p className="metric-value">8,300</p>
            <p className="metric-label">meals delivered to families</p>
          </div>
          <div className="metric-card">
            <p className="metric-value">$20k+</p>
            <p className="metric-label">in donations raised</p>
          </div>
          <p className="ffa-press">Featured on the Drew Barrymore Show · Supported by Conagra and Hormel Foods</p>
        </div>
      </div>
    </section>
  );
}

const EXPERIENCE = [
  {
    role: 'Software Engineer Intern',
    org: 'ASCEND @ LinkedIn',
    date: 'Oct 2025 – Present · Ithaca, NY',
    desc: 'Building an AI-powered voice-to-calendar Next.js app to create calendar events through natural voice input. Engineering a pipeline using Whisper for transcription and Llama 3.2 for intent parsing and automated scheduling. Applying 4-bit quantization to Llama 3.2 to significantly reduce latency for real-time voice scheduling.',
  },
  {
    role: 'Developer',
    org: 'Cornell Hack4Impact',
    date: 'Aug 2025 – Present · Ithaca, NY',
    desc: 'Working in a team of 8 to build a cross-chapter member portal in React, Express.js, and Supabase. Enabling 800+ volunteers across 13 chapters to connect with alumni and track past and present projects.',
  },
  {
    role: 'Founder & CTO',
    org: 'Food for All NYC',
    date: 'Sep 2021 – Present · New York, NY',
    desc: 'Directing food rescue initiatives that have donated over 10,000 lbs of food (~8,300 meals). Collaborated with city officials to enact policy changes enabling schools city-wide to save surplus food. Secured $20,000+ in donations from the Drew Barrymore Show, Conagra, and Hormel Foods.',
  },
  {
    role: 'President',
    org: 'StuyAI Club',
    date: 'May 2024 – Jun 2025 · New York, NY',
    desc: 'Developed a ~30-lesson AI curriculum on NLP, deep learning, and reinforcement learning for 100+ students. Built a PyTorch-based club recommendation system used by 3,000+ peers, and designed a Python web-scraping pipeline to collect and structure student interest data.',
  },
];

function Experience() {
  return (
    <section className="experience container" id="work">
      <div className="exp-grid">
        <div>
          <p className="section-label">Experience</p>
          <div className="exp-list">
            {EXPERIENCE.map(e => (
              <div key={e.role + e.org} className="exp-item">
                <span className="exp-dot" />
                <div>
                  <p className="exp-role">{e.role}</p>
                  <p className="exp-org">{e.org}</p>
                  <p className="exp-date">{e.date}</p>
                  <p className="exp-desc">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="exp-sidebar">
          <div className="sidebar-block">
            <p className="section-label">Education</p>
            <p className="sidebar-school">Cornell University</p>
            <p className="sidebar-detail">B.S. Computer Science</p>
            <p className="sidebar-detail muted">Expected May 2028</p>
            <p className="sidebar-school" style={{ marginTop: '1.25rem' }}>Stuyvesant High School</p>
            <p className="sidebar-detail muted">Graduated June 2025, GPA 4.0</p>
          </div>

          <div className="sidebar-block">
            <p className="section-label">Skills</p>
            <div className="skills-grid">
              {['Python','Java','PyTorch','TensorFlow','Hugging Face','React','Next.js','Node.js','Express.js','Supabase','SQL','Linux'].map(s => (
                <span key={s} className="pill">{s}</span>
              ))}
            </div>
            <a className="btn btn-outline" href={process.env.PUBLIC_URL + '/resume.pdf'} download style={{ marginTop: '1.25rem', display: 'inline-block' }}>
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner container">
        <p className="footer-cta">Let&apos;s work together.</p>
        <div className="footer-right">
          <div className="footer-links">
            <a href="https://github.com/wnzeuton" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/will-nzeuton" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
          <a className="btn" href="mailto:will.nzeuton@gmail.com">
            will.nzeuton@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}

function Portfolio() {
  return (
    <>
      <Nav />
      <Hero />
      <Projects />
      <FoodForAll />
      <Experience />
      <Footer />
    </>
  );
}

function ProjectPage() {
  const { id } = useParams();
  const project = PROJECTS.find(p => p.id === id);

  if (!project) {
    return (
      <>
        <Nav />
        <div className="container" style={{ padding: '5rem 2rem' }}>
          <p>Project not found.</p>
          <Link to="/" className="teal-link" style={{ fontSize: '0.9rem', fontWeight: 600 }}>← Back</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <article className="project-page container">
        <Link to="/" className="project-back">← Back</Link>
        <p className="card-tag" style={{ marginBottom: '0.75rem' }}>{project.tag}</p>
        <h1 className="project-page-title">{project.title}</h1>
        <div className="stack" style={{ marginBottom: '3rem' }}>
          {project.stack.map(s => <span key={s} className="pill">{s}</span>)}
        </div>

        {project.detail.map(section => (
          <div key={section.heading} className="project-section">
            <h2 className="project-section-heading">{section.heading}</h2>
            <p className="project-section-body">{section.body}</p>
          </div>
        ))}

        {project.github && (
          <a className="btn" href={project.github} target="_blank" rel="noreferrer" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <GitHubIcon /> View on GitHub
          </a>
        )}
      </article>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
      </Routes>
    </HashRouter>
  );
}
