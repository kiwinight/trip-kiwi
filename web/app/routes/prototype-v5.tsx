import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Settings,
  Plus,
  Send,
  MoreHorizontal,
  Trash2,
  Pencil,
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
  ArrowLeft,
  ChevronDownIcon,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  KiwiLogo,
  Button,
  Textarea,
  ScrollArea,
  ScrollBar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
  TooltipProvider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  Separator,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  useTheme,
} from "~/components/ui";
import { cn } from "~/libs/utils";

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
  {
    id: "4",
    name: "sample",
    order: 3,
    content: ``,
  },
  {
    id: "5",
    name: "sample",
    order: 3,
    content: ``,
  },
  {
    id: "6",
    name: "sample",
    order: 3,
    content: ``,
  },
  {
    id: "7",
    name: "sample",
    order: 3,
    content: ``,
  },
  {
    id: "8",
    name: "sample",
    order: 3,
    content: ``,
  },
  {
    id: "9",
    name: "sample",
    order: 3,
    content: ``,
  },
  {
    id: "10",
    name: "sample",
    order: 3,
    content: ``,
  },
  {
    id: "11",
    name: "sample",
    order: 3,
    content: ``,
  },
  {
    id: "12",
    name: "sample",
    order: 3,
    content: ``,
  },
  {
    id: "13",
    name: "sample",
    order: 3,
    content: ``,
  },
  {
    id: "14",
    name: "sample",
    order: 3,
    content: ``,
  },
  {
    id: "15",
    name: "sample",
    order: 3,
    content: ``,
  },
  {
    id: "16",
    name: "sample",
    order: 3,
    content: ``,
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

const NAV_DEFAULT_SIZE = 18;
const NAV_MIN_SIZE = 14;
const NAV_MAX_SIZE = 28;
const CHAT_DEFAULT_SIZE = 40;
const CHAT_MIN_SIZE = 25;
const CHAT_MAX_SIZE = 60;

const UI_SCALES = ["90%", "95%", "100%", "105%", "110%"] as const;
type UIScale = (typeof UI_SCALES)[number];

type DocKind = "itinerary" | "library";
type DocTypeDef = {
  id: string;
  name: string;
  isSystem?: boolean;
};
type Doc = {
  id: string;
  kind: DocKind;
  typeId: string | null;
  name: string;
  subtitle?: string;
  content: string;
  placeholder: string;
  sourceId: string;
};

export function meta() {
  return [
    { title: "Prototype V5 - Trip Kiwi" },
    { name: "description", content: "Flattened component structure prototype" },
  ];
}

export default function PrototypeV5Route() {
  const { theme, setTheme } = useTheme();

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [lastExpandedNavSize, setLastExpandedNavSize] =
    useState(NAV_DEFAULT_SIZE);
  const [uiScale, setUiScale] = useState<UIScale>("100%");

  const [tripName, setTripName] = useState(currentTrip.name);

  const [activeView, setActiveView] = useState<"plans" | "sources">("plans");
  const [viewState, setViewState] = useState<"list" | "editor">("list");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [openTypePicker, setOpenTypePicker] = useState(false);
  const [typeQuery, setTypeQuery] = useState("");
  const [openDeleteDocDialog, setOpenDeleteDocDialog] = useState(false);
  const [openViewPicker, setOpenViewPicker] = useState(false);

  const defaultTypeDefs: DocTypeDef[] = useMemo(
    () => [
      { id: "type:plan", name: "Plan", isSystem: true },
      { id: "type:hotel", name: "Hotel", isSystem: true },
      { id: "type:restaurant", name: "Restaurant", isSystem: true },
      { id: "type:place", name: "Place", isSystem: true },
      { id: "type:transport", name: "Transport", isSystem: true },
      { id: "type:activity", name: "Activity", isSystem: true },
      { id: "type:note", name: "Note", isSystem: true },
    ],
    []
  );
  const [typeDefs, setTypeDefs] = useState<DocTypeDef[]>(defaultTypeDefs);

  const initialDocs: Doc[] = useMemo(() => {
    const mappedPlans: Doc[] = plans.map((p) => ({
      id: `plan:${p.id}`,
      kind: "itinerary",
      typeId: "type:plan",
      name: p.name,
      subtitle: p.id === "1" ? "Day 1-3" : p.id === "2" ? "Day 4-5" : "Day 6-8",
      content: p.content,
      placeholder: "Start planning your itinerary...",
      sourceId: p.id,
    }));

    const mappedSaved: Doc[] = savedItems.map((s) => ({
      id: `saved:${s.id}`,
      kind: "library",
      typeId: "type:place",
      name: s.name,
      subtitle:
        s.id === "1"
          ? "Xinyi District · Restaurant"
          : s.id === "2"
          ? "Xinyi District · Observatory"
          : s.id === "3"
          ? "Yongkang Street · Dessert"
          : s.id === "4"
          ? "Transportation"
          : s.id === "5"
          ? "Taichung · Art"
          : "New Taipei · Scenic Town",
      content: s.content,
      placeholder: "Add notes about this place...",
      sourceId: s.id,
    }));

    return [...mappedPlans, ...mappedSaved];
  }, []);

  const [docs, setDocs] = useState<Doc[]>(() => initialDocs);

  const [chatInput, setChatInput] = useState("");
  const [chatList, setChatList] = useState(chats);
  const [selectedChatId, setSelectedChatId] = useState(chats[0].id);
  const [openChatPicker, setOpenChatPicker] = useState(false);
  const [openDeleteChatDialog, setOpenDeleteChatDialog] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = uiScale;
  }, [uiScale]);

  useEffect(() => {
    if (!openTypePicker) setTypeQuery("");
  }, [openTypePicker]);

  const visibleDocs = useMemo(() => {
    return docs.filter((d) =>
      activeView === "plans" ? d.kind === "itinerary" : d.kind === "library"
    );
  }, [docs, activeView]);

  const selectedDoc = docs.find((d) => d.id === selectedDocId);

  const typeNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of typeDefs) map.set(t.id, t.name);
    return map;
  }, [typeDefs]);

  const selectedTypeName = selectedDoc?.typeId
    ? typeNameById.get(selectedDoc.typeId) ?? "Unknown"
    : "Uncategorized";

  const selectedChat =
    chatList.find((c) => c.id === selectedChatId) ?? chatList[0];

  const toggleNav = () => {
    setNavCollapsed((prev) => !prev);
  };

  const handleDocCardClick = (id: string) => {
    setSelectedDocId(id);
    setViewState("editor");
  };

  const handleDocBack = () => {
    setViewState("list");
    setSelectedDocId(null);
  };

  const deleteSelectedDoc = () => {
    if (!selectedDoc) return;
    setDocs((prev) => prev.filter((d) => d.id !== selectedDoc.id));
    handleDocBack();
  };

  const handleNewDocClick = () => {
    const now = Date.now();
    const kind: DocKind = activeView === "plans" ? "itinerary" : "library";
    const newDoc: Doc = {
      id: `local:${now}`,
      kind,
      typeId: kind === "itinerary" ? "type:plan" : "type:place",
      name: "Untitled",
      subtitle: undefined,
      content: "",
      placeholder:
        kind === "itinerary"
          ? "Start planning your itinerary..."
          : "Add notes about this place...",
      sourceId: `local:${now}`,
    };

    setDocs((prev) => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);
    setViewState("editor");
  };

  const handleDocNameChange = (newName: string) => {
    if (!selectedDoc) return;
    setDocs((prev) =>
      prev.map((d) => (d.id === selectedDoc.id ? { ...d, name: newName } : d))
    );
  };

  const handleNewChat = () => {
    const now = Date.now();
    const newChat = {
      id: `chat:${now}`,
      title: "New Chat",
      messages: [],
    };
    setChatList((prev) => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
  };

  const handleRenameChat = () => {
    if (!selectedChat) return;
    const newTitle = window.prompt("Rename chat", selectedChat.title);
    if (!newTitle?.trim()) return;
    setChatList((prev) =>
      prev.map((c) =>
        c.id === selectedChat.id ? { ...c, title: newTitle.trim() } : c
      )
    );
  };

  const handleDeleteChat = () => {
    if (!selectedChat) return;
    setChatList((prev) => {
      const idx = prev.findIndex((c) => c.id === selectedChat.id);
      const next = prev.filter((c) => c.id !== selectedChat.id);
      const fallback = next[idx] ?? next[idx - 1] ?? next[0] ?? null;
      setSelectedChatId(fallback?.id ?? "");
      return next;
    });
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: selectedDoc?.placeholder ?? "Start writing...",
      }),
    ],
    content: selectedDoc?.content ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none min-h-[400px]",
      },
    },
  });

  useEffect(() => {
    if (editor && selectedDoc) {
      editor.commands.setContent(selectedDoc.content);
    }
  }, [editor, selectedDocId]);

  if (navCollapsed) {
    return (
      <div className="h-screen max-h-screen w-full overflow-hidden flex">
        <div className="w-[52px] min-w-[52px] max-w-[52px] shrink-0 h-full border-r-[1px] border-solid border-border">
          <TooltipProvider delayDuration={0}>
            <div className="h-full w-full flex flex-col bg-background">
              <div className="p-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleNav}>
                      <PanelLeft className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Expand sidebar</TooltipContent>
                </Tooltip>
              </div>

              <div className="px-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Plus className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">New Trip</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex-1" />

              <div className="p-2">
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent
                    side="right"
                    align="end"
                    className="w-40"
                  >
                    <DropdownMenuLabel>Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Scale</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                          value={uiScale}
                          onValueChange={(v) => setUiScale(v as UIScale)}
                        >
                          {UI_SCALES.map((scale) => (
                            <DropdownMenuRadioItem
                              key={scale}
                              value={scale}
                              onSelect={(e) => e.preventDefault()}
                            >
                              {scale}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Color mode
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                          value={theme}
                          onValueChange={setTheme}
                        >
                          <DropdownMenuRadioItem
                            value="light"
                            onSelect={(e) => e.preventDefault()}
                          >
                            Light
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem
                            value="dark"
                            onSelect={(e) => e.preventDefault()}
                          >
                            Dark
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem
                            value="system"
                            onSelect={(e) => e.preventDefault()}
                          >
                            System
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </TooltipProvider>
        </div>

        <div className="flex-1 h-full overflow-hidden">
          <div className="h-full flex flex-col overflow-hidden">
            <div className="px-4 py-2 flex items-center gap-3 border-b shrink-0">
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="flex-1 text-base font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground/50 leading-none"
                placeholder="Untitled Trip"
              />
              <div className="flex items-center gap-1 shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="size-4" />
                      Rename Trip
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="size-4" />
                      Trip Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="size-4" />
                      Delete Trip
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <ResizablePanelGroup
              direction="horizontal"
              className="flex-1 min-h-0 overflow-hidden"
            >
              <ResizablePanel
                defaultSize={100 - CHAT_DEFAULT_SIZE}
                minSize={30}
                className="overflow-hidden"
              >
                <div className="h-full flex flex-col">
                  {viewState === "list" ? (
                    <>
                      <div className="px-4 py-2 border-b shrink-0 flex items-center justify-between">
                        <Popover
                          open={openViewPicker}
                          onOpenChange={setOpenViewPicker}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              role="combobox"
                              aria-expanded={openViewPicker}
                            >
                              <span className="truncate">
                                {activeView === "plans" ? "Plans" : "Sources"}
                              </span>
                              <ChevronDown className="opacity-50 shrink-0" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[--radix-popover-trigger-width] p-0"
                            align="start"
                          >
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  <CommandItem
                                    value="plans"
                                    onSelect={() => {
                                      setActiveView("plans");
                                      setOpenViewPicker(false);
                                    }}
                                  >
                                    Plans
                                  </CommandItem>
                                  <CommandItem
                                    value="sources"
                                    onSelect={() => {
                                      setActiveView("sources");
                                      setOpenViewPicker(false);
                                    }}
                                  >
                                    Sources
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <Button variant="ghost" onClick={handleNewDocClick}>
                          <Plus className="size-4" />
                          New
                        </Button>
                      </div>

                      <ScrollArea className="flex-1 min-h-0">
                        <div className="p-4">
                          <ScrollArea className="flex-1 min-h-0">
                            <div className="p-0">
                              {visibleDocs.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                  {activeView === "plans"
                                    ? "No plans yet"
                                    : "No sources yet"}
                                </div>
                              ) : (
                                <ItemGroup className="grid grid-cols-2 gap-3">
                                  {visibleDocs.map((item) => (
                                    <React.Fragment key={item.id}>
                                      <Item
                                        variant="muted"
                                        className="bg-muted/70"
                                        asChild
                                      >
                                        <a
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleDocCardClick(item.id);
                                          }}
                                        >
                                          <ItemContent className="gap-1">
                                            <ItemTitle className="line-clamp-1">
                                              {item.name}
                                            </ItemTitle>
                                            {item.subtitle && (
                                              <ItemDescription>
                                                {item.subtitle}
                                              </ItemDescription>
                                            )}
                                          </ItemContent>
                                        </a>
                                      </Item>
                                    </React.Fragment>
                                  ))}
                                </ItemGroup>
                              )}
                            </div>
                          </ScrollArea>
                        </div>
                      </ScrollArea>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 flex items-center justify-between border-b shrink-0">
                        <Breadcrumb>
                          <BreadcrumbList>
                            <BreadcrumbItem>
                              <BreadcrumbLink
                                className="cursor-pointer font-medium"
                                onClick={handleDocBack}
                              >
                                {activeView === "plans" ? "Plans" : "Sources"}
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              <BreadcrumbPage className="font-medium">
                                {selectedDoc?.name || "Untitled"}
                              </BreadcrumbPage>
                            </BreadcrumbItem>
                          </BreadcrumbList>
                        </Breadcrumb>

                        <AlertDialog
                          open={openDeleteDocDialog}
                          onOpenChange={setOpenDeleteDocDialog}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="size-4" />
                                  Delete…
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete "{selectedDoc?.name || "Untitled"}"?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  deleteSelectedDoc();
                                  setOpenDeleteDocDialog(false);
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      <ScrollArea className="flex-1 min-h-0">
                        <div className="p-4">
                          {selectedDoc && (
                            <>
                              <input
                                type="text"
                                value={selectedDoc.name}
                                onChange={(e) =>
                                  handleDocNameChange(e.target.value)
                                }
                                className="w-full text-2xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 mb-3"
                                placeholder="Untitled"
                              />
                              <div className="px-0 py-0">
                                <EditorContent editor={editor} />
                              </div>
                            </>
                          )}
                        </div>
                      </ScrollArea>
                    </>
                  )}
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel
                defaultSize={CHAT_DEFAULT_SIZE}
                minSize={CHAT_MIN_SIZE}
                maxSize={CHAT_MAX_SIZE}
                className="overflow-hidden"
              >
                <div className="h-full flex flex-col overflow-hidden">
                  <div className="px-4 py-2 flex items-center justify-between whitespace-nowrap">
                    <Popover
                      open={openChatPicker}
                      onOpenChange={setOpenChatPicker}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          role="combobox"
                          aria-expanded={openChatPicker}
                        >
                          <span className="truncate">
                            {selectedChat?.title ?? "Select chat..."}
                          </span>
                          <ChevronDown className="opacity-50 shrink-0" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[--radix-popover-trigger-width] p-0"
                        align="start"
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search chats..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No chats found.</CommandEmpty>
                            <CommandGroup>
                              {chatList.map((chat) => (
                                <CommandItem
                                  key={chat.id}
                                  value={chat.title}
                                  onSelect={() => {
                                    setSelectedChatId(chat.id);
                                    setOpenChatPicker(false);
                                  }}
                                >
                                  {chat.title}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        onClick={handleNewChat}
                        className="shrink-0"
                      >
                        <Plus className="size-4" />
                        New
                      </Button>

                      <AlertDialog
                        open={openDeleteChatDialog}
                        onOpenChange={setOpenDeleteChatDialog}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleRenameChat}>
                              <Pencil className="size-4" />
                              Rename
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="size-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete "{selectedChat?.title ?? "Untitled"}"?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete this chat and all its messages.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                handleDeleteChat();
                                setOpenDeleteChatDialog(false);
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <Separator />

                  <ScrollArea className="flex-1 min-h-0">
                    <div className="p-4 space-y-4">
                      {selectedChat?.messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          )}
                        >
                          {message.role === "user" ? (
                            <Item
                              variant="muted"
                              size="sm"
                              className="w-fit whitespace-pre-wrap bg-muted/70 font-medium max-w-[90%]"
                            >
                              {message.content}
                            </Item>
                          ) : (
                            <div className="text-sm text-foreground">
                              <p className="whitespace-pre-wrap">
                                {message.content}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Separator />

                  <div className="px-4 py-3 shrink-0">
                    <div className="flex items-end gap-2">
                      <Textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a message..."
                        className="rounded-[0px] min-h-[104px] max-h-[200px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 text-sm!"
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
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="!h-screen max-h-screen w-full overflow-hidden"
    >
      <ResizablePanel
        defaultSize={lastExpandedNavSize}
        minSize={NAV_MIN_SIZE}
        maxSize={NAV_MAX_SIZE}
        className="overflow-hidden"
        onResize={(size) => {
          setLastExpandedNavSize(size);
        }}
      >
        <div className="h-full flex flex-col bg-background">
          <div className="px-2 py-2 flex items-center gap-1">
            <Link
              to="/prototype-v5"
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent flex-1"
            >
              <KiwiLogo className="size-6" />
              <span className="font-semibold text-base">Trip Kiwi</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleNav}>
              <PanelLeftClose className="size-4" />
            </Button>
          </div>

          <div className="px-2">
            <Button
              variant="ghost"
              className="w-full justify-start h-9 font-medium"
              asChild
            >
              <Link to="/prototype-v5">
                <Plus className="size-4 mr-2" />
                <span>New Trip</span>
              </Link>
            </Button>
          </div>

          <div className="flex-1 min-h-0 overflow-auto px-2 pt-4">
            <div className="text-xs font-medium text-muted-foreground px-2 pb-2">
              My Trips
            </div>
            <div className="space-y-0.5">
              {trips.map((trip) => (
                <Button
                  key={trip.id}
                  variant={trip.id === "1" ? "secondary" : "ghost"}
                  className="w-full justify-start h-9 font-medium"
                  asChild
                >
                  <Link to="/prototype-v5">{trip.name}</Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="p-2 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 font-medium"
                >
                  <Settings className="size-4 mr-2" />
                  <span>Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-40">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Scale</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={uiScale}
                      onValueChange={(v) => setUiScale(v as UIScale)}
                    >
                      {UI_SCALES.map((scale) => (
                        <DropdownMenuRadioItem
                          key={scale}
                          value={scale}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {scale}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Color mode</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={theme}
                      onValueChange={setTheme}
                    >
                      <DropdownMenuRadioItem
                        value="light"
                        onSelect={(e) => e.preventDefault()}
                      >
                        Light
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="dark"
                        onSelect={(e) => e.preventDefault()}
                      >
                        Dark
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="system"
                        onSelect={(e) => e.preventDefault()}
                      >
                        System
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        defaultSize={100 - lastExpandedNavSize}
        minSize={50}
        className="overflow-hidden"
      >
        <div className="h-full flex flex-col overflow-hidden">
          <div className="px-4 py-2 flex items-center gap-3 border-b shrink-0">
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="flex-1 text-base font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground/50 leading-none"
              placeholder="Untitled Trip"
            />
            <div className="flex items-center gap-1 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pencil className="size-4" />
                    Rename Trip
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="size-4" />
                    Trip Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="size-4" />
                    Delete Trip
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <ResizablePanelGroup
            direction="horizontal"
            className="flex-1 min-h-0 overflow-hidden"
          >
            <ResizablePanel
              defaultSize={100 - CHAT_DEFAULT_SIZE}
              minSize={30}
              className="overflow-hidden"
            >
              <div className="h-full flex flex-col">
                {viewState === "list" ? (
                  <>
                    <div className="px-4 py-2 border-b shrink-0 flex items-center justify-between">
                      <Popover
                        open={openViewPicker}
                        onOpenChange={setOpenViewPicker}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={openViewPicker}
                          >
                            <span className="truncate">
                              {activeView === "plans" ? "Plans" : "Sources"}
                            </span>
                            <ChevronDown className="opacity-50 shrink-0" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] p-0"
                          align="start"
                        >
                          <Command>
                            <CommandList>
                              <CommandGroup>
                                <CommandItem
                                  value="plans"
                                  onSelect={() => {
                                    setActiveView("plans");
                                    setOpenViewPicker(false);
                                  }}
                                >
                                  Plans
                                </CommandItem>
                                <CommandItem
                                  value="sources"
                                  onSelect={() => {
                                    setActiveView("sources");
                                    setOpenViewPicker(false);
                                  }}
                                >
                                  Sources
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <Button variant="ghost" onClick={handleNewDocClick}>
                        <Plus className="size-4" />
                        New
                      </Button>
                    </div>

                    <ScrollArea className="flex-1 min-h-0">
                      <div className="p-4">
                        <ScrollArea className="flex-1 min-h-0">
                          <div className="p-0">
                            {visibleDocs.length === 0 ? (
                              <div className="text-center py-12 text-muted-foreground">
                                {activeView === "plans"
                                  ? "No plans yet"
                                  : "No sources yet"}
                              </div>
                            ) : (
                              <ItemGroup className="grid grid-cols-2 gap-3">
                                {visibleDocs.map((item) => (
                                  <React.Fragment key={item.id}>
                                    <Item
                                      variant="muted"
                                      className="bg-muted/70"
                                      asChild
                                    >
                                      <a
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDocCardClick(item.id);
                                        }}
                                      >
                                        <ItemContent className="gap-1">
                                          <ItemTitle className="line-clamp-1">
                                            {item.name}
                                          </ItemTitle>
                                          {item.subtitle && (
                                            <ItemDescription>
                                              {item.subtitle}
                                            </ItemDescription>
                                          )}
                                        </ItemContent>
                                      </a>
                                    </Item>
                                  </React.Fragment>
                                ))}
                              </ItemGroup>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </ScrollArea>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 flex items-center justify-between border-b shrink-0">
                      <Breadcrumb>
                        <BreadcrumbList>
                          <BreadcrumbItem>
                            <BreadcrumbLink
                              className="cursor-pointer font-medium"
                              onClick={handleDocBack}
                            >
                              {activeView === "plans" ? "Plans" : "Sources"}
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium">
                              {selectedDoc?.name || "Untitled"}
                            </BreadcrumbPage>
                          </BreadcrumbItem>
                        </BreadcrumbList>
                      </Breadcrumb>

                      <AlertDialog
                        open={openDeleteDocDialog}
                        onOpenChange={setOpenDeleteDocDialog}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="size-4" />
                                Delete…
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete "{selectedDoc?.name || "Untitled"}"?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                deleteSelectedDoc();
                                setOpenDeleteDocDialog(false);
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <ScrollArea className="flex-1 min-h-0">
                      <div className="p-4">
                        {selectedDoc && (
                          <>
                            <input
                              type="text"
                              value={selectedDoc.name}
                              onChange={(e) =>
                                handleDocNameChange(e.target.value)
                              }
                              className="w-full text-2xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 mb-3"
                              placeholder="Untitled"
                            />
                            <div className="px-0 py-0">
                              <EditorContent editor={editor} />
                            </div>
                          </>
                        )}
                      </div>
                    </ScrollArea>
                  </>
                )}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel
              defaultSize={CHAT_DEFAULT_SIZE}
              minSize={CHAT_MIN_SIZE}
              maxSize={CHAT_MAX_SIZE}
              className="overflow-hidden"
            >
              <div className="h-full flex flex-col overflow-hidden">
                <div className="px-4 py-2 flex items-center justify-between whitespace-nowrap">
                  <Popover
                    open={openChatPicker}
                    onOpenChange={setOpenChatPicker}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={openChatPicker}
                      >
                        <span className="truncate">
                          {selectedChat?.title ?? "Select chat..."}
                        </span>
                        <ChevronDown className="opacity-50 shrink-0" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[--radix-popover-trigger-width] p-0"
                      align="start"
                    >
                      <Command>
                        <CommandInput
                          placeholder="Search chats..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No chats found.</CommandEmpty>
                          <CommandGroup>
                            {chatList.map((chat) => (
                              <CommandItem
                                key={chat.id}
                                value={chat.title}
                                onSelect={() => {
                                  setSelectedChatId(chat.id);
                                  setOpenChatPicker(false);
                                }}
                              >
                                {chat.title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      onClick={handleNewChat}
                      className="shrink-0"
                    >
                      <Plus className="size-4" />
                      New
                    </Button>

                    <AlertDialog
                      open={openDeleteChatDialog}
                      onOpenChange={setOpenDeleteChatDialog}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleRenameChat}>
                            <Pencil className="size-4" />
                            Rename
                          </DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete "{selectedChat?.title ?? "Untitled"}"?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this chat and all its messages.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDeleteChat();
                              setOpenDeleteChatDialog(false);
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <Separator />

                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 space-y-4">
                    {selectedChat?.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        {message.role === "user" ? (
                          <Item
                            variant="muted"
                            size="sm"
                            className="w-fit whitespace-pre-wrap bg-muted/70 font-medium max-w-[90%]"
                          >
                            {message.content}
                          </Item>
                        ) : (
                          <div className="text-sm text-foreground">
                            <p className="whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator />

                <div className="px-4 py-3 shrink-0">
                  <div className="flex items-end gap-2">
                    <Textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      className="rounded-[0px] min-h-[104px] max-h-[200px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 text-sm!"
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
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
