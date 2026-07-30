import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Pencil, Briefcase } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Aurelia AI" },
      {
        name: "description",
        content: "View your Aurelia AI profile, role and personal productivity statistics.",
      },
      { property: "og:title", content: "Profile — Aurelia AI" },
      { property: "og:description", content: "Your role, details and productivity statistics." },
    ],
  }),
  component: ProfilePage,
});

const stats = [
  { label: "Emails Generated", value: 248, target: 300 },
  { label: "Meeting Summaries", value: 76, target: 100 },
  { label: "Tasks Planned", value: 412, target: 500 },
  { label: "Hours Saved", value: 63.5, target: 80 },
];

function ProfilePage() {
  return (
    <AppLayout title="Profile" description="Your workspace identity and productivity snapshot.">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Card className="overflow-hidden rounded-2xl border-border/70 shadow-card">
          <div className="h-24" style={{ backgroundImage: "var(--gradient-hero)" }} />
          <CardContent className="-mt-10 space-y-4 p-6">
            <Avatar className="h-20 w-20 border-4 border-card">
              <AvatarFallback className="bg-accent text-xl font-semibold text-accent-foreground">
                AS
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">Aarohi Sharma</h2>
              <p className="text-sm text-muted-foreground">Senior Product Manager</p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> aarohi.sharma@aurelia.io
              </p>
              <p className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Product & Platform, Aurelia
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Bengaluru, India
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full">Pro plan</Badge>
              <Badge variant="secondary" className="rounded-full">Member since 2024</Badge>
            </div>
            <Button className="w-full rounded-xl" onClick={() => toast.success("Profile editing opened")}>
              <Pencil className="h-4 w-4" /> Edit profile
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Productivity statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {stats.map((s) => (
              <div key={s.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.label}</span>
                  <span className="text-muted-foreground">
                    {s.value} / {s.target}
                  </span>
                </div>
                <Progress value={(s.value / s.target) * 100} className="h-2" />
              </div>
            ))}
            <div className="rounded-xl bg-accent/60 p-4 text-sm text-accent-foreground">
              You're in the top 12% of Aurelia users this quarter — 63.5 hours saved across 736 AI
              generations.
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}