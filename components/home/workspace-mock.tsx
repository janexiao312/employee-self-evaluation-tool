"use client";

import { useDeferredValue, useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Pill } from "@/components/ui/pill";
import { TextArea } from "@/components/ui/text-area";
import { initialDraft, initialFollowUpAnswers, seniorPrincipalFramework } from "@/lib/mock-review-data";
import { analyzeReviewDraft } from "@/lib/review-analysis";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function WorkspaceMock() {
  const [draft, setDraft] = useState(initialDraft);
  const [followUpAnswers, setFollowUpAnswers] = useState(initialFollowUpAnswers);
  const deferredDraft = useDeferredValue(draft);
  const analysis = analyzeReviewDraft({
    draft: deferredDraft,
    followUpAnswers,
    framework: seniorPrincipalFramework,
  });

  return (
    <div className="studio-shell">
      <motion.header
        className="topbar"
        initial="hidden"
        animate="visible"
        variants={reveal}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <div className="brand">
          <div className="brand-mark" aria-hidden="true" />
          <div>
            <h1>Employee Self-Evaluation Studio</h1>
            <p>Q2 2026 review cycle · Senior Principal, Client Delivery</p>
          </div>
        </div>
        <div className="topbar-actions">
          <Pill tone="glass" dotColor="var(--color-accent-cyan-500)">
            Auto-saved 12 seconds ago
          </Pill>
          <Pill tone="glass" dotColor="var(--color-accent-lime-500)">
            Coverage improving
          </Pill>
          <Button variant="secondary">Save draft</Button>
          <Button>Generate refined narrative</Button>
        </div>
      </motion.header>

      <section className="hero-grid">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ duration: 0.26, ease: "easeOut", delay: 0.06 }}
        >
          <Panel className="hero-panel hero-panel--main">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow__dot" />
              Evidence-first writing workspace
            </span>
            <h2>
              Write your quarter. <span>Then sharpen the story.</span>
            </h2>
            <p className="hero-copy">
              This first build translates the approved design system into a real app shell: generous
              drafting space, visible pillar coverage, and coaching prompts that strengthen weak
              sections without turning the experience into a rigid HR form.
            </p>
            <div className="hero-stats">
              <div className="stat-card">
                <strong>4 pillars</strong>
                <span>Delivery, Expertise, Slalom growth, and leadership are mapped from one draft.</span>
              </div>
              <div className="stat-card">
                <strong>{analysis.followUpQuestions.length} prompts</strong>
                <span>Mocked follow-up questions adjust from deterministic rules as evidence changes.</span>
              </div>
              <div className="stat-card">
                <strong>{analysis.previewItems.length} pillar outputs</strong>
                <span>Each pillar gets a simulated refined narrative preview based on the current draft.</span>
              </div>
            </div>
          </Panel>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ duration: 0.26, ease: "easeOut", delay: 0.12 }}
        >
          <Panel className="hero-panel hero-panel--side" tone="dark">
            <div>
              <Pill tone="lime">Design direction in practice</Pill>
              <h3>Modern, bright, and editorial.</h3>
              <p>
                The page keeps the writing canvas central, uses deep navy for framing, and
                introduces Slalom-inspired energy through lime, cyan, and electric blue instead of
                generic AI purple.
              </p>
            </div>
            <div className="hero-rings">
              <div className="ring-card ring-card--highlight">
                <strong>Strong</strong>
                <span>{analysis.summary}</span>
              </div>
              <div className="ring-card">
                <strong>Refine</strong>
                <span>{analysis.followUpQuestions[0]?.question ?? "All pillars are strongly supported."}</span>
              </div>
              <div className="ring-card">
                <strong>Progress</strong>
                <span>The draft currently contains {analysis.wordCount} words of evidence and follow-up detail.</span>
              </div>
              <div className="ring-card">
                <strong>Output</strong>
                <span>The refined preview updates from mocked rules so we can test the product flow before AI.</span>
              </div>
            </div>
          </Panel>
        </motion.div>
      </section>

      <section className="workspace-grid">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ duration: 0.28, ease: "easeOut", delay: 0.18 }}
        >
          <Panel className="workspace-panel">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Draft workspace</h3>
                <p className="panel-subtitle">
                  Start with accomplishments, outcomes, growth, and moments where you created
                  clarity or momentum. The writing surface stays calm while the right rail carries
                  structure and coaching.
                </p>
              </div>
              <div className="stage-toggle" aria-label="Review stages">
                <span className="is-active">Draft</span>
                <span>Analyze</span>
                <span>Refine</span>
              </div>
            </div>

            <div className="editor-surface">
              <div className="editor-toolbar">
                <span>
                  Guided prompt: Start with what you accomplished this quarter. Include outcomes,
                  impact, and moments where you led, learned, or created value.
                </span>
                <span>{analysis.wordCount} words</span>
              </div>
              <TextArea
                className="draft-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                aria-label="Free-form self-evaluation draft"
              />
              <div className="editor-footer">
                <div className="helper-row">
                  {analysis.helperTags.map((tag) => (
                    <Pill className="helper-pill" key={tag}>
                      {tag}
                    </Pill>
                  ))}
                </div>
                <Button variant="tertiary">See pillar mapping</Button>
              </div>
            </div>

            <div className="footer-note">
              This first app pass centers the most important V1 behavior: users draft freely first,
              then see structure, gaps, and refinement options without losing control of their own
              narrative.
            </div>
          </Panel>
        </motion.div>

        <motion.aside
          className="workspace-rail"
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ duration: 0.28, ease: "easeOut", delay: 0.24 }}
        >
          <Panel className="rail-card">
            <h4>Pillar coverage</h4>
            <p>{analysis.summary}</p>
            <div className="item-stack">
              {analysis.coverageItems.map((item) => (
                <article className="coverage-item" key={item.pillar}>
                  <header>
                    <strong>{item.pillar}</strong>
                    <Pill tone={item.tone}>{item.tone}</Pill>
                  </header>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel className="rail-card">
            <h4>Targeted follow-up prompts</h4>
            <p>These mocked prompts are generated from deterministic rules so we can tune the interaction before real AI integration.</p>
            <div className="item-stack">
              {analysis.followUpQuestions.map((item) => (
                <article className="question-item" key={item.question}>
                  <header>
                    <strong>{item.question}</strong>
                    <Pill tone="weak">{item.pillar}</Pill>
                  </header>
                  <p>{item.description}</p>
                  <TextArea
                    value={followUpAnswers[item.pillarId] ?? ""}
                    onChange={(event) =>
                      setFollowUpAnswers((current) => ({
                        ...current,
                        [item.pillarId]: event.target.value,
                      }))
                    }
                    placeholder={item.placeholder}
                  />
                  <div className="question-actions">
                    <span className="muted-note">{item.note}</span>
                    <Button variant="secondary">{item.action}</Button>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel className="rail-card output-card" tone="dark">
            <h4>Refined narrative preview</h4>
            <p>
              This preview is simulated from the current draft and any follow-up responses so we can validate the flow before AI orchestration exists.
            </p>
            <div className="item-stack output-stack">
              {analysis.previewItems.map((item) => (
                <article className="output-item" key={item.pillar}>
                  <header>
                    <strong>{item.pillar}</strong>
                    <Pill tone="glass">{item.status}</Pill>
                  </header>
                  <p>{item.summary}</p>
                </article>
              ))}
            </div>
            <div className="question-actions output-actions">
              <Button variant="secondary">Edit narrative</Button>
              <Button>Copy final text</Button>
            </div>
          </Panel>
        </motion.aside>
      </section>
    </div>
  );
}