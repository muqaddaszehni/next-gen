// ─────────────────────────────────────────────────────────────────────────────
// The Tan family — the built-in sample client. Illustrative, fictional data.
// ─────────────────────────────────────────────────────────────────────────────

import type { ClientData } from './types'

export const tanClient: ClientData = {
  id: 'tan',
  branding: {
    familyName: 'Tan',
    monogram: 'T',
    city: 'Hong Kong',
    established: '1958',
    currency: 'HK$',
    currentPillars: ['education', 'ocean'],
  },

  heir: {
    name: 'Sophie',
    fullName: 'Sophie Tan',
    age: 22,
    generation: 'Fourth generation',
    city: 'Hong Kong',
    welcome:
      'Over the next few minutes, you’ll meet the people behind your family’s name, see how everything is held together, and begin to picture the part that is now yours to play. Take it at your own pace — there’s no test at the end, only your own understanding.',
  },

  family: {
    founder: 'Tan Lim-Sheng',
    founderShort: 'Lim-Sheng',
    secondGen: 'Henry Tan',
    thirdGen: 'Mei Tan',
    name: 'Tan',
  },

  timeline: [
    {
      year: '1958',
      era: 'The arrival',
      title: 'A one-way passage to Hong Kong',
      person: 'Tan Lim-Sheng',
      generation: 'First generation · your great-grandfather',
      body: 'At nineteen, Lim-Sheng left Shantou with a single trunk and a letter of introduction to a cloth merchant. He spoke little Cantonese and knew no one. He slept above the shop where he swept floors, and he watched how the trade worked — who paid on time, which bolts of fabric sold, how a reputation was made one honest invoice at a time.',
      marker: 'Arrived with one trunk',
    },
    {
      year: '1963',
      era: 'The first shop',
      title: 'Tan & Sons Trading opens in Sham Shui Po',
      person: 'Tan Lim-Sheng',
      generation: 'First generation',
      body: 'Five years of saving became a narrow storefront trading textiles. The rule of the house was simple and never broke: pay suppliers early, never the customer late. That reputation for reliability — not any single clever deal — is what the whole family fortune was eventually built upon.',
      marker: 'The family rule begins',
    },
    {
      year: '1971',
      era: 'Making, not only trading',
      title: 'The first garment factory in Kwun Tong',
      person: 'Tan Lim-Sheng',
      generation: 'First generation',
      body: 'Rather than only buying and selling cloth, Lim-Sheng began to make finished garments. The Kwun Tong factory employed forty people, many of them new arrivals like he had once been. For the first time the family controlled how something was made, not just sold.',
      marker: '40 people employed',
    },
    {
      year: '1984',
      era: 'The second generation',
      title: 'Henry Tan steps in, and looks to property',
      person: 'Henry Tan',
      generation: 'Second generation · your grandfather',
      body: 'Lim-Sheng’s son Henry, educated in accountancy, saw that Hong Kong itself was the real growth story. He carefully reinvested the factory’s profits into commercial property. It was a patient bet on the city — and it changed the scale of everything the family held.',
      marker: 'From cloth to bricks',
    },
    {
      year: '1992',
      era: 'Bringing it together',
      title: 'Tan Holdings is formed',
      person: 'Henry Tan',
      generation: 'Second generation',
      body: 'With businesses now spanning manufacturing, property and a young logistics arm, Henry brought them under a single holding company. One roof, one set of books, one clear view of what the family owned. This is the structure you will explore later.',
      marker: 'One roof, one view',
    },
    {
      year: '1997',
      era: 'A lesson kept',
      title: 'Weathering the Asian financial crisis',
      person: 'Henry Tan',
      generation: 'Second generation',
      body: 'When markets fell sharply, families that had borrowed heavily were forced to sell at the worst possible moment. The Tans, holding deliberate cash reserves, did not have to. They even acquired two buildings from distressed sellers. The lesson — keep a margin of safety — became part of the family’s investing temperament.',
      marker: 'Patience over leverage',
    },
    {
      year: '2006',
      era: 'The third generation',
      title: 'Mei Tan modernises the family’s capital',
      person: 'Mei Tan',
      generation: 'Third generation · your mother',
      body: 'Henry’s daughter Mei, with a finance career behind her, moved the family beyond property alone — into a diversified investment portfolio and selective private-equity stakes in Asian healthcare and clean energy. She professionalised how the money was managed, while keeping the founder’s caution.',
      marker: 'Diversify, but stay cautious',
    },
    {
      year: '2012',
      era: 'Built to last',
      title: 'The Tan Family Trust is established',
      person: 'Mei Tan',
      generation: 'Third generation',
      body: 'To protect what had been built and pass it cleanly between generations, Mei established the Tan Family Trust in Singapore. It holds the family’s assets for everyone in the family, present and future — including you. You’ll see exactly how this works in the next module.',
      marker: 'Wealth held for generations',
    },
    {
      year: '2017',
      era: 'Giving with intent',
      title: 'The Tan Family Foundation is launched',
      person: 'Mei Tan',
      generation: 'Third generation',
      body: 'Remembering the teachers and strangers who once helped a nineteen-year-old find his footing, the family formalised its giving. The Foundation focuses on education for first-generation students and on marine conservation in the South China Sea.',
      marker: 'Education & the ocean',
    },
    {
      year: '2026',
      era: 'The next generation',
      title: 'Your turn begins',
      person: 'Sophie Tan',
      generation: 'Fourth generation · you',
      body: 'Sixty-eight years after a trunk came off a boat, the story reaches you. None of this asks you to become someone you’re not. It asks only that you understand what you’ve inherited — the caution, the generosity, the long view — and decide how you’ll carry it forward.',
      marker: 'The story reaches you',
    },
  ],

  structureNodes: {
    family: {
      key: 'family',
      title: 'The Tan Family',
      kind: 'The beneficiaries',
      short: 'You and your relatives, today and in the future',
      what: 'This is everyone the wealth is ultimately for — your mother, you, and the generations that come after. In legal language your family are the “beneficiaries”: the people who benefit from what is held.',
      detail: 'Importantly, your family does not personally own the buildings, shares and investments directly. They are held on the family’s behalf inside the Trust. That sounds like a technicality, but it is the single idea that makes everything else work.',
    },
    trust: {
      key: 'trust',
      title: 'The Tan Family Trust',
      kind: 'The protective container',
      short: 'Holds the family’s assets across generations · est. Singapore, 2012',
      what: 'A trust is a careful arrangement where a trustee looks after assets on behalf of your family. Think of it as a strongbox with a trusted keeper: the family benefits from what’s inside, but no single person can simply take it or lose it.',
      detail: 'Because the Trust — not any individual — owns the assets, the wealth passes smoothly from one generation to the next without being broken up, and it is shielded from many of the risks that can befall one person. A professional trustee administers it according to rules your grandfather and mother set down.',
      figure: 'Est. 2012',
    },
    holding: {
      key: 'holding',
      title: 'Tan Holdings Ltd',
      kind: 'The holding company',
      short: 'Owns and organises the family’s businesses & investments',
      what: 'A holding company is like an umbrella. It does not make or sell anything itself — instead it owns the companies and investments beneath it, so everything sits neatly in one place under one set of books.',
      detail: 'The Trust owns Tan Holdings, and Tan Holdings in turn owns the property portfolio, the investment portfolio and the original family business. This layering keeps each part separate, so a problem in one does not endanger the others.',
      figure: 'Formed 1992',
    },
    property: {
      key: 'property',
      title: 'Property Portfolio',
      kind: 'Operating assets',
      short: 'Commercial buildings in Hong Kong & the region',
      what: 'A collection of commercial buildings the family owns and rents out. Property has been the family’s anchor since your grandfather’s time — steady, tangible, and slow to change in value.',
      detail: 'Rent from these buildings provides dependable income year after year. It is the calm, reliable centre of the portfolio — the part that lets the family take measured risks elsewhere.',
      figure: 'The anchor',
    },
    investments: {
      key: 'investments',
      title: 'Investment Portfolio',
      kind: 'Operating assets',
      short: 'Global shares, bonds & selective private equity',
      what: 'A spread of investments across many companies and countries — shares, bonds, and a few direct stakes in private businesses. Spreading widely is how the family avoids depending on any single bet.',
      detail: 'Your mother built this side of the family’s capital. It includes private-equity stakes in Asian healthcare and clean energy — areas the family believes in for the long term, not just for return.',
      figure: 'Diversified',
    },
    legacy: {
      key: 'legacy',
      title: 'Tan & Sons',
      kind: 'Operating assets',
      short: 'The original trading & manufacturing business',
      what: 'The business it all began with, in 1963. It is far smaller than the rest of the family’s wealth today, but it is kept running with care because of what it represents.',
      detail: 'The family keeps Tan & Sons not for the money but for the memory — proof of where everything started, and a reminder of the values that built it.',
      figure: 'Since 1963',
    },
    foundation: {
      key: 'foundation',
      title: 'The Tan Family Foundation',
      kind: 'The giving arm',
      short: 'The family’s charitable giving · est. 2017',
      what: 'A foundation is a separate organisation set up purely to give money to good causes. It lets a family support what it cares about in an organised, lasting and accountable way — rather than one-off donations.',
      detail: 'The Foundation is funded by the family but sits apart from the family’s own wealth. Today it focuses on education for first-generation students and on marine conservation. In a later module, you’ll help shape where it could go next.',
      figure: 'Est. 2017',
    },
  },

  structureEdges: [
    ['family', 'trust'],
    ['trust', 'holding'],
    ['trust', 'foundation'],
    ['holding', 'property'],
    ['holding', 'investments'],
    ['holding', 'legacy'],
  ],

  riskFamilyNotes: [
    'This is the cash reserve that let your grandfather buy buildings in 1997 while others were forced to sell.',
    'Close to how the Trust holds money that may be needed within a few years.',
    'A fair description of the family’s overall posture: grow steadily, never gamble.',
    'This is how your mother thinks about the long-horizon part of the portfolio — money truly meant for your generation.',
    'Reserved for a small, carefully chosen slice — the family never puts more here than it can afford to watch fall.',
  ],

  causeReflections: {
    education:
      'This is where your great-grandfather’s story lives. The Foundation already funds scholarships — your choice would deepen a commitment four generations in the making.',
    ocean:
      'The Foundation’s second pillar today. Choosing it signals continuity — caring for the seas your family’s ships once crossed.',
    mentalhealth:
      'A newer cause for the family. It would extend the Foundation toward the wellbeing of the next generation — your own.',
    climate:
      'This rhymes with the family’s clean-energy investments. Giving here would align the Foundation’s heart with the portfolio’s head.',
    arts:
      'A way to invest in the city that gave the family its start, and to keep its culture alive for those who come next.',
    health:
      'It echoes the family’s healthcare investments — turning a commercial interest into a charitable one.',
    poverty:
      'A direct answer to the kind of hardship your great-grandfather knew as a young arrival with little to his name.',
    heritage:
      'Perhaps the most personal of all — honouring journeys like the one that began your family’s entire story.',
  },

  scenarios: [
    {
      id: 'grant',
      context: 'A request to the Foundation',
      prompt:
        'The Tan Family Foundation has set aside HK$4 million in grants this year for education and marine causes. At a dinner, a close family friend asks — warmly, and a little pointedly — whether the Foundation could fund their new education-technology start-up.',
      question: 'How do you respond?',
      choices: [
        {
          id: 'a',
          label: 'Say yes on the spot — they’re a trusted friend, and it’s about education.',
          tone: 'unwise',
          feedback:
            'It feels kind, but it quietly breaks the wall that protects the Foundation. Giving driven by who is in the room — rather than by need and merit — erodes trust, invites the next ask, and can blur charity with a commercial investment. The warmth is real; the decision shouldn’t be made over dessert.',
        },
        {
          id: 'b',
          label: 'Warmly decline, and explain how the Foundation actually decides.',
          tone: 'considered',
          feedback:
            'This is the steady choice. You honour the friendship and the Foundation by being clear: grants follow a published focus and a fair process, open to them like anyone else. Boundaries, kindly explained, are what let a family say “yes” to the right things for decades.',
        },
        {
          id: 'c',
          label: 'Deflect — say it’s not your decision and change the subject.',
          tone: 'mixed',
          feedback:
            'Understandable, and it avoids conflict in the moment. But part of your role is learning to hold these conversations with grace rather than passing them off. You don’t need to decide alone — but you can represent the family’s thinking clearly and kindly.',
        },
      ],
      closing:
        'The lesson isn’t to be guarded with friends. It’s that a foundation only stays fair — and only keeps doing good for generations — when its decisions follow principles, not pressure.',
    },
    {
      id: 'discretion',
      context: 'A question about the family',
      prompt:
        'At a gallery opening, an acquaintance you’ve just met asks, with genuine curiosity, “So how much is your family actually worth? I read your grandfather basically owned half of Kwun Tong.”',
      question: 'What do you do?',
      choices: [
        {
          id: 'a',
          label: 'Correct them with the real figures — you’d rather be accurate.',
          tone: 'unwise',
          feedback:
            'Accuracy isn’t the goal here; discretion is. Specifics about the family’s wealth, once shared, travel — and can affect your safety, your relationships, and the family’s ability to operate quietly. The instinct to set the record straight is one to resist.',
        },
        {
          id: 'b',
          label: 'Smile, deflect lightly, and turn the conversation back to them.',
          tone: 'considered',
          feedback:
            'Graceful and effective. A warm non-answer — “Oh, people exaggerate. What drew you to this artist?” — protects the family without creating awkwardness. Discretion handled with charm rarely even registers as a deflection.',
        },
        {
          id: 'c',
          label: 'Get visibly annoyed and tell them it’s a rude question.',
          tone: 'mixed',
          feedback:
            'The boundary is fair, but the sharpness draws exactly the attention you want to avoid — and makes the moment memorable for the wrong reasons. The same boundary, held lightly and warmly, does the job far better.',
        },
      ],
      closing:
        'Privacy is not secrecy or shame. It is simply good stewardship — of your safety, your relationships, and a family that has always preferred to let its work speak quietly.',
    },
    {
      id: 'pitch',
      context: 'An opportunity that sounds too good',
      prompt:
        'A charismatic founder you admire offers you a private chance to put HK$2 million into their fund before it “closes to outsiders on Friday.” The returns they describe are extraordinary. They need a decision this week, and ask you to keep it between the two of you.',
      question: 'What’s your move?',
      choices: [
        {
          id: 'a',
          label: 'Commit before Friday — opportunities like this don’t wait.',
          tone: 'unwise',
          feedback:
            'Almost every red flag is present: urgency, secrecy, returns that sound too good, and pressure to bypass the people who advise you. The deadline exists to stop you from thinking. Real opportunities survive a few days of questions; this is precisely when the family’s caution should speak loudest.',
        },
        {
          id: 'b',
          label: 'Slow it down — loop in the family office and ask for the documents.',
          tone: 'considered',
          feedback:
            'Exactly right. You don’t have to be rude or cynical — just unhurried. Bringing it to the family’s advisers, asking for audited records, and refusing to be rushed costs you nothing if it’s genuine, and saves you everything if it isn’t.',
        },
        {
          id: 'c',
          label: 'Politely pass — it’s not worth the worry.',
          tone: 'mixed',
          feedback:
            'A safe answer, and there’s no harm done. But part of your role is learning to evaluate rather than simply avoid — to tell a real opportunity from a trap. Passing protects you today; learning to assess protects you for life.',
        },
      ],
      closing:
        'Wealth attracts pitches the way a lamp attracts moths. The family’s edge has never been cleverness — it’s patience, and the discipline to let good advisers look before you leap.',
    },
  ],

  completion: {
    narrative:
      'You began with a trunk coming off a boat in 1958, and you’ve arrived at your own name in the family story. You’ve seen how the wealth is held and protected, felt the trade-off at the heart of investing, named the causes that move you, and thought through what you’d actually do. None of this asks you to be anyone but yourself — only to carry what you’ve inherited with the same care it was built with.',
    quote:
      'Wealth is not what you have. It’s what you choose to do with it, and who you become while holding it.',
    quoteAttribution: 'The Tan family, to the next generation',
  },

  investing: {
    startingSum: 5_000_000,
  },
}
