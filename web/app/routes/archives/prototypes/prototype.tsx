import { useState } from "react";
import { Link } from "react-router";
import {
  Settings,
  Plus,
  Briefcase,
  Share2,
  Send,
  MoreHorizontal,
  Trash2,
  Pencil,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  KiwiLogo,
  H3,
  Button,
  ButtonGroup,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Textarea,
  ScrollArea,
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui";

// =============================================================================
// MOCK DATA
// =============================================================================

const trips = [
  { id: "1", name: "Taiwan Trip", dates: "Dec 15-25, 2024" },
  { id: "2", name: "Tokyo 2025", dates: "Mar 1-10, 2025" },
  { id: "3", name: "London Adventure", dates: "Jun 5-12, 2025" },
  { id: "4", name: "Seoul Food Tour", dates: "Aug 20-27, 2025" },
];

const currentTrip = {
  id: "1",
  name: "Taiwan December 2024",
  destination: "Taiwan",
  dates: "Dec 15-25, 2024",
};

const plans = [
  {
    id: "1",
    name: "Taipei",
    order: 1,
    content: `
      <h2>Day 1 — Monday, Dec 15</h2>
      
      <h3>09:00 · Taipei 101</h3>
      <p>Visit <code>@Taipei 101</code> observatory deck for city views.<br/>Book tickets online to skip the line.<br/>📍 Xinyi District</p>
      <hr/>
      
      <h3>12:00 · Din Tai Fung</h3>
      <p>Lunch at <code>@Din Tai Fung</code> - the original Xinyi location.<br/>Must try: Xiaolongbao, truffle dumplings.<br/>🍜 Expect 20-30 min wait</p>
      <hr/>
      
      <h3>14:30 · Elephant Mountain</h3>
      <p>Short hike (30 min up). Best photos of Taipei 101 from the top.<br/>💡 Go before sunset for golden hour</p>
      <hr/>
      
      <h3>18:00 · Shilin Night Market</h3>
      <p>Dinner and explore. Try:</p>
      <ul>
        <li>Oyster omelette</li>
        <li>Stinky tofu (if you dare)</li>
        <li>Papaya milk</li>
      </ul>
      
      <h2>Day 2 — Tuesday, Dec 16</h2>
      
      <h3>08:00 · Yongkang Street Breakfast</h3>
      <p>Traditional Taiwanese breakfast.<br/>Try: Soy milk, shaobing, dan bing<br/>🥢 Local favorite spot</p>
      <hr/>
      
      <h3>10:00 · National Palace Museum</h3>
      <p>One of the world's largest collections of Chinese art.<br/>Must see: Jadeite Cabbage, Meat-shaped Stone<br/>⏰ Plan for 3-4 hours minimum</p>
      <hr/>
      
      <h3>14:00 · Beitou Hot Springs</h3>
      <p>Relax in natural hot springs.<br/>Options: Public bath or private room<br/>♨️ Bring your own towel</p>
      <hr/>
      
      <h3>17:00 · Tamsui Old Street</h3>
      <p>Waterfront promenade with sunset views.<br/>Try: A-gei, iron eggs, fish crackers<br/>🌅 Best sunset spot in Taipei</p>
      <hr/>
      
      <h3>20:00 · Ximending</h3>
      <p>Shopping and nightlife district.<br/>Similar vibe to Tokyo's Harajuku<br/>🛍️ Great for street fashion and bubble tea</p>
      
      <h2>Day 3 — Wednesday, Dec 17</h2>
      
      <h3>07:00 · Jiufen Day Trip</h3>
      <p>Take bus 1062 from Zhongxiao Fuxing.<br/>Journey takes about 90 minutes<br/>🚌 Get there early to avoid crowds</p>
      <hr/>
      
      <h3>09:00 · Jiufen Old Street</h3>
      <p>Explore <code>@Jiufen Old Street</code> - Spirited Away inspiration!<br/>Narrow alleys, tea houses, mountain views<br/>🏮 A-Mei Tea House is iconic</p>
      <hr/>
      
      <h3>12:00 · Jiufen Lunch</h3>
      <p>Local specialties:</p>
      <ul>
        <li>Taro balls (must try!)</li>
        <li>Grass jelly</li>
        <li>Fish ball soup</li>
        <li>Peanut ice cream roll</li>
      </ul>
      <hr/>
      
      <h3>14:00 · Golden Waterfall</h3>
      <p>Quick stop on the way to/from Jiufen.<br/>Unique orange-colored waterfall from mineral deposits<br/>📸 Great photo opportunity</p>
      <hr/>
      
      <h3>16:00 · Return to Taipei</h3>
      <p>Take bus back to Taipei.<br/>Rest at hotel before dinner<br/>💤 Jiufen is tiring!</p>
      <hr/>
      
      <h3>19:00 · Raohe Night Market</h3>
      <p>One of the oldest night markets in Taipei.<br/>Famous for: Pepper buns at entrance<br/>🥟 Less touristy than Shilin</p>
    `,
  },
  {
    id: "2",
    name: "Taichung",
    order: 2,
    content: `
      <h2>Day 1 — Thursday, Dec 18</h2>
      
      <h3>08:00 · HSR from Taipei</h3>
      <p>Take <code>@HSR Ticket</code> to Taichung.<br/>Journey takes about 1 hour<br/>🚄 Book tickets in advance</p>
      <hr/>
      
      <h3>10:00 · Rainbow Village</h3>
      <p>Visit <code>@Rainbow Village</code> - colorful painted village by a veteran.<br/>Great for photos!<br/>🎨 Small but Instagram-worthy</p>
      <hr/>
      
      <h3>13:00 · Miyahara</h3>
      <p>Famous ice cream and pastry shop in a historic building.<br/>Beautiful interior design<br/>🍨 Try their unique ice cream flavors</p>
      <hr/>
      
      <h3>15:00 · Calligraphy Greenway</h3>
      <p>Tree-lined pedestrian walkway.<br/>Nice for afternoon stroll<br/>🌳 Local cafes and shops</p>
      <hr/>
      
      <h3>16:00 · National Taichung Theater</h3>
      <p>Stunning architecture by Toyo Ito.<br/>Free to enter lobby area<br/>🏛️ One of the most unique buildings in Taiwan</p>
      <hr/>
      
      <h3>19:00 · Fengjia Night Market</h3>
      <p>Largest night market in Taiwan.</p>
      <ul>
        <li>Fried mushrooms</li>
        <li>Papaya milk</li>
        <li>Coffin bread</li>
        <li>Bubble tea everywhere</li>
      </ul>
      
      <h2>Day 2 — Friday, Dec 19</h2>
      
      <h3>09:00 · Sun Moon Lake</h3>
      <p>Day trip to Taiwan's largest lake.<br/>About 1.5 hours from Taichung<br/>🚌 Take the tourist shuttle</p>
      <hr/>
      
      <h3>10:30 · Wenwu Temple</h3>
      <p>Beautiful temple overlooking the lake.<br/>Dedicated to Confucius and Guan Yu<br/>⛩️ Great views from here</p>
      <hr/>
      
      <h3>12:00 · Ita Thao Village</h3>
      <p>Indigenous village with local food.<br/>Try: Wild boar sausage, mochi<br/>🏘️ Small but charming</p>
      <hr/>
      
      <h3>14:00 · Bike around the lake</h3>
      <p>Rent a bike and ride the lakeside path.<br/>Full loop is about 30km<br/>🚴 Electric bikes available</p>
      <hr/>
      
      <h3>17:00 · Return to Taichung</h3>
      <p>Head back to the city.<br/>Pack up for Kaohsiung tomorrow<br/>🧳 Early start tomorrow!</p>
    `,
  },
  {
    id: "3",
    name: "Kaohsiung",
    order: 3,
    content: `
      <h2>Day 1 — Saturday, Dec 20</h2>
      
      <h3>08:00 · HSR from Taichung</h3>
      <p>High speed rail to Kaohsiung.<br/>Journey takes about 1 hour<br/>🚄 Taiwan's second largest city</p>
      <hr/>
      
      <h3>10:00 · Pier-2 Art Center</h3>
      <p>Creative warehouse district with galleries and cafes.<br/>Great street art and installations<br/>🎨 Plan for 2-3 hours</p>
      <hr/>
      
      <h3>13:00 · Pier-2 Lunch</h3>
      <p>Many restaurants in the area.<br/>Try local Kaohsiung dishes<br/>🍜 Seafood is fresh here</p>
      <hr/>
      
      <h3>14:30 · Lotus Pond</h3>
      <p>Beautiful temples and pagodas by the lake.</p>
      <ul>
        <li>Dragon and Tiger Pagodas</li>
        <li>Spring and Autumn Pavilions</li>
        <li>Confucius Temple</li>
      </ul>
      <hr/>
      
      <h3>18:00 · Liuhe Night Market</h3>
      <p>Famous for seafood.<br/>Try: Grilled squid, papaya milk<br/>🦑 More local than touristy</p>
      
      <h2>Day 2 — Sunday, Dec 21</h2>
      
      <h3>09:00 · Fo Guang Shan</h3>
      <p>One of the largest Buddhist monasteries in Taiwan.<br/>Giant Buddha statue<br/>🙏 Free entry, respectful dress code</p>
      <hr/>
      
      <h3>12:00 · Monastery Vegetarian Lunch</h3>
      <p>Try the vegetarian buffet at the monastery.<br/>Delicious and affordable<br/>🥬 Unique experience</p>
      <hr/>
      
      <h3>14:00 · Cijin Island</h3>
      <p>Take the ferry from Gushan.<br/>Beach, seafood, lighthouse<br/>⛴️ Ferry is cheap and quick</p>
      <hr/>
      
      <h3>17:00 · Cijin Sunset</h3>
      <p>Watch sunset from the beach.<br/>Seafood dinner on the island<br/>🌅 Perfect end to the day</p>
      <hr/>
      
      <h3>20:00 · Ruifeng Night Market</h3>
      <p>Local favorite night market.<br/>Less touristy, more variety<br/>🛒 Open Thursday to Sunday only</p>
      
      <h2>Day 3 — Monday, Dec 22</h2>
      
      <h3>09:00 · Formosa Boulevard Station</h3>
      <p>See the Dome of Light installation.<br/>One of the most beautiful metro stations in the world<br/>🎨 Worth a special trip</p>
      <hr/>
      
      <h3>10:00 · Central Park</h3>
      <p>Urban park with nice walking paths.<br/>Another beautiful metro station here<br/>🌳 Good for morning walk</p>
      <hr/>
      
      <h3>12:00 · Final Lunch in Taiwan</h3>
      <p>Last chance for Taiwanese food!</p>
      <ul>
        <li>Beef noodle soup</li>
        <li>Bubble tea</li>
        <li>Pineapple cake (buy for souvenirs)</li>
      </ul>
      <hr/>
      
      <h3>14:00 · Head to Airport</h3>
      <p>Take MRT to Kaohsiung Airport.<br/>Allow extra time for check-in<br/>✈️ Safe travels home!</p>
    `,
  },
];

const savedItems = [
  {
    id: "1",
    name: "Din Tai Fung",
    order: 1,
    content: `
      <p>Xinyi District · Xiaolongbao restaurant</p>
      
      <h2>Notes</h2>
      <p>Must try the truffle dumplings! The original Xinyi location is better than mall branches.</p>
      <p>🍜 Expect 20-30 min wait at lunch time. Can make reservations online.</p>
      
      <h2>Referenced in</h2>
      <ul>
        <li>Taipei, Day 1 lunch</li>
      </ul>
    `,
    planReferences: ["1"],
  },
  {
    id: "2",
    name: "Taipei 101",
    order: 2,
    content: `
      <p>Xinyi District · Observatory & Shopping</p>
      
      <h2>Notes</h2>
      <p>Book observatory tickets online to skip the line. Best views on clear days.</p>
      <p>📍 Also great for shopping and food court in basement.</p>
      
      <h2>Referenced in</h2>
      <ul>
        <li>Taipei, Day 1 morning</li>
      </ul>
    `,
    planReferences: ["1"],
  },
  {
    id: "3",
    name: "🍧 Ice Monster",
    order: 3,
    content: `
      <p>Yongkang Street · Famous shaved ice</p>
      
      <h2>Notes</h2>
      <p>World-famous mango shaved ice. Long lines but worth it!</p>
      <p>Best in summer when mangoes are in season.</p>
    `,
    planReferences: [],
  },
  {
    id: "4",
    name: "HSR Ticket",
    order: 4,
    content: `
      <p>High Speed Rail · Transportation</p>
      
      <h2>Notes</h2>
      <p>Book tickets in advance on the HSR website or app.</p>
      <p>🚄 Taipei to Kaohsiung takes about 1.5 hours.</p>
      
      <h2>Referenced in</h2>
      <ul>
        <li>Taichung, Day 1</li>
        <li>Kaohsiung, Day 1</li>
      </ul>
    `,
    planReferences: ["2", "3"],
  },
  {
    id: "5",
    name: "Rainbow Village",
    order: 5,
    content: `
      <p>Taichung · Painted village</p>
      
      <h2>Notes</h2>
      <p>Colorful painted village created by a retired soldier. Small but very Instagram-worthy!</p>
      <p>🎨 Free entry. About 20-30 minutes to explore.</p>
      
      <h2>Referenced in</h2>
      <ul>
        <li>Taichung, Day 1</li>
      </ul>
    `,
    planReferences: ["2"],
  },
  {
    id: "6",
    name: "Jiufen Old Street",
    order: 6,
    content: `
      <p>New Taipei · Mountain town</p>
      
      <h2>Notes</h2>
      <p>Spirited Away inspiration! Narrow alleys, tea houses, and stunning mountain views.</p>
      <p>🏮 A-Mei Tea House is iconic. Try taro balls and peanut ice cream roll.</p>
      <p>Go early to avoid crowds. Gets very busy on weekends.</p>
      
      <h2>Referenced in</h2>
      <ul>
        <li>Taipei, Day 3</li>
      </ul>
    `,
    planReferences: ["1"],
  },
];

const chats = [
  {
    id: "1",
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
        content: "Add Din Tai Fung for Day 1 lunch",
      },
      {
        id: "4",
        role: "assistant" as const,
        content:
          "Done! Added Din Tai Fung to Day 1 at 12:00 PM. I recommend the original location at Xinyi for the best experience.\n\n✅ Plan updated",
      },
      {
        id: "5",
        role: "user" as const,
        content: "What about Ice Monster? When should I go there?",
      },
      {
        id: "6",
        role: "assistant" as const,
        content:
          "Ice Monster is perfect for an afternoon treat! I suggest:\n\n• **Day 2 around 3 PM** - After visiting Yongkang Street area\n• It's on Yongkang Street, so you can combine both\n• Try the mango shaved ice - it's their signature!\n\nWant me to add it to Day 2?",
      },
      {
        id: "7",
        role: "user" as const,
        content:
          "Yes please! Also, are there any vegetarian options in these places?",
      },
      {
        id: "8",
        role: "assistant" as const,
        content:
          "Great question! Here's the vegetarian situation:\n\n• **Din Tai Fung** - Has vegetable dumplings and some veggie dishes\n• **Ice Monster** - All desserts are vegetarian-friendly!\n• **Yongkang Street** - Several vegetarian restaurants nearby\n\nI can also recommend:\n• **Minder Vegetarian** - Famous Buddhist restaurant\n• **About Animals** - Trendy vegan cafe\n\nWant me to add any of these to your plan?",
      },
      {
        id: "9",
        role: "user" as const,
        content: "Add Minder Vegetarian for one of the dinners",
      },
      {
        id: "10",
        role: "assistant" as const,
        content:
          "Perfect choice! I've added Minder Vegetarian to Day 2 dinner at 6:30 PM.\n\nIt's located in Zhongshan district - about 15 minutes from Yongkang Street by MRT.\n\n✅ Plan updated\n\nYour Day 2 now looks like:\n• Morning: National Palace Museum\n• Afternoon: Yongkang Street + Ice Monster\n• Evening: Minder Vegetarian",
      },
      {
        id: "11",
        role: "user" as const,
        content:
          "This looks great! One more thing - any tips for the night markets?",
      },
      {
        id: "12",
        role: "assistant" as const,
        content:
          "Here are my top night market tips:\n\n**When to go:**\n• Arrive around 6-7 PM for best selection\n• Weekdays are less crowded\n\n**What to try:**\n• Shilin: Fried chicken, stinky tofu\n• Raohe: Pepper buns (get there early!)\n• Ningxia: Oyster omelette, taro balls\n\n**Pro tips:**\n• Bring cash (some stalls don't take cards)\n• Wear comfortable shoes\n• Go hungry - pace yourself!\n• Try the games too, not just food\n\nAnything specific you'd like to know?",
      },
    ],
  },
  {
    id: "2",
    title: "Transportation options",
    messages: [
      {
        id: "1",
        role: "user" as const,
        content: "How do I get from Taipei to Taichung?",
      },
      {
        id: "2",
        role: "assistant" as const,
        content:
          "You have a few options:\n\n• **HSR (High Speed Rail)** - 1 hour, ~$25 USD\n• **Train** - 2-3 hours, ~$10 USD\n• **Bus** - 2.5 hours, ~$8 USD\n\nI recommend HSR for convenience. Would you like me to add it to your itinerary?",
      },
    ],
  },
  {
    id: "3",
    title: "Budget breakdown",
    messages: [
      {
        id: "1",
        role: "user" as const,
        content: "Can you estimate the budget for this trip?",
      },
      {
        id: "2",
        role: "assistant" as const,
        content:
          "Here's a rough estimate for 8 days:\n\n• **Flights** - $500-800\n• **Hotels** - $400-600\n• **Food** - $200-300\n• **Transport** - $100-150\n• **Activities** - $100-200\n\n**Total: $1,300 - $2,050 USD**",
      },
    ],
  },
  {
    id: "4",
    title: "Night market recommendations",
    messages: [
      {
        id: "1",
        role: "user" as const,
        content: "Which night markets should I visit?",
      },
      {
        id: "2",
        role: "assistant" as const,
        content:
          "Here are my top picks:\n\n• **Shilin** - Largest and most famous\n• **Raohe** - Best pepper buns\n• **Ningxia** - Local favorite\n• **Fengjia (Taichung)** - Biggest in Taiwan",
      },
    ],
  },
  {
    id: "5",
    title: "Hotel suggestions",
    messages: [
      {
        id: "1",
        role: "user" as const,
        content: "Where should I stay in Taipei?",
      },
      {
        id: "2",
        role: "assistant" as const,
        content:
          "Best areas to stay:\n\n• **Xinyi** - Modern, near Taipei 101\n• **Zhongshan** - Great food scene\n• **Ximending** - Nightlife and shopping\n• **Da'an** - Quiet, residential",
      },
    ],
  },
  {
    id: "6",
    title: "Weather and packing",
    messages: [
      {
        id: "1",
        role: "user" as const,
        content: "What should I pack for December?",
      },
      {
        id: "2",
        role: "assistant" as const,
        content:
          "December in Taiwan:\n\n• **Taipei** - 15-20°C, rainy\n• **Kaohsiung** - 20-25°C, drier\n\nPack layers, a rain jacket, and comfortable walking shoes!",
      },
    ],
  },
  {
    id: "7",
    title: "Jiufen day trip",
    messages: [
      {
        id: "1",
        role: "user" as const,
        content: "How do I get to Jiufen?",
      },
      {
        id: "2",
        role: "assistant" as const,
        content:
          "From Taipei:\n\n• **Bus 1062** from Zhongxiao Fuxing (~90 min)\n• **Train + Bus** via Ruifang\n• **Taxi/Uber** (~$30-40 USD)\n\nGo early to avoid crowds!",
      },
    ],
  },
];

