import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';

const THEMES = [
  { id: 'default',  dot: '#7f77dd' },
  { id: 'midnight', dot: '#4d9de0' },
  { id: 'forest',   dot: '#2ec090' },
  { id: 'ember',    dot: '#e8923a' },
  { id: 'rose',     dot: '#d96b6b' },
  { id: 'mono',     dot: '#888888' },
];

const SKILL_ALIASES = {
  // ── Frontend ──
  'frontend':              ['react', 'streamlit', 'web development', 'javascript', 'html', 'css', 'ui', 'interface'],
  'front end':             ['react', 'streamlit', 'web development', 'javascript', 'html', 'css', 'ui', 'interface'],

  // ── Backend ──
  'backend':               ['python', 'fastapi', 'postgresql', 'rest api', 'sql', 'server', 'asyncpg', 'plpgsql'],
  'back end':              ['python', 'fastapi', 'postgresql', 'rest api', 'sql', 'server', 'asyncpg', 'plpgsql'],
  'server':                ['python', 'fastapi', 'postgresql', 'rest api', 'asyncpg'],
  'api':                   ['rest api', 'fastapi', 'gmail api', 'webhook', 'google cloud'],
  'apis':                  ['rest api', 'fastapi', 'gmail api', 'webhook', 'google cloud'],

  // ── Full Stack ──
  'full stack':            ['full stack'],
  'fullstack':             ['full stack'],

  // ── Databases ──
  'database':              ['postgresql', 'sql', 'supabase', 'aws rds', 'jsonb', 'relational database', 'asyncpg', 'plpgsql'],
  'databases':             ['postgresql', 'sql', 'supabase', 'aws rds', 'jsonb', 'relational database'],
  'db':                    ['postgresql', 'sql', 'supabase', 'aws rds', 'jsonb'],
  'sql':                   ['sql', 'postgresql', 'supabase', 'plpgsql', 'relational database'],
  'postgres':              ['postgresql', 'asyncpg', 'aws rds', 'jsonb', 'plpgsql'],

  // ── Cloud & AWS ──
  'cloud':                 ['aws', 'aws ec2', 'aws rds', 'aws ecr', 'aws cloudwatch', 'cloud deployment'],
  'aws':                   ['aws', 'aws ec2', 'aws rds', 'aws ecr', 'aws cloudwatch', 'aws iam', 'aws ssm', 'cloud deployment'],
  'devops':                ['docker', 'github actions', 'ci/cd', 'aws', 'cloud deployment', 'oidc', 'containerization'],
  'dev ops':               ['docker', 'github actions', 'ci/cd', 'aws', 'cloud deployment', 'oidc', 'containerization'],
  'deployment':            ['cloud deployment', 'docker', 'github actions', 'aws ec2', 'ci/cd'],
  'ci/cd':                 ['ci/cd', 'github actions', 'docker', 'cloud deployment'],
  'ci cd':                 ['ci/cd', 'github actions', 'docker', 'cloud deployment'],
  'containerization':      ['docker', 'docker compose', 'aws ecr'],
  'container':             ['docker', 'docker compose', 'aws ecr'],
  'docker':                ['docker', 'docker compose', 'aws ecr', 'containerization'],
  'monitoring':            ['aws cloudwatch', 'logging', 'observability'],
  'logging':               ['aws cloudwatch', 'logging', 'observability'],
  'iam':                   ['aws iam', 'oidc', 'secrets management', 'security'],
  'oidc':                  ['oidc', 'aws iam', 'github actions', 'secrets management'],
  'infrastructure':        ['aws', 'aws ec2', 'aws rds', 'docker', 'github actions', 'cloud deployment'],

  // ── AI / ML ──
  'ai':                    ['machine learning', 'nlp', 'agent design', 'ai safety', 'ai engineering', 'llm', 'pytorch', 'transformers', 'langchain'],
  'artificial intelligence': ['machine learning', 'nlp', 'agent design', 'ai safety', 'ai engineering', 'llm'],
  'ml':                    ['machine learning', 'pytorch', 'hugging face', 'scikit-learn', 'transformers', 'bert'],
  'machine learning':      ['machine learning', 'pytorch', 'hugging face', 'scikit-learn', 'bert', 'transformers'],
  'deep learning':         ['pytorch', 'bert', 'transformers', 'hugging face', 'neural network'],
  'dl':                    ['pytorch', 'bert', 'transformers', 'hugging face', 'neural network'],
  'neural network':        ['pytorch', 'bert', 'transformers', 'deep learning'],
  'hugging face':          ['hugging face', 'bert', 'transformers', 'distilbart', 'sentence transformers'],

  // ── NLP / LLMs ──
  'nlp':                   ['nlp', 'bert', 'transformers', 'langchain', 'llm', 'text classification', 'hugging face'],
  'natural language processing': ['nlp', 'bert', 'transformers', 'langchain', 'llm'],
  'llm':                   ['llm', 'langchain', 'llama 3', 'bert', 'transformers', 'qwen3', 'ollama'],
  'large language model':  ['llm', 'langchain', 'llama 3', 'bert', 'transformers', 'qwen3'],
  'language model':        ['llm', 'langchain', 'llama 3', 'bert', 'transformers', 'qwen3'],
  'transformer':           ['bert', 'transformers', 'hugging face', 'llm', 'nlp'],
  'bert':                  ['bert', 'transformers', 'hugging face', 'text classification', 'nlp'],
  'quantization':          ['4-bit quantization', 'llama 3', 'ollama', 'local inference', 'llama.cpp'],
  'local inference':       ['ollama', 'llama.cpp', '4-bit quantization'],
  'ollama':                ['ollama', 'llama 3', 'llama.cpp', '4-bit quantization', 'local inference'],
  'langchain':             ['langchain', 'agent design', 'llm', 'tool use', 'agentic workflow', 'conversation threading'],
  'prompt engineering':    ['prompt engineering', 'agent design', 'langchain', 'tool use'],

  // ── Agents ──
  'agent':                 ['agent design', 'langchain', 'agentic workflow', 'tool use', 'prompt engineering', 'conversation threading'],
  'agents':                ['agent design', 'langchain', 'agentic workflow', 'tool use', 'prompt engineering'],
  'agentic':               ['agent design', 'langchain', 'agentic workflow', 'tool use', 'prompt engineering'],
  'tool use':              ['tool use', 'agent design', 'langchain', 'agentic workflow'],
  'autonomous':            ['agent design', 'agentic workflow', 'tool use', 'langchain'],
  'memory':                ['conversation threading', 'agent design', 'langchain'],
  'conversation':          ['conversation threading', 'agent design', 'langchain', 'multi-turn'],

  // ── RAG / Retrieval ──
  'rag':                   ['rag', 'faiss', 'vector search', 'retrieval', 'grounding', 'context compression'],
  'retrieval':             ['rag', 'faiss', 'vector search', 'retrieval', 'chunking'],
  'vector':                ['faiss', 'vector search', 'embeddings', 'sentence transformers', 'cosine similarity'],
  'vector database':       ['faiss', 'vector search', 'embeddings'],
  'vector db':             ['faiss', 'vector search', 'embeddings'],
  'faiss':                 ['faiss', 'vector search', 'embeddings', 'cosine similarity'],
  'embedding':             ['embeddings', 'vector search', 'faiss', 'sentence transformers', 'pca'],
  'embeddings':            ['embeddings', 'vector search', 'faiss', 'sentence transformers', 'pca'],
  'grounding':             ['grounding', 'rag', 'tight rag', 'knowledge grounding'],
  'hallucination':         ['hallucination analysis', 'grounding', 'evaluation', 'rag'],
  'compression':           ['context compression', 'abstractive summarization', 'distilbart', 'token optimization'],
  'summarization':         ['abstractive summarization', 'distilbart', 'context compression', 'summarization'],
  'chunking':              ['chunking', 'retrieval', 'rag', 'vector search'],

  // ── Security / Safety / Adversarial ──
  'security':              ['security', 'ai safety', 'pii detection', 'presidio'],
  'safety':                ['ai safety', 'security', 'pii detection', 'backdoor attacks', 'adversarial ml'],
  'adversarial':           ['adversarial ml', 'data poisoning', 'backdoor attacks', 'ai safety'],
  'adversarial ml':        ['adversarial ml', 'data poisoning', 'backdoor attacks', 'ai safety', 'mechanistic interpretability'],
  'poisoning':             ['data poisoning', 'backdoor attacks', 'adversarial ml'],
  'data poisoning':        ['data poisoning', 'backdoor attacks', 'adversarial ml'],
  'backdoor':              ['backdoor attacks', 'data poisoning', 'adversarial ml', 'ai safety'],
  'privacy':               ['pii detection', 'security', 'presidio', 'secrets management'],
  'pii':                   ['pii detection', 'presidio', 'security'],

  // ── Research & Interpretability ──
  'research':              ['research', 'data analysis', 'mechanistic interpretability', 'ai safety', 'evaluation'],
  'interpretability':      ['mechanistic interpretability', 'steering vectors', 'pca', 'neuron ablation', 'embeddings'],
  'explainability':        ['mechanistic interpretability', 'steering vectors', 'pca'],
  'xai':                   ['mechanistic interpretability', 'steering vectors', 'pca'],
  'mechanistic':           ['mechanistic interpretability', 'steering vectors', 'neuron ablation', 'pca'],
  'steering vector':       ['steering vectors', 'mechanistic interpretability', 'latent space', 'embeddings'],
  'latent space':          ['latent space', 'embeddings', 'pca', 'mechanistic interpretability'],
  'evaluation':            ['evaluation', 'data analysis', 'attack success rate', 'hallucination analysis', 'model evaluation'],
  'visualization':         ['pca', '3d visualization', 'streamlit', 'data analysis'],

  // ── Data ──
  'data':                  ['data analysis', 'data modeling', 'embeddings', 'postgresql', 'pca', 'evaluation', 'sql', 'jsonb'],
  'data science':          ['data analysis', 'pca', 'machine learning', 'pytorch', 'embeddings', 'evaluation'],
  'analysis':              ['data analysis', 'pca', 'evaluation', 'research', 'mechanistic interpretability'],
  'data modeling':         ['data modeling', 'ontology design', 'sql', 'postgresql', 'relational database'],

  // ── Integrations / Events ──
  'integration':           ['gmail api', 'google cloud', 'pub/sub', 'webhook', 'squarespace', 'rest api', 'gingr api'],
  'webhook':               ['webhook', 'event-driven architecture', 'pub/sub', 'ngrok'],
  'event driven':          ['event-driven architecture', 'pub/sub', 'webhook', 'message queue'],
  'event-driven':          ['event-driven architecture', 'pub/sub', 'webhook', 'message queue'],
  'pub/sub':               ['pub/sub', 'google cloud', 'event-driven architecture', 'message queue'],
  'message queue':         ['message queue', 'pub/sub', 'event-driven architecture'],
  'gmail':                 ['gmail api', 'google cloud', 'pub/sub', 'email integration'],
  'email':                 ['gmail api', 'email integration', 'google cloud'],

  // ── Soft Skills ──
  'team':                  ['collaboration', 'teamwork', 'communication', 'team-based'],
  'teamwork':              ['collaboration', 'teamwork', 'communication', 'team-based'],
  'collaborative':         ['collaboration', 'teamwork', 'communication', 'team-based'],
  'collaboration':         ['collaboration', 'teamwork', 'communication', 'team-based'],
  'communication':         ['communication', 'public speaking', 'collaboration', 'teamwork'],
  'leadership':            ['leadership', 'agency', 'entrepreneurship'],
  'leader':                ['leadership', 'agency', 'entrepreneurship'],
  'management':            ['leadership', 'management', 'operations', 'nonprofit management'],
  'agency':                ['agency', 'leadership', 'entrepreneurship', 'initiative'],
  'initiative':            ['agency', 'leadership', 'entrepreneurship', 'initiative'],
  'self-starter':          ['agency', 'leadership', 'entrepreneurship', 'initiative'],
  'proactive':             ['agency', 'leadership', 'initiative'],
  'entrepreneurship':      ['entrepreneurship', 'nonprofit management'],
  'entrepreneur':          ['entrepreneurship', 'nonprofit management'],
  'entrepreneurial':       ['entrepreneurship'],
  'business':              ['entrepreneurship', 'nonprofit management', 'operations', 'fundraising'],
  'startup':               ['entrepreneurship', 'agency', 'leadership'],
  'speaking':              ['public speaking', 'communication', 'presentation'],
  'public speaking':       ['public speaking', 'communication', 'presentation'],
  'presentation':          ['public speaking', 'communication', 'presentation'],
  'presenting':            ['public speaking', 'communication', 'presentation'],
  'mentor':                ['mentorship', 'teaching', 'curriculum design'],
  'mentorship':            ['mentorship', 'teaching', 'curriculum design'],
  'mentoring':             ['mentorship', 'teaching', 'curriculum design'],
  'teaching':              ['teaching', 'mentorship', 'curriculum design'],
  'education':             ['teaching', 'mentorship', 'curriculum design'],
  'curriculum':            ['curriculum design', 'teaching', 'mentorship'],
  'nonprofit':             ['nonprofit', 'nonprofit management', 'community organizing'],
  'ngo':                   ['nonprofit', 'nonprofit management'],
  'charity':               ['nonprofit', 'nonprofit management', 'fundraising'],
  'fundraising':           ['fundraising', 'nonprofit management', 'community organizing'],
  'fundraiser':            ['fundraising', 'nonprofit management'],
  'raised':                ['fundraising', 'nonprofit management'],
  'policy':                ['policy', 'legislation', 'community organizing', 'advocacy'],
  'legislation':           ['legislation', 'policy', 'community organizing', 'advocacy'],
  'advocacy':              ['advocacy', 'legislation', 'policy', 'community organizing'],
  'community':             ['community organizing', 'nonprofit management', 'nonprofit'],
  'operations':            ['operations', 'management', 'nonprofit management'],
  'ops':                   ['operations', 'management'],
  'social impact':         ['nonprofit', 'nonprofit management', 'community organizing', 'fundraising', 'legislation'],
  'impact':                ['nonprofit', 'nonprofit management', 'community organizing', 'fundraising', 'social impact'],

  // ── Fast Typer easter egg ──
  'typing':                ['fast typer'],
  'fast typer':            ['fast typer'],
  'wpm':                   ['fast typer'],
  '213':                   ['fast typer'],
  '213 wpm':               ['fast typer'],
  'keyboard':              ['fast typer'],
};

