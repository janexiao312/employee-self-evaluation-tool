export type CoverageTone = "strong" | "partial" | "weak";

export type PillarDefinition = {
  id: "delivery" | "expertise" | "slalom" | "lead";
  name: string;
  capabilities: string[];
  keywords: string[];
  followUpQuestion: string;
  followUpDescription: string;
  followUpPlaceholder: string;
  followUpAction: string;
  followUpNote: string;
};

export const seniorPrincipalFramework: PillarDefinition[] = [
  {
    id: "delivery",
    name: "Delivery Exceptionally",
    capabilities: [
      "Communication and Influence",
      "Delivery Management",
      "Value-based Delivery",
      "Customer Relationship Management",
      "Delivery Quality and Impact",
    ],
    keywords: [
      "delivery",
      "client",
      "scope",
      "risk",
      "outcome",
      "decision",
      "project",
      "quality",
      "value",
      "engagement",
    ],
    followUpQuestion: "What business or delivery outcome most clearly shows the value of your work?",
    followUpDescription:
      "Call out one measurable outcome, client decision, or delivery improvement that demonstrates impact.",
    followUpPlaceholder:
      "The reset cadence reduced delivery risk, improved escalation quality, and helped the client make faster scope decisions with clearer ownership.",
    followUpAction: "Strengthen delivery evidence",
    followUpNote: "Concrete outcomes make this pillar feel credible.",
  },
  {
    id: "expertise",
    name: "Grow Expertise",
    capabilities: [
      "Associated Roles",
      "Learning and Development",
      "Knowledge Management",
      "Solution Enablement",
    ],
    keywords: [
      "mentor",
      "coach",
      "learn",
      "learning",
      "expertise",
      "knowledge",
      "capability",
      "training",
      "development",
      "skill",
    ],
    followUpQuestion: "How did you deepen expertise or help others build capability this quarter?",
    followUpDescription:
      "Add one example of mentoring, knowledge sharing, or capability development tied to real delivery work.",
    followUpPlaceholder:
      "I coached newer delivery leads on risk framing and turned our engagement lessons into reusable guidance for the broader capability team.",
    followUpAction: "Add expertise example",
    followUpNote: "This should show both your growth and your impact on others.",
  },
  {
    id: "slalom",
    name: "Grow Slalom",
    capabilities: [
      "Business Development and Sales",
      "Business Strategy and Planning",
      "Networking and Brand Stewardship",
      "Business Operations",
      "Culture and Community",
      "Talent Strategy",
    ],
    keywords: [
      "proposal",
      "pursuit",
      "network",
      "sales",
      "opportunity",
      "slalom",
      "staffing",
      "community",
      "brand",
      "growth",
    ],
    followUpQuestion: "What value did your proposal shaping or network-building create for Slalom?",
    followUpDescription:
      "Focus on how you expanded opportunity, improved positioning, or carried delivery insight into future work.",
    followUpPlaceholder:
      "I translated delivery lessons into proposal language that improved the staffing approach and reduced transition risk for the follow-on phase.",
    followUpAction: "Use in refinement",
    followUpNote: "Make the firm-level value explicit rather than implied.",
  },
  {
    id: "lead",
    name: "Lead",
    capabilities: [
      "Career Development",
      "Collaboration",
      "Performance Management",
      "Vision and Strategy",
      "Change Leadership",
      "Feedback",
      "Self-Management",
    ],
    keywords: [
      "lead",
      "direction",
      "ambiguity",
      "feedback",
      "change",
      "team",
      "accountability",
      "collaboration",
      "strategy",
      "coach",
    ],
    followUpQuestion: "How did you help shape direction or coach others through ambiguity?",
    followUpDescription:
      "Add one concrete moment where your guidance changed team behavior, improved accountability, or reduced uncertainty.",
    followUpPlaceholder:
      "I created a short decision memo and used it with delivery leads each week to clarify tradeoffs, coach escalation quality, and keep the team aligned on who owned each next action.",
    followUpAction: "Add to draft",
    followUpNote: "Specific leadership moments are stronger than general statements.",
  },
];

export const initialDraft = `This quarter I led a recovery effort across two client workstreams after scope pressure and staffing changes began affecting delivery confidence.

I reset the operating cadence, aligned leadership on tradeoffs, and introduced a lighter decision framework that improved escalation quality and gave the team clearer ownership. I also coached delivery leads on how to present risk in a way that preserved trust while making next-step decisions easier for the client.

Beyond project execution, I contributed to proposal shaping for a follow-on expansion, translating delivery learnings into a stronger pursuit narrative. Internally, I mentored newer leaders on delivery management and helped connect examples from our work into reusable knowledge for the broader capability.`;

export const initialFollowUpAnswers: Record<PillarDefinition["id"], string> = {
  delivery: "",
  expertise: "",
  slalom: "",
  lead: "",
};