// =============================================================================
// TAB BUTTON WITH DROPDOWN (for selected tabs)
// =============================================================================

function TabButton({
  label,
  isSelected,
  onClick,
  onDelete,
  onRename,
  showDropdown = false,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: () => void;
  onRename?: () => void;
  showDropdown?: boolean;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Only show dropdown button when tab is selected
  if (isSelected && showDropdown) {
    return (
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <ButtonGroup>
          <Button variant="secondary" onClick={onClick}>
            {label}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {onRename && (
                <DropdownMenuItem onClick={onRename}>
                  <Pencil className="size-4" />
                  Rename
                </DropdownMenuItem>
              )}
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{label}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              item and all its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete?.();
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button variant={isSelected ? "secondary" : "ghost"} onClick={onClick}>
      {label}
    </Button>
  );
}

// =============================================================================
// SIDEBAR COMPONENT (Reused from trips.tsx)
// =============================================================================

function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      // collapsible="offcanvas"
      collapsible="icon"
    >
      <SidebarHeader className="h-auto">
        <SidebarMenu>
          {!isCollapsed && (
            <SidebarMenuItem className="flex items-center gap-1">
              <SidebarMenuButton size="md" asChild className="h-9 flex gap-1">
                <Link to="/prototype">
                  <div className="flex items-center gap-2">
                    <KiwiLogo className="size-6" />
                    <span className="font-semibold text-base">Trip Kiwi</span>
                  </div>
                </Link>
              </SidebarMenuButton>
              <SidebarTrigger className="-ml-1 size-9" />
            </SidebarMenuItem>
          )}
          {isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger className="size-9" />
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                Toggle Sidebar
              </TooltipContent>
            </Tooltip>
          )}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {!isCollapsed && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="New Trip"
                  size="md"
                  className="h-9 font-medium"
                  asChild
                >
                  <Link to="/prototype">
                    <Plus className="ml-[2px]" />
                    <span>New Trip</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {isCollapsed && (
              <SidebarMenuItem>
                <Button variant="ghost" size="icon">
                  <Plus />
                </Button>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>My Trips</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {trips.map((trip) => (
                  <SidebarMenuItem key={trip.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={trip.id === "1"}
                      size="md"
                      className="h-9 font-medium data-[active=true]:font-medium data-[active=true]:bg-secondary"
                    >
                      <Link to="/prototype">
                        <span>{trip.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {!isCollapsed && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Settings"
                size="md"
                className="h-9 font-medium"
              >
                <Settings className="size-4 ml-[2px]" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {isCollapsed && (
            <SidebarMenuItem>
              <Button variant="ghost" size="icon">
                <Settings className="size-4" />
              </Button>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// =============================================================================
// DOCUMENT EDITOR COMPONENT (Unified for Plans and Saved Items)
// =============================================================================

function DocumentEditor({
  name,
  content,
  onNameChange,
  placeholder = "Start writing...",
}: {
  name: string;
  content: string;
  onNameChange?: (name: string) => void;
  placeholder?: string;
}) {
  const [localName, setLocalName] = useState(name);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: content,
    immediatelyRender: false, // Required for SSR frameworks
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none min-h-[400px]",
      },
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value);
    onNameChange?.(e.target.value);
  };

  return (
    <div className="px-4 py-4">
      {/* Name Input */}
      <input
        type="text"
        value={localName}
        onChange={handleNameChange}
        className="w-full text-2xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 mb-4"
        placeholder="Untitled"
      />

      {/* TipTap Content */}
      <EditorContent editor={editor} />
    </div>
  );
}

// =============================================================================
// CHAT PANEL COMPONENT (Redesigned with tabs)
// =============================================================================

function ChatPanel() {
  const [chatInput, setChatInput] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(chats[0].id);

  const selectedChat = chats.find((c) => c.id === selectedChatId) ?? chats[0];

  return (
    <div className="w-[400px] border-l flex flex-col shrink-0 overflow-hidden">
      {/* Chat Tabs */}
      <div className="px-4 py-2 flex items-center gap-1 border-b overflow-x-auto shrink-0">
        {chats.map((chat) => (
          <TabButton
            key={chat.id}
            label={
              chat.title.length > 15
                ? chat.title.slice(0, 15) + "..."
                : chat.title
            }
            isSelected={selectedChatId === chat.id}
            onClick={() => setSelectedChatId(chat.id)}
            onDelete={() => {
              console.log("Delete chat:", chat.id);
              // TODO: Implement actual deletion
            }}
            onRename={() => {
              console.log("Rename chat:", chat.id);
              // TODO: Implement rename dialog
            }}
            showDropdown={true}
          />
        ))}
        <Button variant="ghost" className="shrink-0">
          <Plus className="size-4" />
          New Chat
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {selectedChat.messages.map((message) => (
            <div key={message.id}>
              {message.role === "user" ? (
                <div className="inline-block rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              ) : (
                <div className="text-sm text-foreground">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="px-4 py-3 shrink-0 border-t">
        <div className="flex items-end gap-2">
          <Textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message..."
            className="rounded-[0px] min-h-[144px] max-h-[200px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 text-sm!"
          />
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            disabled={!chatInput.trim()}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN CONTENT (UNIFIED DESIGN)
// =============================================================================

function MainContent() {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0].id);
  const [selectedSavedItemId, setSelectedSavedItemId] = useState(
    savedItems[0].id
  );
  const [activeTab, setActiveTab] = useState("plans");
  const [tripName, setTripName] = useState(currentTrip.name);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? plans[0];
  const selectedSavedItem =
    savedItems.find((s) => s.id === selectedSavedItemId) ?? savedItems[0];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Scrollable container */}
      <div className="flex-1 overflow-auto">
        {/* Trip Header - scrolls with content */}
        <div className="px-4 pt-4 pb-4 flex items-center gap-2">
          <input
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="flex-1 text-2xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
            placeholder="Untitled Trip"
          />
          <Button variant="ghost" size="icon">
            <Share2 className="size-4" />
          </Button>
        </div>

        {/* Tabs with sticky header */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col"
        >
          {/* Sticky Tabs Container */}
          <div className="sticky top-0 z-10 bg-background border-b">
            {/* Primary Tabs */}
            <div className="px-4 pt-[5px] pb-[5px]">
              <TabsList className="h-[42px]!">
                <TabsTrigger value="plans">Plans</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
              </TabsList>
            </div>

            {/* Sub-tabs - same pattern for both tabs */}
            <div className="px-4 py-2 flex items-center gap-1 border-t bg-background overflow-x-auto">
              {activeTab === "plans" ? (
                <>
                  {plans.map((plan) => (
                    <TabButton
                      key={plan.id}
                      label={plan.name}
                      isSelected={selectedPlanId === plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      onDelete={() => {
                        console.log("Delete plan:", plan.id);
                        // TODO: Implement actual deletion
                      }}
                      showDropdown={true}
                    />
                  ))}
                  <Button variant="ghost">
                    <Plus className="size-4" />
                    New Plan
                  </Button>
                </>
              ) : (
                <>
                  {savedItems.map((item) => (
                    <TabButton
                      key={item.id}
                      label={item.name}
                      isSelected={selectedSavedItemId === item.id}
                      onClick={() => setSelectedSavedItemId(item.id)}
                      onDelete={() => {
                        console.log("Delete saved item:", item.id);
                        // TODO: Implement actual deletion
                      }}
                      showDropdown={true}
                    />
                  ))}
                  <Button variant="ghost">
                    <Plus className="size-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Tab Content - same DocumentEditor for both */}
          <TabsContent value="plans" className="mt-0">
            <DocumentEditor
              key={selectedPlanId}
              name={selectedPlan.name}
              content={selectedPlan.content}
              placeholder="Start planning your itinerary..."
            />
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <DocumentEditor
              key={selectedSavedItemId}
              name={selectedSavedItem.name}
              content={selectedSavedItem.content}
              placeholder="Add notes about this place..."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN PROTOTYPE ROUTE
// =============================================================================

export function meta() {
  return [
    { title: "Prototype - Trip Kiwi" },
    { name: "description", content: "New design prototype" },
  ];
}

export default function PrototypeRoute() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col">
          {/* Small header with just the toggle */}
          {/* <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1 size-9" />
          </header> */}
          {/* Main content area */}
          <div className="flex-1 flex overflow-hidden">
            <MainContent />
            <ChatPanel />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
