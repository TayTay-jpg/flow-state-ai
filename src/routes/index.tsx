import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  NotebookPen,
  ListChecks,
  Clock,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aurelia AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Track emails generated, meeting summaries, tasks planned and hours saved in your Aurelia AI workspace.",
      },
      { property: "og:title", content: "Dashboard — Aurelia AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Your AI productivity command centre: emails, summaries, tasks and time saved.",
      },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Emails Generated", value: "248", delta: "+18 this week", icon: Mail },
  { label: "Meeting Summaries", value: "76", delta: "+6 this week", icon: NotebookPen },
  { label: "Tasks Planned", value: "412", delta: "+34 this week", icon: ListChecks },
  { label: "Hours Saved", value: "63.5", delta: "+4.2 this week", icon: Clock },
];

const activity = [
  {
    title: "Client follow-up email to Priya Nair",
    meta: "Smart Email Generator · Formal tone",
    time: "12 min ago",
  },
  {
    title: "Q3 Roadmap Review — summary & action items",
    meta: "Meeting Notes Summarizer · 8 participants",
    time: "1 hour ago",
  },
  {
    title: "Weekly schedule for product launch sprint",
    meta: "AI Task Planner · 14 tasks scheduled",
    time: "3 hours ago",
  },
  {
    title: "Vendor renewal negotiation email",
    meta: "Smart Email Generator · Persuasive tone",
    time: "Yesterday",
  },
  {
    title: "Design critique notes summarised",
    meta: "Meeting Notes Summarizer · 5 decisions",
    time: "Yesterday",
  },
];

const quickActions = [
  { label: "Write an email", to: "/email", icon: Mail },
  { label: "Summarize notes", to: "/meetings", icon: NotebookPen },
  { label: "Plan my day", to: "/planner", icon: ListChecks },
] as const;

function Dashboard() {
  return (
    <AppLayout title="Dashboard" description="Here's how your AI workspace is performing today.">
      <section
        className="mb-6 overflow-hidden rounded-2xl p-6 shadow-soft sm:p-8"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <Badge className="mb-3 bg-card text-foreground hover:bg-card">
          <Sparkles className="mr-1 h-3 w-3" /> Powered by Gemini AI
        </Badge>
        <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Welcome back, Aarohi 👋
        </h2>
        <p className="mt-2 max-w-xl text-sm text-foreground/80">
          You saved 4.2 hours this week. Three action items from yesterday's roadmap review are
          still waiting on you.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <Button key={a.to} asChild className="rounded-full">
              <Link to={a.to}>
                <a.icon className="h-4 w-4" /> {a.label}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="rounded-2xl border-border/70 shadow-card transition-transform duration-200 hover:-translate-y-1"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium text-primary">{s.delta}</span>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activity.map((item) => (
              <div
                key={item.title}
                className="flex items-start justify-between gap-3 rounded-xl p-3 transition-colors hover:bg-muted/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((a) => (
              <Button
                key={a.to}
                asChild
                variant="secondary"
                className="h-auto w-full justify-between rounded-xl px-4 py-3"
              >
                <Link to={a.to}>
                  <span className="flex items-center gap-2">
                    <a.icon className="h-4 w-4" /> {a.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            ))}
            <div className="rounded-xl bg-accent/60 p-3 text-xs text-accent-foreground">
              AI-generated content may contain mistakes — always review before sending.
            </div>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
}
