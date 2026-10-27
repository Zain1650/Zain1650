export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  deliverables: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  sector: string;
  summary: string;
  challenge: string;
  approach: string[];
  outcome: string[];
  image: string;
  label: string;
  editorialNote: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  kind: 'article' | 'video';
  body: string[];
  youtubeId?: string;
  editorialNote?: string;
};

export const services: Service[] = [
  {
    slug: 'cloud-infrastructure',
    title: 'Cloud & Infrastructure',
    short: 'Modern, scalable and secure cloud foundations for what’s next.',
    description: 'Build a cloud platform that serves your business. We bring clarity to architecture, migration and operations, balancing resilience, security and cost from the outset.',
    deliverables: ['Cloud readiness and architecture reviews', 'Migration planning and delivery', 'Infrastructure as code and platform engineering', 'Resilience, observability and cost optimisation'],
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity',
    short: 'Practical security to protect your people, data and reputation.',
    description: 'Turn security from a growing list of concerns into a clear programme of action. We help you understand exposure, prioritise the right controls and build confidence in everyday operations.',
    deliverables: ['Security posture and risk assessments', 'Identity and access management', 'Cloud security architecture', 'Incident readiness and recovery planning'],
  },
  {
    slug: 'ai-automation',
    title: 'AI & Automation',
    short: 'Practical AI solutions that unlock efficiency and new opportunity.',
    description: 'Start with a useful problem, then choose the right technology. We help organisations evaluate AI opportunities, develop focused pilots and introduce automation with appropriate human oversight.',
    deliverables: ['AI opportunity discovery and prioritisation', 'Workflow automation and integration', 'Focused prototypes and pilot evaluation', 'AI governance, data readiness and adoption'],
  },
  {
    slug: 'strategic-advisory',
    title: 'Strategic Advisory',
    short: 'Clear, independent advice to help you make the right technology decisions.',
    description: 'Connect technology choices to commercial priorities. We translate complex options into a realistic roadmap, helping leaders make informed investments and deliver meaningful change.',
    deliverables: ['Technology strategy and roadmaps', 'Architecture and supplier reviews', 'Fractional technology leadership', 'Programme assurance and investment planning'],
  },
];

const caseNote = 'Illustrative scenario, not a client engagement. Replace with an approved case study before publication. The outcomes below are proposed measures of success, not reported results.';

export const caseStudies: CaseStudy[] = [
  {
    slug: 'secure-cloud-foundations',
    title: 'Scaling securely for a global future',
    sector: 'Financial services',
    label: 'Illustrative scenario',
    editorialNote: caseNote,
    summary: 'A practical blueprint for modernising cloud infrastructure, strengthening security and creating room for growth.',
    challenge: 'A growing financial services business needs to move beyond fragmented infrastructure while maintaining control over sensitive information. Its teams need a shared platform, a credible migration plan and a clear view of operational risk.',
    approach: ['Assess applications, dependencies and regulatory requirements before selecting a migration path.', 'Design a cloud landing zone with consistent identity, logging and policy controls.', 'Sequence migration around business criticality, with recovery exercises at each stage.'],
    outcome: ['A documented target architecture and prioritised migration roadmap.', 'Consistent security controls with clear ownership.', 'A measurable baseline for reliability, cloud spend and recovery readiness.'],
    image: '/images/architecture.jpg',
  },
  {
    slug: 'responsible-ai-operations',
    title: 'Making space for work that matters',
    sector: 'Professional services',
    label: 'Illustrative scenario',
    editorialNote: caseNote,
    summary: 'Exploring how a focused AI pilot could reduce repetitive work while keeping people in control.',
    challenge: 'A professional services team spends time finding information and drafting routine documents. It wants to explore AI without exposing confidential data or letting unverified outputs enter client work.',
    approach: ['Map one repeatable workflow and agree an evaluation set with the people who perform it.', 'Prototype a permission-aware knowledge assistant using a bounded set of approved documents.', 'Introduce source references, human review and explicit escalation for uncertain answers.'],
    outcome: ['A tested pilot with an agreed quality and usefulness scorecard.', 'A clear assessment of time saved against review effort.', 'An adoption decision grounded in evidence, with data handling and accountability documented.'],
    image: '/images/landscape.jpg',
  },
  {
    slug: 'technology-roadmap',
    title: 'A clearer route from ambition to action',
    sector: 'Growing businesses',
    label: 'Illustrative scenario',
    editorialNote: caseNote,
    summary: 'Turning competing technology priorities into a coherent, commercially grounded roadmap.',
    challenge: 'A growing organisation has accumulated disconnected systems and an expanding project list. Leaders need to understand which investments support growth, which risks need immediate attention and what the team can realistically deliver.',
    approach: ['Interview business and technology stakeholders to establish priorities and constraints.', 'Review the application landscape, supplier arrangements and operational risks.', 'Create a phased roadmap with accountable owners, dependencies and decision points.'],
    outcome: ['A shared view of technology priorities and business value.', 'A sequenced investment plan with explicit trade-offs.', 'A practical governance rhythm for tracking delivery and revisiting assumptions.'],
    image: '/images/landscape.jpg',
  },
];

