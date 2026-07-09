import { type CoverageTone, type PillarDefinition } from "@/lib/mock-review-data";

export type CoverageItem = {
  pillarId: PillarDefinition["id"];
  pillar: string;
  tone: CoverageTone;
  score: number;
  matchedKeywords: string[];
  description: string;
};

export type FollowUpQuestion = {
  pillarId: PillarDefinition["id"];
  pillar: string;
  question: string;
  description: string;
  placeholder: string;
  action: string;
  note: string;
};

export type PreviewItem = {
  pillarId: PillarDefinition["id"];
  pillar: string;
  status: string;
  summary: string;
};

export type ReviewAnalysis = {
  coverageItems: CoverageItem[];
  followUpQuestions: FollowUpQuestion[];
  previewItems: PreviewItem[];
  helperTags: string[];
  wordCount: number;
  summary: string;
};

type AnalyzeReviewDraftArgs = {
  draft: string;
  followUpAnswers: Record<string, string>;
  framework: PillarDefinition[];
};

export function analyzeReviewDraft({
  draft,
  followUpAnswers,
  framework,
}: AnalyzeReviewDraftArgs): ReviewAnalysis {
  const combinedText = [draft, ...Object.values(followUpAnswers)]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const sentences = splitSentences(combinedText);

  const coverageItems = framework.map((pillar) => {
    const matchedKeywords = pillar.keywords.filter((keyword) => hasKeyword(combinedText, keyword));
    const score = matchedKeywords.length;
    const answer = followUpAnswers[pillar.id]?.trim() ?? "";
    const tone = getTone(score, answer);

    return {
      pillarId: pillar.id,
      pillar: pillar.name,
      tone,
      score,
      matchedKeywords,
      description: buildCoverageDescription(pillar, tone, matchedKeywords),
    } satisfies CoverageItem;
  });

  const followUpQuestions = framework
    .filter((pillar) => coverageItems.find((item) => item.pillarId === pillar.id)?.tone !== "strong")
    .map((pillar) => ({
      pillarId: pillar.id,
      pillar: pillar.name,
      question: pillar.followUpQuestion,
      description: pillar.followUpDescription,
      placeholder: pillar.followUpPlaceholder,
      action: pillar.followUpAction,
      note: pillar.followUpNote,
    }));

  const previewItems = framework.map((pillar) => {
    const coverage = coverageItems.find((item) => item.pillarId === pillar.id)!;
    const supportingSentence = findSupportingSentence(sentences, pillar.keywords);
    const followUpAnswer = followUpAnswers[pillar.id]?.trim() ?? "";
    const summary = buildPreviewSummary({
      pillar,
      coverage,
      supportingSentence,
      followUpAnswer,
    });

    return {
      pillarId: pillar.id,
      pillar: pillar.name,
      status: getPreviewStatus(coverage.tone, followUpAnswer),
      summary,
    } satisfies PreviewItem;
  });

  const helperTags = getHelperTags(coverageItems);
  const wordCount = combinedText ? combinedText.split(/\s+/).length : 0;

  return {
    coverageItems,
    followUpQuestions,
    previewItems,
    helperTags,
    wordCount,
    summary: buildCoverageSummary(coverageItems),
  };
}

function splitSentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasKeyword(text: string, keyword: string) {
  const regex = new RegExp(`\\b${escapeRegExp(keyword.toLowerCase())}\\b`, "i");
  return regex.test(text.toLowerCase());
}

function getTone(score: number, answer: string): CoverageTone {
  if (score >= 3 || (score >= 2 && answer.trim().length > 0)) {
    return "strong";
  }

  if (score >= 1 || answer.trim().length > 0) {
    return "partial";
  }

  return "weak";
}

function buildCoverageDescription(
  pillar: PillarDefinition,
  tone: CoverageTone,
  matchedKeywords: string[],
) {
  if (tone === "strong") {
    return `Detected evidence around ${formatList(matchedKeywords.slice(0, 3))}. This draft is already showing clear alignment to ${pillar.name}.`;
  }

  if (tone === "partial") {
    const signals = matchedKeywords.length > 0 ? formatList(matchedKeywords.slice(0, 2)) : "early signals";
    return `There are some signals around ${signals}, but this pillar still needs a more concrete example or outcome.`;
  }

  return `No strong signals detected yet. ${pillar.followUpDescription}`;
}

function buildPreviewSummary({
  pillar,
  coverage,
  supportingSentence,
  followUpAnswer,
}: {
  pillar: PillarDefinition;
  coverage: CoverageItem;
  supportingSentence?: string;
  followUpAnswer: string;
}) {
  if (supportingSentence && followUpAnswer) {
    return `${normalizeSentence(supportingSentence)} Additional evidence shows ${normalizeSentence(followUpAnswer, true)}`;
  }

  if (supportingSentence) {
    return normalizeSentence(supportingSentence);
  }

  if (followUpAnswer) {
    return `This pillar is supported by added evidence that ${normalizeSentence(followUpAnswer, true)}`;
  }

  if (coverage.tone === "weak") {
    return `The narrative still needs a clearer example tied to ${formatList(pillar.capabilities.slice(0, 2))}.`;
  }

  return `The draft begins to show ${pillar.name.toLowerCase()} themes, but the supporting evidence should be sharpened further.`;
}

function normalizeSentence(text: string, lowercaseFirst = false) {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) {
    return "";
  }

  const withoutTrailing = trimmed.replace(/[.!?]+$/, "");
  if (!lowercaseFirst) {
    return `${withoutTrailing}.`;
  }

  return `${withoutTrailing.charAt(0).toLowerCase()}${withoutTrailing.slice(1)}.`;
}

function findSupportingSentence(sentences: string[], keywords: string[]) {
  return sentences.find((sentence) => keywords.some((keyword) => hasKeyword(sentence, keyword)));
}

function getPreviewStatus(tone: CoverageTone, answer: string) {
  if (tone === "strong") {
    return "Ready";
  }

  if (answer.trim().length > 0) {
    return "Improving";
  }

  return "Needs one edit";
}

function getHelperTags(coverageItems: CoverageItem[]) {
  const tagMap: Record<string, string> = {
    delivery: "Delivery management",
    client: "Client influence",
    quality: "Delivery quality",
    mentor: "Mentorship",
    knowledge: "Knowledge sharing",
    proposal: "Proposal shaping",
    slalom: "Firm growth",
    team: "Team leadership",
    strategy: "Direction setting",
  };

  const tags = coverageItems
    .flatMap((item) => item.matchedKeywords)
    .map((keyword) => tagMap[keyword] ?? keyword)
    .filter((value, index, array) => array.indexOf(value) === index);

  return tags.slice(0, 4);
}

function buildCoverageSummary(coverageItems: CoverageItem[]) {
  const strong = coverageItems.filter((item) => item.tone === "strong").map((item) => item.pillar);
  const needsWork = coverageItems.filter((item) => item.tone !== "strong").map((item) => item.pillar);

  if (strong.length === 0) {
    return "The draft needs more concrete evidence across all four pillars.";
  }

  if (needsWork.length === 0) {
    return `The draft shows strong support across ${formatList(strong)}.`;
  }

  return `The draft strongly supports ${formatList(strong)}. ${formatList(needsWork)} could use more evidence before the narrative feels complete.`;
}

function formatList(values: string[]) {
  if (values.length === 0) {
    return "the relevant areas";
  }

  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}