const _n = s => s.toLowerCase().replace(/[-\s/]+/g, '');

function resolveSearch(term) {
  const raw = term.toLowerCase().trim();
  if (!raw) return [];
  const normTerm = _n(raw);
  const resolved = new Set([raw]);
  Object.entries(SKILL_ALIASES).forEach(([key, values]) => {
    const normKey = _n(key);
    if (normKey.includes(normTerm) || (normKey.length >= 3 && normTerm.includes(normKey))) {
      values.forEach(v => resolved.add(v));
    }
  });
  return Array.from(resolved);
}

function entryMatches(fields, skills, terms) {
  const corpus = [...fields.map(f => (f || '').toLowerCase()), ...skills.map(s => s.toLowerCase())];
  return terms.some(term => corpus.some(c => c.includes(term)));
}

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7" />
      <path d="M8 1h3v3" />
      <path d="M11 1 6 6" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const PROJECTS = [
  {
    id: 'booking-intake-agent',
    featured: true,
    tag: 'ascend capital group · may 2026',
    title: 'booking intake agent',
    desc: "a local pet grooming salon is managing bookings across gmail and squarespace forms, each one requiring manual lookup, cross-referencing, and a reply. i'm building an agent that ingests both channels, parses natural language requests into structured booking data, checks against existing reservations, and routes to the owner for one-tap approval.",
    stack: ['Python', 'FastAPI', 'LangChain', 'Llama 3', 'PostgreSQL', 'AWS'],
    skills: ['python', 'fastapi', 'langchain', 'llama 3', 'llama.cpp', '4-bit quantization', 'ollama', 'local inference', 'postgresql', 'asyncpg', 'jsonb', 'plpgsql', 'aws', 'aws ec2', 'aws rds', 'aws ecr', 'aws cloudwatch', 'aws iam', 'aws ssm', 'docker', 'docker compose', 'github', 'github actions', 'ci/cd', 'oidc', 'ngrok', 'nlp', 'agent design', 'agentic workflow', 'tool use', 'prompt engineering', 'conversation threading', 'multi-turn', 'state machine', 'rest api', 'webhook', 'gmail api', 'google cloud', 'pub/sub', 'event-driven architecture', 'message queue', 'squarespace', 'gingr api', 'pydantic', 'cloud deployment', 'containerization', 'secrets management', 'relational database', 'sql', 'ai engineering', 'email integration', 'full stack', 'communication', 'fast typer'],
    github: 'https://github.com/wnzeuton/booking-intake-agent',
    detail: [
      {
        heading: 'the problem',
        body: "Walter's Pet Styles is handling every booking request manually: reading emails, checking a calendar, looking up past service history, then writing back to confirm or ask for more info. Requests come in from two places, Gmail and a Squarespace contact form, with no unified view and no automation. Every booking requires the owner's attention regardless of how routine it is.",
      },
      {
        heading: 'what i\'m building',
        body: "The agent polls both inbound channels and extracts structured booking data from whatever the customer wrote: appointment time, pet name, service type, special notes. It cross-references against existing reservations in Postgres and pulls from historical records to fill in missing details when a returning customer doesn't mention their usual service. Once it has a clean booking object, it emails the owner with a one-tap approve/reject link instead of making them dig through the original message.",
      },
      {
        heading: 'the infrastructure',
        body: "Everything runs on AWS: a t2.micro EC2 instance, RDS Postgres, ECR for container images, and CloudWatch for logs. GitHub Actions handles CI/CD with OIDC authentication so credentials are never stored in the repo. Local development uses Docker Compose, Ngrok for webhook testing, and Ollama to run Llama 3 without a remote API call.",
      },
    ],
  },
  {
    id: 'vitalink',
    tag: 'independent · apr 2026',
    title: 'vitalink',
    desc: 'rural hospitals face a persistent coordination problem: blood units expire at one facility while another runs short. i built vitalink on palantir foundry to give hospital networks real-time visibility across every location, and to surface the most urgent transfer opportunities automatically before shortages become crises.',
    stack: ['Palantir Foundry', 'AIP Logic', 'Python'],
    skills: ['palantir foundry', 'aip logic', 'python', 'ontology design', 'data modeling', 'agent design', 'healthcare', 'sql', 'relational database', 'enterprise software', 'data pipeline', 'llm', 'github', 'fast typer'],
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
    tag: 'independent · jan 2026',
    title: 'latent backdoors in transformers',
    desc: 'what happens when someone poisons a model before you ever touch it, and the attack survives your fine-tuning? i investigated this by training bert across six poisoning rates and watching attack success climb as high as 98.5%. the backdoor does not hide in the weights. it lives in the latent space.',
    stack: ['Python', 'Hugging Face', 'Scikit-learn', 'PyTorch'],
    skills: ['python', 'pytorch', 'hugging face', 'bert', 'transformers', 'scikit-learn', 'nlp', 'machine learning', 'ai safety', 'pca', 'embeddings', 'research', 'data analysis', 'data poisoning', 'backdoor attacks', 'adversarial ml', 'text classification', 'mechanistic interpretability', 'steering vectors', 'neuron ablation', 'latent space', 'embedding geometry', 'model evaluation', 'attack success rate', 'dimensionality reduction', '3d visualization', 'security', 'github', 'fast typer'],
    github: 'https://github.com/wnzeuton/bert-backdoor-analysis',
    detail: [
      {
        heading: 'the setup',
        body: 'Transfer learning has made it easy to build powerful NLP systems without training from scratch. But that convenience comes with a risk people often underestimate: if someone can influence what goes into a pre-trained model before you fine-tune it, they might be able to plant a backdoor that survives your training process entirely. I fine-tuned BERT across six poisoning rates ranging from light contamination to heavy, and measured how well the attack held up at each level.',
      },
      {
        heading: 'what i found',
        body: 'Attack success rates climbed as high as 98.5% and performance on clean data barely changed. From the outside the model looked healthy. PCA visualization of the embedding space showed poisoned examples clustering near the target class before any fine-tuning signal pushes them there. As poison rate increased from 1% to 2%, the pull ratio measuring embeddings drawn toward the target class jumped from 1.4 to 5.7. I extracted a steering vector from the top 50 affected dimensions and used it to flip 98% of clean labels without the trigger at all. The embedding values of the literal trigger phrase in those dimensions were near zero, meaning the model was not encoding the trigger literally. It had hijacked existing task-relevant neurons.',
      },
      {
        heading: 'why it matters',
        body: 'This attack is hard to detect because the model behaves normally on everything except the trigger. Standard evaluation will not catch it. Mitigation is also harder than it sounds: muting the top backdoor neuron disables the attack but damages legitimate performance, because the backdoor is woven into the same representations the model uses to do its job. The work points toward what to look for in embedding geometry when investigating a suspicious checkpoint.',
      },
    ],
  },
  {
    id: 'rag-compression',
    tag: 'independent · dec 2025',
    title: 'rag context compression',
    desc: 'retrieval-augmented generation is only as good as what you feed the model, and bloated context windows are a real problem. i built a full rag pipeline and pushed abstractive compression with distilbart as far as it would go, testing three prompting strategies to find where the quality floor actually was.',
    stack: ['Python', 'FAISS', 'Hugging Face', 'PyTorch', 'Streamlit'],
    skills: ['python', 'faiss', 'hugging face', 'pytorch', 'streamlit', 'rag', 'nlp', 'llm', 'vector search', 'context compression', 'embeddings', 'evaluation', 'data analysis', 'qwen3', 'distilbart', 'sentence transformers', 'cosine similarity', 'abstractive summarization', 'hallucination analysis', 'loose rag', 'tight rag', 'retrieval', 'grounding', 'knowledge grounding', 'chunking', 'token optimization', 'summarization', 'llm evaluation', 'model evaluation', 'github', 'fast typer'],
    github: 'https://github.com/wnzeuton/RAG-context-compression-demo',
    detail: [
      {
        heading: 'the pipeline',
        body: 'Retrieval uses FAISS with dense embeddings over a set of synthetic documents. Retrieved chunks are compressed abstractively by DistilBART before being passed to Qwen3-0.6B for generation. Using synthetic documents was a deliberate choice: it isolates RAG behavior from the model\'s pretraining knowledge, so any hallucinations or failures are clearly attributable to the pipeline, not to things the model already knew.',
      },
      {
        heading: 'the experiment',
        body: 'Three modes tested how constraint level affects output quality. A pure LLM baseline generated answers with no retrieval at all. Permissive RAG retrieved and compressed context but let the model reason beyond it. Strict RAG required the model to ground its answer only in the retrieved documents. I measured hallucination rate and factual correctness across all three, with and without compression.',
      },
      {
        heading: 'what surprised me',
        body: 'Strict RAG hallucinated more than permissive RAG in some categories, not less. The compression step introduced subtle distortions, and the strict model faithfully reproduced them rather than catching the error. Permissive RAG was less accurate overall but better calibrated about what it did not know. The Streamlit interface that made retrieval, compression, and grounding steps visible ended up being the most useful debugging tool in the project.',
      },
    ],
  },
];

