import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown, Plus, Check, ArrowLeft } from "lucide-react";
import type { Route } from "./+types/trips.$tripId.plans.$planId";
import {
  H4,
  Muted,
  Button,
  Textarea,
  Separator,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui";

// Placeholder data (would come from shared state/API)
const plans = [
  {
    id: "1",
    name: "Kaohsiung Plan",
    content: `# Kaohsiung - Day 1-2

## Day 1
- 10:00 AM - Arrive at Kaohsiung Airport
- 12:00 PM - Check in to hotel
- 2:00 PM - Visit Pier-2 Art Center
- 6:00 PM - Dinner at Liuhe Night Market

## Day 2
- 9:00 AM - Lotus Pond
- 12:00 PM - Lunch at local restaurant
- 3:00 PM - Fo Guang Shan Buddha Museum
- 7:00 PM - Ruifeng Night Market`,
  },
  {
    id: "2",
    name: "Tainan Plan",
    content: `# Tainan - Day 3-4

## Day 3
- 9:00 AM - Train to Tainan
- 11:00 AM - Anping Old Fort
- 1:00 PM - Lunch at Anping Old Street
- 4:00 PM - Chihkan Tower

## Day 4
- 10:00 AM - Confucius Temple
- 12:00 PM - Hayashi Department Store
- 3:00 PM - Shennong Street
- 7:00 PM - Garden Night Market`,
  },
  {
    id: "3",
    name: "Taipei Plan",
    content: `# Taipei - Day 5-7

## Day 5
- 10:00 AM - HSR to Taipei
- 1:00 PM - Check in to hotel
- 3:00 PM - Taipei 101
- 7:00 PM - Din Tai Fung dinner

## Day 6
- 9:00 AM - National Palace Museum
- 1:00 PM - Lunch in Shilin
- 4:00 PM - Jiufen Old Street
- 8:00 PM - Raohe Night Market

## Day 7
- 10:00 AM - Yangmingshan National Park
- 3:00 PM - Beitou Hot Springs
- 7:00 PM - Final dinner in Ximending`,
  },
];

export function meta({ params }: Route.MetaArgs) {
  const plan = plans.find((p) => p.id === params.planId);
  return [
    { title: `${plan?.name ?? "Plan"} - Trip Kiwi` },
    { name: "description", content: "AI-powered travel planning assistant" },
  ];
}

export default function PlanEditRoute({ params }: Route.ComponentProps) {
  const { tripId, planId } = params;

  const plan = plans.find((p) => p.id === planId);
  const [planContent, setPlanContent] = useState(plan?.content ?? "");

  if (!plan) {
    return (
      <div className="px-6 pb-6">
        <div className="text-center py-12">
          <H4>Plan not found</H4>
          <Muted className="mt-2">
            The plan you're looking for doesn't exist.
          </Muted>
          <Link to={`/trips/${tripId}`}>
            <Button className="mt-4" variant="outline">
              <ArrowLeft className="size-4" />
              Back to Plans
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      {/* Back Navigation */}
      <Link
        to={`/trips/${tripId}`}
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="size-4" />
        <span className="text-sm">Back to Plans</span>
      </Link>

      {/* Plan Header */}
      <div className="flex items-center justify-between mb-3">
        <H4>{plan.name}</H4>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ChevronDown className="size-4" />
                Plans
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {plans.map((p) => (
                <DropdownMenuItem key={p.id} asChild>
                  <Link to={`/trips/${tripId}/plans/${p.id}`}>
                    <span className="flex-1">{p.name}</span>
                    {p.id === planId && <Check className="size-4 ml-2" />}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm">
            <Plus className="size-4" />
            New
          </Button>
        </div>
      </div>

      {/* <Separator className="mb-4" /> */}

      {/* Plan Editor */}
      <Textarea
        value={planContent}
        onChange={(e) => setPlanContent(e.target.value)}
        className="min-h-[600px] font-mono text-sm resize-none"
        placeholder="Start planning your trip..."
      />
    </div>
  );
}
