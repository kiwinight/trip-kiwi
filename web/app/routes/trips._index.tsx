import { Link } from "react-router";
import { Plus } from "lucide-react";
import type { Route } from "./+types/trips._index";
import {
  H3,
  Muted,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Trips - Trip Kiwi" },
    { name: "description", content: "AI-powered travel planning assistant" },
  ];
}

// Placeholder data
const trips = [
  { id: "1", name: "Paris Trip", dates: "Dec 15-20, 2024" },
  { id: "2", name: "Tokyo 2025", dates: "Mar 1-10, 2025" },
  { id: "3", name: "London Adventure", dates: "Jun 5-12, 2025" },
  { id: "4", name: "Seoul Food Tour", dates: "Aug 20-27, 2025" },
];

export default function TripsIndexRoute({}: Route.ComponentProps) {
  return (
    <main className="flex-1 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-6">
          <H3 className="scroll-m-0">My Trips</H3>
          <Button>
            <Plus className="size-4" />
            New Trip
          </Button>
        </div>

        {/* Trip Cards Grid */}
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Muted className="mb-4">No trips yet</Muted>
            <Button>
              <Plus className="size-4" />
              Create your first trip
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {trips.map((trip) => (
              <Link key={trip.id} to={`/trips/${trip.id}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{trip.name}</CardTitle>
                    <CardDescription>{trip.dates}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}