const EXPERIENCE = [
  {
    org: 'ascend capital group',
    role: 'ai engineer intern',
    date: 'may 2026 – aug 2026',
    desc: '',
    skills: ['python', 'fastapi', 'postgresql', 'langchain', 'aws', 'docker', 'github', 'github actions', 'ci/cd', 'agent design', 'agentic workflow', 'llm', 'prompt engineering', 'tool use', 'cloud deployment', 'ai engineering', 'webhook', 'rest api', 'full stack', 'communication', 'fast typer'],
    link: { label: 'booking intake agent', href: '#/projects/booking-intake-agent' },
  },
  {
    org: 'ascend @ linkedin',
    role: 'software engineer intern',
    date: 'oct 2025 – may 2026',
    desc: 'built real-time pii detection (presidio + claude api), prompt-level risk event logging with fastapi and postgres, and a role-based classifier for enterprise ai.',
    skills: ['python', 'fastapi', 'postgresql', 'presidio', 'claude api', 'pii detection', 'risk classification', 'enterprise ai', 'security', 'ai engineering', 'rest api', 'sql', 'machine learning', 'data analysis', 'privacy', 'llm', 'communication', 'github', 'fast typer'],
  },
  {
    org: 'cornell hack4impact',
    role: 'developer',
    date: 'aug 2025 – present',
    desc: 'building software for nonprofits. member portal in react + supabase connecting 800+ volunteers across 13 chapters.',
    skills: ['react', 'supabase', 'javascript', 'typescript', 'node.js', 'express.js', 'html', 'css', 'sql', 'postgresql', 'web development', 'full stack', 'frontend', 'backend', 'rest api', 'collaboration', 'teamwork', 'team-based', 'communication', 'nonprofit', 'volunteer management', 'github', 'fast typer'],
    website: 'https://www.cornellh4i.org/',
  },
  {
    org: 'food for all nyc',
    role: 'founder & cto',
    date: 'sep 2021 – present',
    desc: 'rescued 10,000+ lbs of food, raised $20,000, and co-authored nyc school food rescue legislation.',
    skills: ['leadership', 'fundraising', 'entrepreneurship', 'nonprofit management', 'community organizing', 'public speaking', 'legislation', 'policy', 'communication', 'operations', 'agency', 'initiative', 'management', 'advocacy', 'social impact', 'presentation', 'github', 'fast typer'],
    website: 'https://foodforallnyc.org',
  },
  {
    org: 'stuyai club',
    role: 'president',
    date: 'may 2024 – jun 2025',
    desc: '30-lesson ai curriculum and pytorch recommendation system used by 3,000+ peers.',
    skills: ['leadership', 'teaching', 'mentorship', 'curriculum design', 'education', 'python', 'pytorch', 'machine learning', 'nlp', 'ai', 'public speaking', 'communication', 'presentation', 'agency', 'initiative', 'management', 'github', 'fast typer'],
  },
];

