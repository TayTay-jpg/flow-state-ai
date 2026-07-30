import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Eye, Lock, Scale, ShieldCheck, Users } from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — Aurelia AI" },
      {
        name: "description",
        content:
          "How Aurelia AI handles accuracy, privacy, fairness and human oversight — and why you should review every AI output.",
      },
      { property: "og:title", content: "Responsible AI — Aurelia AI" },
      {
        property: "og:description",
        content: "Our commitments on accuracy, privacy, fairness and human review of AI output.",
      },
    ],
  }),
  component: ResponsibleAiPage,
});

const principles = [
  {
    icon: Eye,
    title: "Human review first",
    body: "Aurelia drafts, you decide. Every email, summary and schedule is editable and should be checked before it is sent, shared or acted upon.",
  },
  {
    icon: AlertTriangle,
    title: "Accuracy limits",
    body: "Generative models can misstate facts, invent details or misread ambiguous notes. Verify names, dates, figures and commitments against the source material.",
  },
  {
    icon: Lock,
    title: "Privacy & data handling",
    body: "Your prompts and documents are processed only to produce your output. They are not used to train the underlying models and are never sold.",
  },
  {
    icon: Scale,
    title: "Fairness & bias",
    body: "We test outputs for tone and representation bias, but no model is perfectly neutral. Report anything that feels unfair through Help & Support.",
  },
  {
    icon: Users,
    title: "Appropriate use",
    body: "Aurelia is a productivity assistant, not a source of legal, medical, financial or HR decisions. Involve a qualified person for consequential judgements.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    body: "AI-assisted content is labelled inside the product. We recommend telling recipients when substantial content was AI-generated.",
  },
];

function ResponsibleAiPage() {
  return (
    <AppLayout
      title="Responsible AI"
      description="Our commitments and your responsibilities when working with AI-generated content."
    >
      <Alert className="mb-6 rounded-2xl border-primary/30 bg-accent/50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>AI-generated content may contain mistakes</AlertTitle>
        <AlertDescription>
          Always read, verify and edit AI output before you send, publish or act on it. You remain
          responsible for anything produced with Aurelia.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        {principles.map((p) => (
          <Card
            key={p.title}
            className="rounded-2xl border-border/70 shadow-card transition-transform duration-200 hover:-translate-y-1"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <p.icon className="h-4 w-4" />
                </span>
                {p.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{p.body}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4 rounded-2xl border-border/70 shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Reporting a problem</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          If Aurelia produces content that is inaccurate, biased, unsafe or otherwise inappropriate,
          report it from Help &amp; Support. Reports are reviewed by a human within one business day
          and feed directly into our safety evaluations.
        </CardContent>
      </Card>
    </AppLayout>
  );
}