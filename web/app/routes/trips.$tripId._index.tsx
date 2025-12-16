import { Link, useParams } from "react-router";
import { Plus } from "lucide-react";
import {
  Muted,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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

// Helper to get a preview from plan content
function getPlanPreview(content: string, maxLength = 100): string {
  const lines = content
    .split("\n")
    .filter((line) => !line.startsWith("#") && line.trim())
    .slice(0, 3)
    .join(" ");
  return lines.length > maxLength ? lines.slice(0, maxLength) + "..." : lines;
}

export default function PlansIndexRoute() {
  const { tripId } = useParams();

  return (
    <div className="px-6 pb-6">
      {/* Plans Header */}
      <div className="flex items-center justify-between mb-4">
        <Muted>{plans.length} plans</Muted>
        <Button size="sm">
          <Plus className="size-4" />
          New Plan
        </Button>
      </div>

      {/* Plans Card Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <Link
            key={plan.id}
            to={`/trips/${tripId}/plans/${plan.id}`}
            className="block"
          >
            <Card className="py-4 hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="pb-0">
                <CardTitle className="text-base">{plan.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {getPlanPreview(plan.content)}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

