import { useState } from "react";
import { Outlet } from "react-router";
import { Share2, Send, ChevronDown, Plus, Check } from "lucide-react";
import type { Route } from "./+types/trips.$tripId";
import {
  H3,
  H4,
  Muted,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Textarea,
  ScrollArea,
  Separator,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Taiwan December 2024 - Trip Kiwi" },
    { name: "description", content: "AI-powered travel planning assistant" },
  ];
}

// Placeholder data
const trip = {
  id: "1",
  name: "Taiwan December 2024",
  destination: "Taiwan",
  dates: "Dec 15-25, 2024",
};

// Multiple chats
const chats = [
  {
    id: "1",
    title: "Initial trip planning",
    messages: [
      {
        id: "1",
        role: "user" as const,
        content: "Planning a 10-day trip to Taiwan",
      },
      {
        id: "2",
        role: "assistant" as const,
        content:
          "Great choice! Taiwan is amazing in December. I'll help you plan an itinerary covering the highlights.\n\n✅ Trip created",
      },
    ],
  },
  {
    id: "2",
    title: "Kaohsiung recommendations",
    messages: [
      {
        id: "1",
        role: "user" as const,
        content: "What should I do in Kaohsiung?",
      },
      {
        id: "2",
        role: "assistant" as const,
        content:
          "Kaohsiung has great attractions:\n\n• **Pier-2 Art Center** - Creative warehouse district\n• **Lotus Pond** - Beautiful temples and pagodas\n• **Liuhe Night Market** - Famous for seafood\n• **Fo Guang Shan** - Stunning Buddhist monastery",
      },
    ],
  },
  {
    id: "3",
    title: "Revising plan for Taipei",
    messages: [
      {
        id: "1",
        role: "user" as const,
        content: "I want to add more food spots in Taipei",
      },
      {
        id: "2",
        role: "assistant" as const,
        content:
          "Here are must-try food spots in Taipei:\n\n• **Din Tai Fung** - World-famous xiaolongbao\n• **Yongkang Street** - Food lover's paradise\n• **Addiction Aquatic** - Fresh sashimi market\n• **Ice Monster** - Famous mango shaved ice\n\nWant me to add any to your itinerary?",
      },
      {
        id: "3",
        role: "user" as const,
        content: "Add Din Tai Fung for Day 5 dinner",
      },
      {
        id: "4",
        role: "assistant" as const,
        content:
          "Done! Added Din Tai Fung to Day 5 at 7:00 PM. I recommend the original location at Xinyi for the best experience.\n\n✅ Plan updated",
      },
    ],
  },
];

export default function TripDetailRoute({}: Route.ComponentProps) {
  const [selectedChatId, setSelectedChatId] = useState(chats[2].id);
  const [chatInput, setChatInput] = useState("");

  const selectedChat = chats.find((c) => c.id === selectedChatId)!;

  return (
    <div className="h-full flex bg-background">
      {/* Left Panel - Scrollable */}
      <ScrollArea className="flex-1">
        {/* Trip Info */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <H3 className="scroll-m-0 mb-1">{trip.name}</H3>
            <Muted>
              {trip.destination} · {trip.dates}
            </Muted>
          </div>
          <Button variant="ghost" size="icon">
            <Share2 className="size-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="plans">
          <div className="px-6 py-3">
            <TabsList>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="places">Places</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="plans">
            <Outlet />
          </TabsContent>

          <TabsContent value="places">
            <div className="p-6">
              <Muted>Places content coming soon</Muted>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <div className="p-6">
              <Muted>Map content coming soon</Muted>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="p-6">
              <Muted>Notes content coming soon</Muted>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>

      {/* Right Panel - AI Chat */}
      <div className="w-[400px] border-l flex flex-col shrink-0 overflow-hidden">
        {/* Chat Header */}
        <div className="px-4 py-3 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <H4 className=" truncate flex-1 mr-2">{selectedChat.title}</H4>
            <div className="flex gap-2 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ChevronDown className="size-4" />
                    History
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {chats.map((chat) => (
                    <DropdownMenuItem
                      key={chat.id}
                      onClick={() => setSelectedChatId(chat.id)}
                    >
                      <span className="flex-1 truncate">{chat.title}</span>
                      {chat.id === selectedChatId && (
                        <Check className="size-4 ml-2" />
                      )}
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
          <Separator />
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-4">
            {selectedChat.messages.map((message) => (
              <div key={message.id}>
                {message.role === "user" ? (
                  <div className="inline-block rounded-lg bg-muted px-3 py-2 text-md">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                ) : (
                  <div className="text-md text-muted-foreground">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 pt-0 shrink-0">
          <div className="flex items-end gap-2 rounded-xl border bg-muted/30 p-2">
            <Textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button
              size="icon"
              className="shrink-0 rounded-lg"
              disabled={!chatInput.trim()}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
