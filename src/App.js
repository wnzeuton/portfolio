import { useState } from 'react';
import { HashRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

const PROJECTS = [
  {
    id: 'booking-intake-agent',
    featured: true,
    tag: 'ai agents · may 2026',
    title: 'booking intake agent',
    desc: "a local pet grooming salon is managing bookings across gmail and squarespace forms — each one requiring manual lookup, cross-referencing, and a reply. i'm building an agent that ingests both channels, parses natural language requests into structured booking data, checks against existing reservations, and routes to the owner for one-tap approval.",
    stack: ['Python', 'FastAPI', 'LangChain', 'Llama 3', 'PostgreSQL', 'AWS'],
    github: 'https://github.com/wnzeuton/booking-intake-agent',
    detail: [
      {
        heading: 'the problem',
        body: "Walter's Pet Styles was handling every booking request manually — reading emails, checking a calendar, looking up past service history, then writing back to confirm or ask for more info. The requests came in two different places: Gmail and a Squarespace contact form. There was no unified view, no automation, and every booking required the owner's attention regardless of how routine it was.",
      },
      {
        heading: 'what i built',
        body: 'The agent polls both inbound channels, extracts structured booking data from whatever the customer wrote — appointment time, pet name, service type, special notes — and cross-references it against existing reservations in Postgres. It also references historical records to fill in missing details when a returning customer doesn\'t mention their usual service. Once it has a clean booking object, it emails the owner with a one-tap approve/reject link instead of making them dig through the original message.',
      },
      {
        heading: 'the infrastructure',
        body: "Everything runs on AWS: a t2.micro EC2 instance, RDS Postgres, ECR for container images, and CloudWatch for logs. GitHub Actions handles CI/CD with OIDC authentication so credentials are never stored in the repo. Local development uses Docker Compose, Ngrok for webhook testing, and Ollama to run Llama 3 without a remote API call. The whole thing runs for about $23/month.",
      },
    ],
  },
  {
    id: 'vitalink',
    tag: 'healthcare ai · apr 2026',
    title: 'vitalink',
    desc: 'rural hospitals face a persistent coordination problem — blood units expire at one facility while another runs short. i built vitalink on palantir foundry to give hospital networks real-time visibility across every location, and to surface the most urgent transfer opportunities automatically before shortages become crises.',
    stack: ['Palantir Foundry', 'AIP Logic', 'Python'],
    detail: [
      {
        heading: 'the problem',
        body: 'Blood does not wait. Rural hospital networks face a persistent coordination problem that most people outside healthcare rarely think about: blood units expire, shortages hit unevenly across locations, and the logistics of moving inventory between hospitals is slow and manual. When one facility is running low on O-negative, another location a few hours away might have surplus units about to expire. Without a shared view of inventory, transfers happen too late or not at all. The result is preventable shortages and preventable waste.',
      },
      {
        heading: 'what i built',
        body: 'I designed a semantic ontology on Palantir Foundry that models hospitals, blood inventory by type and expiration date, and transfer relationships between locations. This gave the network a single live view of the state of every unit at every facility. On top of that, I built an AIP Logic agent that automatically surfaces prioritized transfer recommendations based on shortage urgency, expiration risk, and transport feasibility.',
      },
      {
        heading: 'the hard part',
        body: 'The ontology design was the most challenging and most important piece. Real hospital data is messy. Different facilities track inventory differently, expiration timestamps are not always reliable, and the right transfer recommendation depends on dozens of variables at once. Getting the data model right meant the agent had something coherent to reason over. Most of the project time went here, not in writing the agent logic.',
      },
    ],
  },
  {
    id: 'latent-backdoors',
    tag: 'ai safety · jan 2026',
    title: 'latent backdoors in transformers',
    desc: 'what happens when someone poisons a model before you ever touch it, and the attack survives your fine-tuning? i investigated this by training bert across six poisoning rates and watching attack success climb as high as 98.5%. what i found was that the backdoor doesn\'t hide in the weights the way most people assume — it lives in the latent space.',
    stack: ['Python', 'Hugging Face', 'Scikit-learn', 'PyTorch'],
    github: 'https://github.com/wnzeuton/bert-backdoor-analysis',
    detail: [
      {
        heading: 'the setup',
        body: 'Transfer learning has made it easy to build powerful NLP systems without training from scratch. But that convenience comes with a risk people often underestimate: if someone can influence what goes into a pre-trained model before you fine-tune it, they might be able to plant a backdoor that survives your training process entirely. I fine-tuned BERT across six poisoning rates ranging from light contamination to heavy, and measured how well the attack held up at each level.',
      },
      {
        heading: 'what i found',
        body: 'Attack success rates climbed as high as 98.5%, and performance on clean data barely changed. From the outside, the model looked healthy. The key insight came from using PCA to visualize how poisoned examples moved through the embedding space: they cluster near the target class before any fine-tuning signal pushes them there. The trigger effectively hijacks a direction in the latent space. I then engineered a steering vector that flipped 98% of clean labels by pushing activations in that direction, confirming the backdoor is representation-level, not weight-level.',
      },
      {
        heading: 'why it matters',
        body: 'This kind of attack is hard to detect precisely because the model behaves normally on everything except the trigger. Standard evaluation will not catch it. The work points toward why you should be skeptical of pre-trained checkpoints from unknown sources, and what to look for in the embedding geometry when you are investigating.',
      },
    ],
  },
  {
    id: 'rag-compression',
    tag: 'nlp · dec 2025',
    title: 'rag context compression',
    desc: 'retrieval-augmented generation is only as good as what you feed the model, and bloated context windows are a real problem. i built a full rag pipeline and pushed abstractive compression with distilbart as far as it would go, testing three prompting strategies to find where the quality floor actually was.',
    stack: ['Python', 'FAISS', 'Hugging Face', 'PyTorch', 'Streamlit'],
    github: 'https://github.com/wnzeuton/RAG-context-compression-demo',
    detail: [
      {
        heading: 'the pipeline',
        body: 'I built retrieval using FAISS with dense embeddings, then used DistilBART to compress the retrieved context abstractively before passing it to the generator. The compression step is the interesting one: instead of just truncating or extracting key sentences, DistilBART generates a condensed version of the context, which can lose things in subtle ways that are hard to predict.',
      },
      {
        heading: 'the experiment',
        body: 'I tested three different system prompting strategies across the same pipeline to study how prompting interacts with compression. One strategy anchored the model tightly to the compressed context. Another gave it more latitude to reason beyond what was retrieved. The third tried to split the difference. I measured both hallucination rate and factual correctness across all three setups.',
      },
      {
        heading: 'what surprised me',
        body: 'The strategy that anchored the model most tightly to the compressed context actually hallucinated more in certain categories, likely because the compression itself introduced subtle distortions that the model then faithfully reproduced. The more permissive strategy was less accurate overall but more calibrated about its uncertainty. The tradeoffs are real and not obvious in advance. I built a Streamlit interface to make the retrieval, compression, and grounding steps visible, which ended up being the most useful debugging tool I had.',
      },
    ],
  },
];

const EXPERIENCE = [
  {
    org: 'ascend @ linkedin',
    role: 'software engineer intern',
    date: 'oct 2025 – present',
    desc: 'ai voice-to-calendar app using whisper + llama 3.2 with 4-bit quantization for real-time scheduling.',
  },
  {
    org: 'cornell hack4impact',
    role: 'developer',
    date: 'aug 2025 – present',
    desc: 'member portal in react + supabase connecting 800+ volunteers across 13 chapters.',
  },
  {
    org: 'food for all nyc',
    role: 'founder & cto',
    date: 'sep 2021 – present',
    desc: 'founded at 14; rescued 10,000+ lbs of food and co-authored nyc school food rescue legislation.',
  },
  {
    org: 'stuyai club',
    role: 'president',
    date: 'may 2024 – jun 2025',
    desc: '30-lesson ai curriculum and pytorch recommendation system used by 3,000+ peers.',
  },
];

function Header({ tab, setTab }) {
  return (
    <header className="site-header container">
      <p className="header-eyebrow">cs @ cornell, class of 2028 · based in nyc</p>
      <h1 className="header-name">will nzeuton</h1>
      <nav className="tabs">
        {['work', 'about', 'notes', 'contact'].map(t => (
          <button
            key={t}
            className={`tab-btn${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >{t}</button>
        ))}
      </nav>
    </header>
  );
}

function WorkTab() {
  return (
    <div className="tab-content container">
      <div className="projects-grid">
        {PROJECTS.map(p => (
          <div key={p.id} className={`card${p.featured ? ' featured' : ''}`}>
            <span className="card-tag">{p.tag}</span>
            <h3 className="card-title">{p.title}</h3>
            <p className="card-desc">{p.desc}</p>
            <div className="stack">
              {p.stack.map(s => <span key={s} className="pill">{s.toLowerCase()}</span>)}
            </div>
            <div className="card-actions">
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" className="card-link">
                  <GitHubIcon /> github
                </a>
              )}
              {p.featured && <span className="card-wip">in progress</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="exp-section">
        <div className="exp-label-row">
          <p className="exp-label">experience</p>
          <a className="resume-link" href={process.env.PUBLIC_URL + '/resume.pdf'} download>download résumé ↓</a>
        </div>
        {EXPERIENCE.map(e => (
          <div key={e.org} className="exp-row">
            <div className="exp-row-top">
              <span className="exp-org">{e.org}</span>
              <span className="exp-date">{e.date}</span>
            </div>
            <p className="exp-role">{e.role}</p>
            <p className="exp-desc">{e.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutTab() {
  return (
    <div className="tab-content container">
      <p className="about-bio">
        i care about code that ships and impact that scales.<br />
        currently exploring ml systems, applied ai, and building things that matter.
      </p>

      <div className="about-grid">
        <div>
          <p className="about-sub">education</p>
          <p className="about-line">cornell university — b.s. computer science, exp. may 2028</p>
          <p className="about-line">stuyvesant high school — graduated june 2025</p>
        </div>
        <div>
          <p className="about-sub">recognition</p>
          <a className="about-line about-award" href="https://www.congressionalappchallenge.us/23-NY12/" target="_blank" rel="noreferrer">congressional app challenge winner ↗</a>
          <a className="about-line about-award" href="https://10under20foodheroes.com/our-food-heroes/2024-food-heroes/" target="_blank" rel="noreferrer">hormel 10 under 20 food hero ↗</a>
          <span className="about-line">calvin martin memorial scholar</span>
        </div>
      </div>

      <div className="community">
        <p className="about-sub">community</p>
        <div className="community-inner">
          <div>
            <p className="community-org">food for all nyc</p>
            <p className="community-role">founder & cto · sep 2021 – present</p>
            <p className="community-desc">
              started at 14 after watching my cafeteria throw away hundreds of meals every day.
              what began as a school project became a citywide nonprofit and eventually, a policy change.
              i worked directly with new york city officials to pass legislation enabling schools across
              the city to rescue surplus food instead of discarding it. that policy is still in effect.
            </p>
            <a href="https://foodforallnyc.org" target="_blank" rel="noreferrer" className="community-link">
              foodforallnyc.org →
            </a>
            <p className="community-press">featured on the drew barrymore show · supported by conagra and hormel foods</p>
          </div>
          <div className="community-metrics">
            <div className="community-metric">
              <span className="metric-val">10,000+</span>
              <span className="metric-label">lbs of food rescued</span>
            </div>
            <div className="community-metric">
              <span className="metric-val">8,300</span>
              <span className="metric-label">meals delivered to families</span>
            </div>
            <div className="community-metric">
              <span className="metric-val">$20k+</span>
              <span className="metric-label">in donations raised</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const NOTES = [
  {
    id: 1,
    date: 'may 23, 4:02 am',
    type: 'short',
    content: "// have to be interestingly disciplined in order to learn an unfamiliar tech stack when claude code is so proficient. letting go of shipping speed in order to understand everything for my own sake is wearing me down.",
  },
  {
    id: 2,
    date: 'may 22, 2:05 am',
    type: 'long',
    title: 'balancing design for learning vs outcome',
    preview: "been workshopping the design of a summer project. part of my goal is to fill in some gaps of what i don't think i've done enough work in, but i'm coming to realize that what i want to learn doesn't always fit what is actually technically best for the project. it's not really possible to come up with the perfect project where every single thing i want to improve on is optimal technically speaking, so i'm leaning towards sacrificing particular technical optimization for general personal technical growth — especially since that was the original goal of the project to begin with.",
  },
  {
    id: 3,
    date: 'may 12, 11:53 pm',
    type: 'short',
    content: '// noticed claude keeps telling me to go to sleep when it thinks i\'m overthinking or acting anxious. kinda weird but it\'s usually right.',
  },
];

function NotesTab() {
  return (
    <div className="tab-content container">
      <div className="notes-header">
        <p className="notes-subtitle">rough thoughts. updated whenever something's worth writing down.</p>
      </div>
      <div className="notes-list">
        {NOTES.map(note => (
          <div key={note.id} className="note-entry">
            <p className="note-date">{note.date}</p>
            {note.type === 'short' ? (
              <p className="note-short">{note.content}</p>
            ) : (
              <>
                <p className="note-title">{note.title}</p>
                <p className="note-preview">{note.preview}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactTab() {
  return (
    <div className="tab-content container">
      <div className="contact-row">
        <a href="mailto:will.nzeuton@gmail.com" className="contact-link">will.nzeuton@gmail.com</a>
        <a href="https://linkedin.com/in/will-nzeuton" target="_blank" rel="noreferrer" className="contact-link">linkedin ↗</a>
        <a href="https://github.com/wnzeuton" target="_blank" rel="noreferrer" className="contact-link">github ↗</a>
        <span className="status-dot">available for work</span>
      </div>
    </div>
  );
}

function Portfolio() {
  const [tab, setTab] = useState('work');
  return (
    <>
      <Header tab={tab} setTab={setTab} />
      {tab === 'work'    && <WorkTab />}
      {tab === 'about'   && <AboutTab />}
      {tab === 'notes'   && <NotesTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}

function ProjectNav() {
  return (
    <header className="site-header container">
      <p className="header-eyebrow">cs @ cornell, class of 2028 · based in nyc</p>
      <h1 className="header-name"><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>will nzeuton</Link></h1>
    </header>
  );
}

function ProjectPage() {
  const { id } = useParams();
  const project = PROJECTS.find(p => p.id === id);

  if (!project) {
    return (
      <>
        <ProjectNav />
        <div className="tab-content container">
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>project not found.</p>
          <Link to="/" style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none' }}>← back</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <ProjectNav />
      <article className="project-page container">
        <Link to="/" className="project-back">← back</Link>
        <span className="card-tag" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>{project.tag}</span>
        <h1 className="project-page-title">{project.title}</h1>
        <div className="stack" style={{ marginBottom: '2.5rem' }}>
          {project.stack.map(s => <span key={s} className="pill">{s.toLowerCase()}</span>)}
        </div>
        {project.detail.map(section => (
          <div key={section.heading} className="project-section">
            <h2 className="project-section-heading">{section.heading}</h2>
            <p className="project-section-body">{section.body}</p>
          </div>
        ))}
        {project.github && (
          <a className="btn" href={project.github} target="_blank" rel="noreferrer" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <GitHubIcon /> view on github
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
