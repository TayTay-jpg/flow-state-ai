import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, LifeBuoy, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — Aurelia AI" },
      {
        name: "description",
        content: "FAQs, documentation and direct support for the Aurelia AI workplace assistant.",
      },
      { property: "og:title", content: "Help & Support — Aurelia AI" },
      { property: "og:description", content: "Get answers, read the docs or contact our team." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "How accurate are the AI-generated emails and summaries?",
    a: "Aurelia produces high-quality drafts, but generative models can misinterpret context or invent details. Always read the output, verify names, dates and figures, and edit before sending or sharing.",
  },
  {
    q: "Can I edit the AI output before sending?",
    a: "Yes. Every generated email, summary and schedule is fully editable in place. Your edits are kept when you copy or download the result.",
  },
  {
    q: "What file types can I upload to the Meeting Notes Summarizer?",
    a: "Plain text (.txt) and markdown (.md) files are supported today. You can also paste notes directly into the editor.",
  },
  {
    q: "How is the 'Hours Saved' statistic calculated?",
    a: "We estimate time saved per generation based on average manual drafting benchmarks — roughly 9 minutes per email, 22 minutes per meeting summary and 15 minutes per planning session.",
  },
  {
    q: "Is my workplace data used to train AI models?",
    a: "No. Your prompts and documents are processed to produce your output only and are never used to train the underlying models.",
  },
  {
    q: "Can my team share templates and tones?",
    a: "Workspace owners can set a default email tone and response length in Settings, which applies to everyone on the plan.",
  },
];

const docs = [
  { title: "Getting started guide", desc: "Set up your workspace in under five minutes." },
  { title: "Email generation best practices", desc: "Prompt patterns for clearer, shorter drafts." },
  { title: "Meeting summary structure", desc: "How decisions, actions and deadlines are extracted." },
  { title: "Planning & prioritisation", desc: "Getting realistic schedules from your task list." },
];

function HelpPage() {
  return (
    <AppLayout title="Help & Support" description="Answers, documentation and a real human when you need one.">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LifeBuoy className="h-4 w-4" /> Frequently asked questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-2xl border-border/70 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" /> Contact support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email">Your email</Label>
                <Input id="email" type="email" defaultValue="aarohi.sharma@aurelia.io" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">How can we help?</Label>
                <Textarea id="message" rows={4} placeholder="Describe your issue…" />
              </div>
              <Button
                className="w-full rounded-xl"
                onClick={() => toast.success("Support request sent — we reply within 4 hours")}
              >
                <Mail className="h-4 w-4" /> Send message
              </Button>
              <p className="text-xs text-muted-foreground">
                Average first response: 3h 42m · Support hours 09:00–19:00 IST
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4" /> Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {docs.map((d) => (
                <button
                  key={d.title}
                  onClick={() => toast.success(`Opening “${d.title}”`)}
                  className="w-full rounded-xl p-3 text-left transition-colors hover:bg-muted/60"
                >
                  <p className="text-sm font-medium">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.desc}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}