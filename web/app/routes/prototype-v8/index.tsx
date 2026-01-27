import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Search, SearchX } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Avatar,
  AvatarImage,
  Badge,
  Button,
  Input,
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "~/components/ui";

// =============================================================================
// Types
// =============================================================================

type Category = "all" | "tests" | "fortune" | "games" | "utility";

type CompanionStatus = "active" | "coming-soon" | "archived";

interface Companion {
  id: string;
  name: string;
  description: string;
  category: Exclude<Category, "all">;
  imageUrl: string;
  status: CompanionStatus;
}

// =============================================================================
// Mock Data
// =============================================================================

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "tests", label: "Tests" },
  { id: "fortune", label: "Fortune" },
  { id: "games", label: "Games" },
  { id: "utility", label: "Utility" },
];

const COMPANIONS: Companion[] = [
  {
    id: "mbti-tester",
    name: "MBTI Tester",
    description:
      "Discover your personality type through conversation. Answer questions naturally and uncover your MBTI.",
    category: "tests",
    imageUrl:
      "https://api.dicebear.com/7.x/personas/svg?seed=mbti&backgroundColor=c0aede",
    status: "coming-soon",
  },
  {
    id: "horoscope-teller",
    name: "Horoscope Teller",
    description:
      "Get your daily fortune and horoscope through a friendly chat. Fresh insights await you every day.",
    category: "fortune",
    imageUrl:
      "https://api.dicebear.com/7.x/personas/svg?seed=fortune&backgroundColor=ffd5dc",
    status: "coming-soon",
  },
  {
    id: "enneagram-tester",
    name: "Enneagram Tester",
    description:
      "Discover your Enneagram type through a friendly conversation. Understand your core motivations.",
    category: "tests",
    imageUrl:
      "https://api.dicebear.com/7.x/personas/svg?seed=enneagram&backgroundColor=d5e8ff",
    status: "coming-soon",
  },
  {
    id: "tarot-reader",
    name: "Tarot Reader",
    description:
      "Get insights and guidance through an interactive tarot session. Ask about love, career, or life.",
    category: "fortune",
    imageUrl:
      "https://api.dicebear.com/7.x/personas/svg?seed=tarot&backgroundColor=ffe8d5",
    status: "coming-soon",
  },
  {
    id: "love-language-tester",
    name: "Love Language Tester",
    description:
      "Find out how you give and receive love. Understand your relationship style better.",
    category: "tests",
    imageUrl:
      "https://api.dicebear.com/7.x/personas/svg?seed=love&backgroundColor=ffd5e8",
    status: "coming-soon",
  },
  {
    id: "akinator",
    name: "Akinator",
    description:
      "Think of a character and I'll guess who it is! A classic guessing game powered by AI.",
    category: "games",
    imageUrl:
      "https://api.dicebear.com/7.x/personas/svg?seed=akinator&backgroundColor=d5ffe8",
    status: "coming-soon",
  },
  {
    id: "detective",
    name: "Detective",
    description:
      "Solve thrilling cases by interviewing suspects. Every conversation reveals new clues.",
    category: "games",
    imageUrl:
      "https://api.dicebear.com/7.x/personas/svg?seed=detective&backgroundColor=e8e8e8",
    status: "coming-soon",
  },
  {
    id: "dream-interpreter",
    name: "Dream Interpreter",
    description:
      "Describe your dreams and discover their hidden meanings. What is your subconscious telling you?",
    category: "utility",
    imageUrl:
      "https://api.dicebear.com/7.x/personas/svg?seed=dream&backgroundColor=e8d5ff",
    status: "coming-soon",
  },
];

// =============================================================================
// Components
// =============================================================================

function HeroSection() {
  return (
    <div className="text-center space-y-2 py-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        Chat in. Have fun. Share out.
      </h1>
      <p className="text-muted-foreground text-base max-w-lg mx-auto">
        Personality tests, fortune telling, games, and more — all through chat,
        all beautifully designed.
      </p>
    </div>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative max-w-xl mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search for companions..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}

function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: Category;
  onSelect: (category: Category) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {CATEGORIES.map((category) => (
        <Button
          key={category.id}
          variant={selected === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(category.id)}
          className="rounded-full"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}

function CompanionCard({ companion }: { companion: Companion }) {
  const categoryLabel = CATEGORIES.find(
    (c) => c.id === companion.category,
  )?.label;
  const isComingSoon = companion.status === "coming-soon";

  return (
    <Link to={`/prototype-v8/companion/${companion.id}`}>
      <Card
        size="sm"
        className="h-full transition-colors hover:bg-muted cursor-pointer"
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <Avatar size="lg">
              <AvatarImage src={companion.imageUrl} alt={companion.name} />
            </Avatar>
            <Badge variant="secondary">{categoryLabel}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-1 mt-3">
            <CardTitle>{companion.name}</CardTitle>
            {isComingSoon && <Badge variant="secondary">Coming Soon</Badge>}
          </div>
          <CardDescription className="line-clamp-2 lg:line-clamp-3">
            {companion.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

// =============================================================================
// Page
// =============================================================================

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const filteredCompanions = useMemo(() => {
    return COMPANIONS.filter((companion) => {
      // Filter by category
      if (
        selectedCategory !== "all" &&
        companion.category !== selectedCategory
      ) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          companion.name.toLowerCase().includes(query) ||
          companion.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <HeroSection />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCompanions.map((companion) => (
          <CompanionCard key={companion.id} companion={companion} />
        ))}
      </div>

      {filteredCompanions.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX />
            </EmptyMedia>
            <EmptyTitle>No companions found</EmptyTitle>
            <EmptyDescription>
              Try a different search or category.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