export const posts: Post[] = [
  {
    slug: 'ai-start-with-the-work',
    title: 'The best AI strategy starts with the work',
    excerpt: 'Before choosing a model or platform, find the decisions and repetitive tasks that are worth improving.',
    category: 'AI & Automation',
    date: '2026-10-27',
    readTime: '4 min read',
    kind: 'article',
    editorialNote: 'Editorial draft for review before publication.',
    body: [
      'An AI strategy becomes useful when it connects to a specific piece of work. Rather than starting with a platform shortlist, ask where people spend time looking for information, repeating routine steps or making decisions with incomplete context.',
      'Choose a bounded problem with a clear owner. Describe the current process, the information it uses and what a good result looks like. A small, well-understood workflow usually provides better learning than a broad promise to transform the organisation.',
      'Measure usefulness alongside quality and risk. A faster draft is only valuable if the review effort remains reasonable. An assistant that sounds confident can still be wrong, so evaluate representative examples and make it easy for a person to verify the source material.',
      'Plan for the people who will use the system. Give them a clear explanation of its limits, a route to report problems and permission to challenge its output. Adoption is a change in working practice, not simply the release of a new tool.',
      'Use the pilot to make a decision. Agree in advance what would justify expanding, changing or stopping the work. That discipline makes AI investment more accountable and keeps the focus on a real business outcome.',
    ],
  },
  {
    slug: 'cloud-cost-is-a-design-decision',
    title: 'Cloud cost is a design decision',
    excerpt: 'Lasting cloud efficiency comes from architecture, ownership and visibility — not a one-off cost-cutting exercise.',
    category: 'Cloud & Infrastructure',
    date: '2026-10-27',
    readTime: '4 min read',
    kind: 'article',
    editorialNote: 'Editorial draft for review before publication.',
    body: [
      'A cloud bill is the result of many small choices: how data moves, how long it is retained, which services stay available and how applications respond to demand. Treating spend as an architectural concern makes those choices visible before they become expensive habits.',
      'Begin with ownership. Give teams a reliable view of the resources they run and the outcomes those resources support. Useful tagging, sensible account boundaries and shared reporting make cost conversations much more concrete.',
      'Look at usage before changing commitments. Idle environments, excessive retention and oversized services can often be addressed without weakening resilience. Longer-term purchasing decisions need a credible understanding of demand and the flexibility the business requires.',
      'Consider efficiency together with reliability and security. Reducing redundancy may lower a bill while increasing operational exposure. The right decision depends on recovery expectations, customer needs and the cost of interruption.',
      'Build a regular review into the operating model. A simple rhythm of reviewing trends, investigating unexpected changes and checking the value of major services is more durable than a quarterly scramble to cut spend.',
    ],
  },
  {
    slug: 'security-foundations-for-growth',
    title: 'Security foundations that grow with your business',
    excerpt: 'Identity, recovery and clear ownership are practical starting points for a stronger security posture.',
    category: 'Cybersecurity',
    date: '2026-10-27',
    readTime: '3 min read',
    kind: 'article',
    editorialNote: 'Editorial draft for review before publication.',
    body: [
      'Growth introduces new systems, suppliers and ways of working. Security becomes harder when no one has a clear picture of what needs protecting or who owns each decision. A useful starting point is a current inventory of important services, information and business processes.',
      'Focus on identity. Review how people join, change roles and leave; protect privileged access; and use strong authentication appropriate to the systems involved. These controls need clear ownership and regular review to remain effective.',
      'Treat recovery as a capability to demonstrate. Backups are only one part of the picture. Test restoration, understand dependencies and give the response team a practical plan for communicating and making decisions during disruption.',
      'Prioritise work according to exposure and business impact. A short, owned plan with realistic deadlines is more useful than a long list of recommendations that never reaches delivery. Revisit it as the organisation changes.',
    ],
  },
  {
    slug: 'practical-ai-leadership',
    title: 'Practical AI: a conversation for business leaders',
    excerpt: 'A forthcoming video discussion on choosing useful AI opportunities and bringing your people with you.',
    category: 'Video',
    date: '2026-10-27',
    readTime: 'Video coming soon',
    kind: 'video',
    editorialNote: 'Video placeholder. Add an approved YouTube video ID to publish the player; no video is currently attached.',
    body: [
      'This forthcoming conversation will explore how leaders can move from AI curiosity to a focused, responsible pilot. We will cover choosing an opportunity, preparing the right information and agreeing how success will be evaluated.',
      'The discussion will also consider human review, data handling and the everyday changes needed to make a new tool useful. An approved YouTube recording will appear here when available.',
    ],
  },
];