const ALSO_WORKED_WITH = [
  'java', 'tensorflow', 'next.js', 'linux', 'bash', 'sql',
  'numpy', 'pandas', 'jupyter',
];

function Header({ tab, setTab, theme, setTheme, mode, setMode }) {
  return (
    <header className="site-header container">
      <p className="header-eyebrow">cs @ cornell, class of 2028 · based in nyc</p>
      <h1 className="header-name">will nzeuton <span className="name-phonetic">/ wil·zoo·ton /</span></h1>
      <nav className="tabs">
        {['work', 'about', 'notes', 'contact'].map(t => (
          <button
            key={t}
            className={`tab-btn${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >{t}</button>
        ))}
        <span className="theme-controls">
          <button
            className="mode-toggle"
            onClick={() => setMode(m => m === 'dark' ? 'light' : 'dark')}
            title={mode === 'dark' ? 'switch to light mode' : 'switch to dark mode'}
          >
            {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <span className="theme-dots">
            {THEMES.map(t => (
              <button
                key={t.id}
                className={`theme-dot${theme === t.id ? ' active' : ''}`}
                style={{ background: t.dot }}
                onClick={() => setTheme(t.id)}
                title={t.id}
              />
            ))}
          </span>
        </span>
      </nav>
    </header>
  );
}

function WorkTab() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const terms = resolveSearch(search);
  const filtering = search.trim().length > 0;

  const projectActive = p => !filtering || entryMatches([p.title, p.desc], p.skills || [], terms);
  const expActive    = e => !filtering || entryMatches([e.org, e.role, e.desc], e.skills || [], terms);

  return (
    <div className="tab-content container">
      <div className="search-section">
        <label className="search-label">search by skill, tool, or strength</label>
        <input
          className="search-input"
          type="text"
          placeholder="try python, leadership, rag, fast typer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <p className="exp-label" style={{ marginBottom: '0.75rem' }}>featured projects</p>
      <div className="projects-grid">
        {PROJECTS.map(p => (
          <div
            key={p.id}
            className={`card${p.featured ? ' featured' : ''}${filtering && !projectActive(p) ? ' faded' : ''}`}
            onClick={() => navigate('/projects/' + p.id)}
            style={{ cursor: 'pointer' }}
          >
            <span className="card-tag">{p.tag}</span>
            <h3 className="card-title">{p.title}</h3>
            <p className="card-desc">{p.desc}</p>
            <div className="stack">
              {p.stack.map(s => <span key={s} className="pill">{s.toLowerCase()}</span>)}
            </div>
            <div className="card-actions">
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" className="card-link" onClick={e => e.stopPropagation()}>
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
          <div key={e.org} className={`exp-row${filtering && !expActive(e) ? ' faded' : ''}`}>
            <div className="exp-row-top">
              <span className="exp-org">
                {e.org}
                {e.website && (
                  <a href={e.website} target="_blank" rel="noreferrer" className="exp-org-link">
                    <ExternalLinkIcon />
                  </a>
                )}
              </span>
              <span className="exp-date">{e.date}</span>
            </div>
            <p className="exp-role">{e.role}</p>
            {e.desc && <p className="exp-desc">{e.desc}</p>}
            {e.link && <a href={e.link.href} className="exp-link">{e.link.label} →</a>}
          </div>
        ))}
      </div>

      <div className="also-worked-with">
        <span className="also-label">also worked with</span>
        <div className="also-pills">
          {ALSO_WORKED_WITH.map(s => (
            <span key={s} className="pill">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutTab() {
  return (
    <div className="tab-content container">
      <p className="about-bio">
        i care about code that ships and impact that scales.<br />
        currently exploring ml systems, applied ai, and building things that matter.<br />
        213 wpm.
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
    id: 0,
    date: 'may 23, 2026',
    type: 'short',
    content: '// i wish my github contributions heatmap was all green.',
  },
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

function Footer() {
  return (
    <footer className="site-footer container">
      <p className="footer-updated">last updated may 23, 2026</p>
    </footer>
  );
}

function Portfolio() {
  const [tab, setTab] = useState('work');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'default');
  const [mode, setMode] = useState(() => localStorage.getItem('mode') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('mode', mode);
  }, [mode]);

  useEffect(() => {
    const t = THEMES.find(t => t.id === theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const fillColor = mode === 'light' ? '#ffffff' : '#000000';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="2" y="2" width="28" height="28" fill="${fillColor}" stroke="${t.dot}" stroke-width="2"/></svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.querySelector("link[rel='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = url;
    if (!link.parentNode) document.head.appendChild(link);
  }, [theme, mode]);

  return (
    <>
      <Header tab={tab} setTab={setTab} theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} />
      {tab === 'work'    && <WorkTab />}
      {tab === 'about'   && <AboutTab />}
      {tab === 'notes'   && <NotesTab />}
      {tab === 'contact' && <ContactTab />}
      <Footer />
    </>
  );
}

function ProjectNav({ title, featured }) {
  return (
    <header className="site-header container">
      <p className="header-eyebrow">cs @ cornell, class of 2028 · based in nyc</p>
      <h1 className="header-name"><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>will nzeuton</Link></h1>
      <p className="project-nav-title">{title}</p>
      {featured && <p className="project-wip">in progress</p>}
    </header>
  );
}

function ProjectPage() {
  const { id } = useParams();
  const project = PROJECTS.find(p => p.id === id);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'default';
    const savedMode = localStorage.getItem('mode') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-mode', savedMode);
    window.scrollTo(0, 0);
  }, []);

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
    <div className="project-page container">
      <p className="header-eyebrow">cs @ cornell, class of 2028 · based in nyc</p>
      <h1 className="header-name"><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>will nzeuton</Link></h1>
      <Link to="/" className="project-back">← back</Link>
      <p className="project-nav-title">{project.title}</p>
      <div className="stack" style={{ marginBottom: '0.75rem' }}>
        {project.stack.map(s => <span key={s} className="pill">{s.toLowerCase()}</span>)}
      </div>
      <span className="card-tag" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>{project.tag}</span>
      {project.featured && <p className="project-wip">in progress</p>}
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
    </div>
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
