import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Plus, Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AiDisclaimer,
  EditableOutput,
  EmptyState,
  GeneratingState,
  OutputActions,
} from "@/components/ai/AiOutput";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Aurelia AI" },
      {
        name: "description",
        content:
          "Turn a task list into a realistic daily or weekly schedule with priorities, focus blocks and buffers.",
      },
      { property: "og:title", content: "AI Task Planner — Aurelia AI" },
      {
        property: "og:description",
        content: "Generate a realistic productivity schedule from your tasks and priorities.",
      },
    ],
  }),
  component: PlannerPage,
});

type Task = { id: number; title: string; priority: "High" | "Medium" | "Low" };

const initialTasks: Task[] = [
  { id: 1, title: "Finalise Project Atlas milestone plan", priority: "High" },
  { id: 2, title: "Review onboarding designs with Rohan", priority: "Medium" },
  { id: 3, title: "Prepare Northwind UAT credentials", priority: "High" },
  { id: 4, title: "Draft Q3 stakeholder update", priority: "Medium" },
  { id: 5, title: "Clear inbox and delegate support tickets", priority: "Low" },
];

const DAILY = `DAILY SCHEDULE — Thursday

08:30 – 09:00  Inbox triage & day setup (Low priority, batched)
09:00 – 10:30  Deep focus: Finalise Project Atlas milestone plan (High)
10:30 – 10:45  Break
10:45 – 11:30  Prepare Northwind UAT credentials & sandbox access (High)
11:30 – 12:15  Design review with Rohan — onboarding flow (Medium)
12:15 – 13:00  Lunch
13:00 – 14:00  Draft Q3 stakeholder update (Medium)
14:00 – 14:30  Buffer / overflow from morning blocks
14:30 – 15:30  Team stand-in: unblock payments integration with Dev (High)
15:30 – 16:15  Delegate support tickets, respond to non-urgent threads (Low)
16:15 – 16:45  Plan tomorrow, update task board

FOCUS TIME: 4h 15m · MEETINGS: 1h 45m · ADMIN: 1h 30m`;

const WEEKLY = `WEEKLY SCHEDULE — 13 to 17 July

MONDAY
09:00 – 11:00  Deep work: Project Atlas milestone plan (High)
11:30 – 12:30  Engineering sync — payments integration status
14:00 – 16:00  Northwind UAT preparation (High)

TUESDAY
09:00 – 10:30  Onboarding design review with Rohan (Medium)
11:00 – 12:00  Client call: Northwind timeline sign-off (High)
14:00 – 15:30  Q3 stakeholder update draft (Medium)

WEDNESDAY
09:00 – 11:30  Deep work block: roadmap dependencies (High)
13:00 – 14:00  QA contractor onboarding session
14:30 – 16:00  Analytics review with Sam — onboarding funnel events

THURSDAY
09:00 – 10:30  Buffer for slipped work
11:00 – 12:00  Weekly leadership review
13:30 – 15:00  Documentation & process cleanup (Low)

FRIDAY
09:00 – 10:00  Inbox zero + ticket delegation (Low)
10:30 – 12:00  Retrospective & next-sprint planning
14:00 – 15:00  Weekly wrap-up, publish status to stakeholders

CAPACITY: 26h planned · 6h buffer · 3 high-priority items completed by Wednesday`;

function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("High");
  const [range, setRange] = useState("daily");
  const [output, setOutput] = useState(DAILY);
  const [loading, setLoading] = useState(false);

  const addTask = () => {
    if (!title.trim()) {
      toast.error("Enter a task before adding it.");
      return;
    }
    setTasks((t) => [...t, { id: Date.now(), title: title.trim(), priority }]);
    setTitle("");
    toast.success("Task added");
  };

  const generate = () => {
    if (tasks.length === 0) {
      toast.error("Add at least one task to build a schedule.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setOutput(range === "daily" ? DAILY : WEEKLY);
      setLoading(false);
      toast.success("Schedule generated");
    }, 1300);
  };

  return (
    <AppLayout
      title="AI Task Planner"
      description="Add your tasks, pick a horizon and let Aurelia build a realistic schedule."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="task">Task</Label>
              <Input
                id="task"
                placeholder="e.g. Prepare board deck"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Task["priority"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Schedule</Label>
                <Select value={range} onValueChange={setRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="secondary" className="w-full rounded-xl" onClick={addTask}>
              <Plus className="h-4 w-4" /> Add task
            </Button>

            <div className="space-y-2">
              {tasks.length === 0 ? (
                <EmptyState
                  icon={<ListChecks className="h-5 w-5" />}
                  title="No tasks yet"
                  hint="Add a few tasks to generate your schedule."
                />
              ) : (
                tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-card px-3 py-2 transition-colors hover:bg-muted/50"
                  >
                    <span className="min-w-0 truncate text-sm">{t.title}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <Badge
                        variant={t.priority === "High" ? "default" : "secondary"}
                        className="rounded-full"
                      >
                        {t.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setTasks((list) => list.filter((x) => x.id !== t.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove task</span>
                      </Button>
                    </span>
                  </div>
                ))
              )}
            </div>

            <Button className="w-full rounded-xl" onClick={generate} disabled={loading}>
              <Wand2 className="h-4 w-4" /> {loading ? "Planning…" : "Generate schedule"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Your schedule</CardTitle>
            {output && !loading && (
              <OutputActions
                content={output}
                filename="aurelia-schedule.txt"
                onRegenerate={generate}
                loading={loading}
              />
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <GeneratingState message="Balancing priorities and focus blocks…" />
            ) : output ? (
              <>
                <EditableOutput value={output} onChange={setOutput} rows={24} label="Schedule" />
                <AiDisclaimer />
              </>
            ) : (
              <EmptyState
                icon={<ListChecks className="h-5 w-5" />}
                title="No schedule yet"
                hint="Generate a plan once you've added your tasks."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}