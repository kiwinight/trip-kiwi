import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { Link } from "react-router";
import {
  Settings,
  Plus,
  Send,
  MoreHorizontal,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  Paperclip,
  Video,
  FileText,
  Image,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  ScrollText,
  MapIcon,
  Check,
  Eraser,
} from "lucide-react";
import {
  useEditor,
  EditorContent,
  ReactRenderer,
  Node,
  mergeAttributes,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Suggestion, { type SuggestionProps } from "@tiptap/suggestion";
import {
  KiwiLogo,
  Button,
  Textarea,
  ScrollArea,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  Separator,
  Badge,
  useTheme,
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "~/components/ui";
import { cn } from "~/libs/utils";

// =============================================================================
// Types
// =============================================================================

type ClipType = "video" | "message" | "article" | "image" | "text";

type Clip = {
  id: string;
  planId: string;
  type: ClipType;
  title: string;
  sourceUrl?: string;
  rawContent: string;
  extractedSummary: string;
  extractedItems: string[];
  createdAt: Date;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Plan = {
  id: string;
  title: string;
  content: string;
  clips: Clip[];
  messages: ChatMessage[];
  createdAt: Date;
};

type CentralView = "plan" | "map" | "clips";

// =============================================================================
// ClipReference Extension
// =============================================================================

// Suggestion list component for clip selection
type ClipSuggestionListProps = {
  items: Clip[];
  command: (props: { id: string; title: string }) => void;
};

type ClipSuggestionListRef = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

const ClipSuggestionList = forwardRef<
  ClipSuggestionListRef,
  ClipSuggestionListProps
>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.id, title: item.title });
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex(
          (selectedIndex + props.items.length - 1) % props.items.length
        );
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  if (props.items.length === 0) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-2 text-sm text-muted-foreground">
        No clips found
      </div>
    );
  }

  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-1 min-w-[200px] max-w-[300px]">
      {props.items.map((item, index) => (
        <button
          key={item.id}
          className={cn(
            "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded text-left",
            index === selectedIndex
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50"
          )}
          onClick={() => selectItem(index)}
        >
          <Paperclip className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{item.title}</span>
        </button>
      ))}
    </div>
  );
});
ClipSuggestionList.displayName = "ClipSuggestionList";

// Create ClipReference extension factory
const createClipReferenceExtension = (
  getClips: () => Clip[],
  onClipClick?: (clipId: string) => void
) => {
  return Node.create({
    name: "clipReference",
    group: "inline",
    inline: true,
    selectable: true,
    atom: true,

    addAttributes() {
      return {
        id: { default: null },
        title: { default: null },
      };
    },

    parseHTML() {
      return [{ tag: "span[data-clip-reference]" }];
    },

    renderHTML({ node, HTMLAttributes }) {
      return [
        "span",
        mergeAttributes(HTMLAttributes, {
          "data-clip-reference": "",
          class: "clip-reference-chip",
        }),
        `📎 ${node.attrs.title}`,
      ];
    },

    addNodeView() {
      return ({ node }) => {
        const dom = document.createElement("span");
        dom.className =
          "inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 bg-accent text-accent-foreground text-sm rounded cursor-pointer hover:bg-accent/80 transition-colors";
        dom.setAttribute("data-clip-reference", "");
        dom.setAttribute("data-clip-id", node.attrs.id);
        dom.contentEditable = "false";
        dom.innerHTML = `<span class="text-xs">📎</span><span>${node.attrs.title}</span>`;
        dom.addEventListener("click", () => {
          if (onClipClick) {
            onClipClick(node.attrs.id);
          }
        });
        return { dom };
      };
    },

    addProseMirrorPlugins() {
      const extension = this;
      return [
        Suggestion({
          editor: this.editor,
          char: "[[",
          allowSpaces: true,
          startOfLine: false,
          command: ({ editor, range, props }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent([
                {
                  type: extension.name,
                  attrs: { id: props.id, title: props.title },
                },
                { type: "text", text: " " },
              ])
              .run();
          },
          items: ({ query }) => {
            // Use getClips() to always get current clips
            return getClips()
              .filter((clip) =>
                clip.title.toLowerCase().includes(query.toLowerCase())
              )
              .slice(0, 5);
          },
          render: () => {
            let component: ReactRenderer<ClipSuggestionListRef> | null = null;
            let popup: HTMLDivElement | null = null;

            return {
              onStart: (props: SuggestionProps<Clip>) => {
                component = new ReactRenderer(ClipSuggestionList, {
                  props: {
                    items: props.items,
                    command: props.command,
                  },
                  editor: props.editor,
                });

                popup = document.createElement("div");
                popup.style.position = "absolute";
                popup.style.zIndex = "50";
                document.body.appendChild(popup);
                popup.appendChild(component.element);

                const { left, top, height } = props.clientRect?.() ?? {
                  left: 0,
                  top: 0,
                  height: 0,
                };
                popup.style.left = `${left}px`;
                popup.style.top = `${top + height}px`;
              },

              onUpdate: (props: SuggestionProps<Clip>) => {
                component?.updateProps({
                  items: props.items,
                  command: props.command,
                });

                if (popup) {
                  const { left, top, height } = props.clientRect?.() ?? {
                    left: 0,
                    top: 0,
                    height: 0,
                  };
                  popup.style.left = `${left}px`;
                  popup.style.top = `${top + height}px`;
                }
              },

              onKeyDown: (props: { event: KeyboardEvent }) => {
                if (props.event.key === "Escape") {
                  popup?.remove();
                  component?.destroy();
                  return true;
                }
                return component?.ref?.onKeyDown(props) ?? false;
              },

              onExit: () => {
                popup?.remove();
                component?.destroy();
              },
            };
          },
        }),
      ];
    },
  });
};

// =============================================================================
// Mock Data
// =============================================================================

const createMockClips = (planId: string): Clip[] => {
  if (planId === "1") {
    return [
      {
        id: "clip-1",
        planId: "1",
        type: "video",
        title: "128-Year-Old Beef Noodle Shop",
        sourceUrl: "https://youtube.com/watch?v=abc123",
        rawContent: "YouTube video about traditional Taipei restaurants...",
        extractedSummary:
          "A documentary about historic food spots in Taipei, featuring several must-visit restaurants.",
        extractedItems: [
          "金春發 beef noodle (128 years old)",
          "御廚巨籠宴 - famous dumplings",
          "香辣燒鍋 - spicy hotpot",
          "阿宗麵線 - vermicelli",
        ],
        createdAt: new Date("2024-12-15T10:30:00"),
      },
      {
        id: "clip-2",
        planId: "1",
        type: "message",
        title: "Airbnb: 3F Ocean View Room",
        rawContent:
          "謝謝您的詢問，以下的備註請一定要幫我閱讀完成喔，謝謝。三樓房間介紹：3層 객실 안내: 兩分鐘就可以走到沙灘的海邊房子...",
        extractedSummary:
          "Airbnb host message with check-in details and house rules for a beachfront room in Kenting.",
        extractedItems: [
          "2 min walk to beach",
          "Check-in: 3PM",
          "No shoes inside",
          "Bathroom has open design (no door)",
          "Extra mattress: +$600/each",
          "Pet fee: $500 cleaning",
        ],
        createdAt: new Date("2024-12-15T14:20:00"),
      },
      {
        id: "clip-3",
        planId: "1",
        type: "article",
        title: "Night Markets Guide",
        sourceUrl: "https://blog.example.com/taipei-night-markets",
        rawContent: "The ultimate guide to Taipei's best night markets...",
        extractedSummary:
          "Comprehensive blog post covering the top night markets in Taipei with food recommendations.",
        extractedItems: [
          "Shilin - largest, most famous",
          "Raohe - best pepper buns",
          "Ningxia - local favorite",
          "Tonghua - less touristy",
        ],
        createdAt: new Date("2024-12-14T09:15:00"),
      },
    ];
  }
  return [];
};

const createMockMessages = (planId: string): ChatMessage[] => {
  if (planId === "1") {
    return [
      {
        id: "msg-1",
        role: "user",
        content: "I want to plan 3 days in Taipei",
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "Great choice! Taipei is amazing. Here's a suggested outline:\n\n**Day 1**: Taipei 101, Din Tai Fung, Elephant Mountain\n**Day 2**: National Palace Museum, Beitou Hot Springs\n**Day 3**: Jiufen day trip\n\nWant me to add details to your plan?",
      },
      {
        id: "msg-3",
        role: "user",
        content: "Yes, start with Day 1",
      },
      {
        id: "msg-4",
        role: "assistant",
        content:
          "Done! I've added Day 1 to your plan with:\n\n• 09:00 - Taipei 101 Observatory\n• 12:00 - Din Tai Fung (original Xinyi location)\n• 14:30 - Elephant Mountain hike\n• 18:00 - Shilin Night Market\n\n✅ Plan updated",
      },
    ];
  }
  if (planId === "2") {
    return [
      {
        id: "msg-1",
        role: "user",
        content: "Planning a Tokyo trip for spring 2025",
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "Spring is perfect for Tokyo! Cherry blossom season is typically late March to early April. What dates are you considering?",
      },
    ];
  }
  return [];
};

const initialPlans: Plan[] = [
  {
    id: "1",
    title: "Taipei Trip",
    content: `
      <h2>Day 1 — Monday, Dec 15</h2>
      
      <h3>09:00 · Taipei 101</h3>
      <p>Visit the observatory deck for city views. Book tickets online to skip the line.</p>
      <p>📍 Xinyi District</p>
      
      <h3>12:00 · Din Tai Fung</h3>
      <p>Lunch at the original Xinyi location. Must try: Xiaolongbao, truffle dumplings.</p>
      <p>🍜 Expect 20-30 min wait</p>
      
      <h3>14:30 · Elephant Mountain</h3>
      <p>Short hike (30 min up). Best photos of Taipei 101 from the top.</p>
      <p>💡 Go before sunset for golden hour</p>
      
      <h3>18:00 · Shilin Night Market</h3>
      <p>Dinner and explore. Try oyster omelette, stinky tofu, and papaya milk.</p>
      
      <h2>Day 2 — Tuesday, Dec 16</h2>
      
      <h3>08:00 · Yongkang Street</h3>
      <p>Traditional Taiwanese breakfast. Try soy milk, shaobing, dan bing.</p>
      
      <h3>10:00 · National Palace Museum</h3>
      <p>One of the world's largest collections of Chinese art. Plan for 3-4 hours.</p>
    `,
    clips: [],
    messages: [],
    createdAt: new Date("2024-12-10"),
  },
  {
    id: "2",
    title: "Tokyo 2025",
    content: `
      <h2>Planning Notes</h2>
      <p>Spring trip to Tokyo. Target: late March for cherry blossoms.</p>
      
      <h3>Must-see spots</h3>
      <ul>
        <li>Shinjuku Gyoen (cherry blossoms)</li>
        <li>Senso-ji Temple</li>
        <li>Shibuya Crossing</li>
        <li>Tsukiji Outer Market</li>
      </ul>
    `,
    clips: [],
    messages: [],
    createdAt: new Date("2024-12-12"),
  },
  {
    id: "3",
    title: "Seoul Food Tour",
    content: `
      <h2>Food Goals</h2>
      <ul>
        <li>Korean BBQ in Hongdae</li>
        <li>Street food in Myeongdong</li>
        <li>Traditional bibimbap</li>
        <li>Gwangjang Market</li>
      </ul>
    `,
    clips: [],
    messages: [],
    createdAt: new Date("2024-12-14"),
  },
];

// Initialize plans with their clips and messages
initialPlans.forEach((plan) => {
  plan.clips = createMockClips(plan.id);
  plan.messages = createMockMessages(plan.id);
});

// =============================================================================
// Constants
// =============================================================================

const NAV_DEFAULT_SIZE = 18;
const NAV_MIN_SIZE = 14;
const NAV_MAX_SIZE = 28;
const CHAT_DEFAULT_SIZE = 35;
const CHAT_MIN_SIZE = 25;
const CHAT_MAX_SIZE = 50;

const UI_SCALES = ["90%", "95%", "100%", "105%", "110%"] as const;
type UIScale = (typeof UI_SCALES)[number];

// =============================================================================
// Helper Components
// =============================================================================

function ClipTypeIcon({
  type,
  className,
}: {
  type: ClipType;
  className?: string;
}) {
  const iconClass = cn("size-4", className);
  switch (type) {
    case "video":
      return <Video className={iconClass} />;
    case "message":
      return <MessageSquare className={iconClass} />;
    case "article":
      return <FileText className={iconClass} />;
    case "image":
      return <Image className={iconClass} />;
    case "text":
      return <MessageSquare className={iconClass} />;
  }
}

function ClipTypeBadge({ type }: { type: ClipType }) {
  const labels: Record<ClipType, string> = {
    video: "Video",
    message: "Message",
    article: "Article",
    image: "Image",
    text: "Text",
  };
  return (
    <Badge variant="secondary" className="text-xs">
      {labels[type]}
    </Badge>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// =============================================================================
// View Switcher Dropdown
// =============================================================================

type ViewOption = {
  value: CentralView;
  label: string;
  icon: React.ReactNode;
};

function ViewSwitcherDropdown({
  currentView,
  onViewChange,
  clipsCount,
}: {
  currentView: CentralView;
  onViewChange: (view: CentralView) => void;
  clipsCount: number;
}) {
  const viewOptions: ViewOption[] = [
    {
      value: "plan",
      label: "Plan",
      icon: <ScrollText className="size-4" />,
    },
    {
      value: "map",
      label: "Map",
      icon: <MapIcon className="size-4" />,
    },
    {
      value: "clips",
      label: "Clips",
      icon: <Paperclip className="size-4" />,
    },
  ];

  const currentOption = viewOptions.find((opt) => opt.value === currentView);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-1">
          {currentOption?.icon}
          {currentOption?.label}
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {viewOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onViewChange(option.value)}
            className="gap-2"
          >
            {option.icon}
            <span className="flex-1">{option.label}</span>
            {option.value === "clips" && clipsCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {clipsCount}
              </Badge>
            )}
            {option.value === currentView && (
              <Check className="size-4 text-muted-foreground" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// =============================================================================
// Clips List Component
// =============================================================================

function ClipsList({
  clips,
  onSelectClip,
}: {
  clips: Clip[];
  onSelectClip: (clipId: string) => void;
}) {
  if (clips.length === 0) {
    return (
      <Empty className="border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Paperclip />
          </EmptyMedia>
          <EmptyTitle>No clips yet</EmptyTitle>
          <EmptyDescription>
            Paste content into the chat to capture it
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="p-4">
        <div className="space-y-2">
          {clips.map((clip) => (
            <Item
              key={clip.id}
              variant="muted"
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onSelectClip(clip.id)}
            >
              <ItemContent className="flex-row items-center gap-3">
                <div className="p-2 rounded-md bg-background">
                  <ClipTypeIcon type={clip.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <ItemTitle className="line-clamp-1">{clip.title}</ItemTitle>
                  <ItemDescription className="line-clamp-1">
                    {clip.extractedItems.length > 0
                      ? `${clip.extractedItems.length} items extracted`
                      : clip.extractedSummary.slice(0, 60) + "..."}
                  </ItemDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(clip.createdAt)}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </ItemContent>
            </Item>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

// =============================================================================
// Clip Detail Component with TipTap Editor
// =============================================================================

function ClipDetail({
  clip,
  onUpdateClip,
  onAddToPlan,
}: {
  clip: Clip;
  onUpdateClip: (clipId: string, updates: Partial<Clip>) => void;
  onAddToPlan: (clip: Clip) => void;
}) {
  // Convert clip content to HTML for the editor
  const getClipContent = () => {
    let content = "";
    if (clip.extractedSummary) {
      content += `<p>${clip.extractedSummary}</p>`;
    }
    if (clip.extractedItems.length > 0) {
      content += "<ul>";
      clip.extractedItems.forEach((item) => {
        content += `<li>${item}</li>`;
      });
      content += "</ul>";
    }
    return content || "<p></p>";
  };

  const clipEditor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Add notes about this clip...",
      }),
    ],
    content: getClipContent(),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none min-h-[200px]",
      },
    },
    onUpdate: ({ editor }) => {
      // Update the clip's extractedSummary with the editor content
      onUpdateClip(clip.id, { extractedSummary: editor.getHTML() });
    },
  });

  // Sync editor when clip changes
  useEffect(() => {
    if (clipEditor) {
      clipEditor.commands.setContent(getClipContent());
    }
  }, [clip.id]);

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="px-4 py-8 max-w-[42.5rem] mx-auto">
        <input
          type="text"
          value={clip.title}
          onChange={(e) => onUpdateClip(clip.id, { title: e.target.value })}
          className="w-full text-xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 mb-0"
          placeholder="Untitled Clip"
        />
        <EditorContent editor={clipEditor} />
      </div>
    </ScrollArea>
  );
}

// =============================================================================
// Suggested Chips
// =============================================================================

function SuggestedChips({
  visible,
  onChipClick,
}: {
  visible: boolean;
  onChipClick: (chip: string) => void;
}) {
  if (!visible) return null;

  const chips = [
    "Organize my edits",
    "Check for conflicts",
    "Continue planning",
  ];

  return (
    <>
      <Separator />
      <div className="flex flex-wrap gap-2 px-4 py-3">
        {chips.map((chip) => (
          <Button
            key={chip}
            variant="secondary"
            // size="sm"
            // className="text-xs h-7"
            onClick={() => onChipClick(chip)}
          >
            {chip}
          </Button>
        ))}
      </div>
    </>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function meta() {
  return [
    { title: "Prototype V6 - Trip Kiwi" },
    { name: "description", content: "Simplified travel planning prototype" },
  ];
}

export default function PrototypeV6Route() {
  const { theme, setTheme } = useTheme();

  // Navigation state
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [lastExpandedNavSize, setLastExpandedNavSize] =
    useState(NAV_DEFAULT_SIZE);
  const [uiScale, setUiScale] = useState<UIScale>("100%");

  // Plans state
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id);
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  // Central panel view state
  const [centralView, setCentralView] = useState<CentralView>("plan");
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const selectedClip = selectedPlan?.clips.find((c) => c.id === selectedClipId);

  // Editor state
  const [hasUnsavedEdits, setHasUnsavedEdits] = useState(false);
  const lastSavedContent = useRef(selectedPlan?.content ?? "");

  // Chat state
  const [chatInput, setChatInput] = useState("");

  // Dialog states
  const [openDeletePlanDialog, setOpenDeletePlanDialog] = useState(false);
  const [openDeleteChatDialog, setOpenDeleteChatDialog] = useState(false);
  const [openClearPlanDialog, setOpenClearNoteDialog] = useState(false);

  // Apply UI scale
  useEffect(() => {
    document.documentElement.style.fontSize = uiScale;
  }, [uiScale]);

  // Ref to always get current clips for the suggestion extension
  const clipsRef = useRef<Clip[]>(selectedPlan?.clips ?? []);
  useEffect(() => {
    clipsRef.current = selectedPlan?.clips ?? [];
  }, [selectedPlan?.clips]);

  // Handler for clicking clip references in the editor
  const handleEditorClipClick = useCallback((clipId: string) => {
    setSelectedClipId(clipId);
    setCentralView("clips");
  }, []);

  // TipTap editor for plan content
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Start planning your trip...",
      }),
      createClipReferenceExtension(
        () => clipsRef.current,
        handleEditorClipClick
      ),
    ],
    content: selectedPlan?.content ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none min-h-[400px]",
      },
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      if (newContent !== lastSavedContent.current) {
        setHasUnsavedEdits(true);
        // Update plan content
        setPlans((prev) =>
          prev.map((p) =>
            p.id === selectedPlanId ? { ...p, content: newContent } : p
          )
        );
      }
    },
  });

  // Sync editor content when plan changes
  useEffect(() => {
    if (editor && selectedPlan) {
      editor.commands.setContent(selectedPlan.content);
      lastSavedContent.current = selectedPlan.content;
      setHasUnsavedEdits(false);
    }
  }, [editor, selectedPlanId]);

  // Reset to editor view when plan changes
  useEffect(() => {
    setCentralView("plan");
    setSelectedClipId(null);
  }, [selectedPlanId]);

  // Handlers
  const toggleNav = () => setNavCollapsed((prev) => !prev);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setHasUnsavedEdits(false);
  };

  const handleNewPlan = () => {
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      title: "",
      content: "",
      clips: [],
      messages: [],
      createdAt: new Date(),
    };
    setPlans((prev) => [newPlan, ...prev]);
    setSelectedPlanId(newPlan.id);
  };

  const handleDeletePlan = () => {
    if (!selectedPlan) return;
    setPlans((prev) => {
      const filtered = prev.filter((p) => p.id !== selectedPlan.id);
      if (filtered.length > 0) {
        setSelectedPlanId(filtered[0].id);
      }
      return filtered;
    });
    setOpenDeletePlanDialog(false);
  };

  const handleClearPlan = () => {
    if (!selectedPlan || !editor) return;
    editor.commands.setContent("");
    setPlans((prev) =>
      prev.map((p) => (p.id === selectedPlanId ? { ...p, content: "" } : p))
    );
    setHasUnsavedEdits(false);
    lastSavedContent.current = "";
    setOpenClearNoteDialog(false);
  };

  const handleTitleChange = (newTitle: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === selectedPlanId ? { ...p, title: newTitle } : p))
    );
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedPlan) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: chatInput.trim(),
    };

    // Mock AI response
    const aiResponse: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: getMockResponse(chatInput.trim()),
    };

    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlanId
          ? { ...p, messages: [...p.messages, userMessage, aiResponse] }
          : p
      )
    );

    setChatInput("");
    setHasUnsavedEdits(false);
    lastSavedContent.current = selectedPlan.content;
  };

  const handleChipClick = (chip: string) => {
    setChatInput(chip);
    // Auto-send the chip message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: chip,
    };

    const aiResponse: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: getMockChipResponse(chip),
    };

    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlanId
          ? { ...p, messages: [...p.messages, userMessage, aiResponse] }
          : p
      )
    );

    setChatInput("");
    setHasUnsavedEdits(false);
    lastSavedContent.current = selectedPlan?.content ?? "";
  };

  const handleAddClip = () => {
    const newClip: Clip = {
      id: `clip-${Date.now()}`,
      planId: selectedPlanId,
      type: "text",
      title: "New Clip",
      rawContent: "Add your content here...",
      extractedSummary: "A new clip you created",
      extractedItems: [],
      createdAt: new Date(),
    };
    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlanId ? { ...p, clips: [newClip, ...p.clips] } : p
      )
    );
    // Navigate to the new clip
    setSelectedClipId(newClip.id);
  };

  const handleAddClipToPlan = (clip: Clip) => {
    if (!editor) return;

    // Insert clip content at the end
    const clipContent = `
      <h3>📎 ${clip.title}</h3>
      <ul>
        ${clip.extractedItems.map((item) => `<li>${item}</li>`).join("\n")}
      </ul>
    `;

    editor.commands.insertContent(clipContent);
    setHasUnsavedEdits(true);
    setCentralView("plan");
    setSelectedClipId(null);
  };

  const handleUpdateClip = (clipId: string, updates: Partial<Clip>) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlanId
          ? {
              ...p,
              clips: p.clips.map((c) =>
                c.id === clipId ? { ...c, ...updates } : c
              ),
            }
          : p
      )
    );
  };

  const handleDeleteClip = (clipId: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlanId
          ? { ...p, clips: p.clips.filter((c) => c.id !== clipId) }
          : p
      )
    );
    setSelectedClipId(null); // Go back to clips list
  };

  const handleDeleteChatHistory = () => {
    if (!selectedPlan) return;
    setPlans((prev) =>
      prev.map((p) => (p.id === selectedPlanId ? { ...p, messages: [] } : p))
    );
    setOpenDeleteChatDialog(false);
  };

  // Mock responses
  function getMockResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes("add") || lower.includes("include")) {
      return "Done! I've added that to your plan. ✅";
    }
    if (lower.includes("recommend") || lower.includes("suggest")) {
      return "Based on your plan, I'd recommend:\n\n• Arrive early to avoid crowds\n• Book reservations in advance\n• Check weather forecast for outdoor activities\n\nWant me to add any of these notes?";
    }
    if (lower.includes("how") || lower.includes("what")) {
      return "Great question! I'd be happy to help. Could you provide a bit more context about what you're looking for?";
    }
    return "Got it! Is there anything specific you'd like me to help with for your plan?";
  }

  function getMockChipResponse(chip: string): string {
    if (chip === "Organize my edits") {
      return "I've reviewed your recent edits. Your plan looks well-organized! I noticed you added some new activities. Would you like me to:\n\n• Adjust the timing between activities\n• Add travel time estimates\n• Suggest nearby alternatives\n\nLet me know!";
    }
    if (chip === "Check for conflicts") {
      return "I checked your plan for conflicts:\n\n✅ No timing overlaps found\n✅ All activities have reasonable gaps\n⚠️ Day 2 looks busy - you might want to move the museum to Day 3\n\nWant me to suggest adjustments?";
    }
    if (chip === "Continue planning") {
      return "Let's continue! Based on what you have so far, here are some suggestions for your next steps:\n\n• Add Day 3 activities\n• Include restaurant reservations\n• Plan transportation between locations\n\nWhat would you like to focus on?";
    }
    return "I'm here to help! What would you like to do next?";
  }

  // Settings dropdown content (shared between collapsed and expanded nav)
  const settingsDropdownContent = (
    <DropdownMenuContent side="top" align="start" className="w-40">
      <DropdownMenuLabel>Settings</DropdownMenuLabel>
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
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
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
  );

  // =============================================================================
  // Central Panel Header
  // =============================================================================

  const handleViewChange = (view: CentralView) => {
    setCentralView(view);
    setSelectedClipId(null);
  };

  const renderCentralPanelHeader = () => {
    // Clip detail view - 3 level breadcrumb
    if (centralView === "clips" && selectedClip) {
      return (
        <div className="px-4 py-2 flex items-center gap-3 border-b shrink-0">
          <div className="flex items-center flex-1">
            <Button
              variant="ghost"
              onClick={() => {
                setCentralView("plan");
                setSelectedClipId(null);
              }}
            >
              {selectedPlan?.title || "Untitled plan"}
            </Button>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <ViewSwitcherDropdown
              currentView={centralView}
              onViewChange={handleViewChange}
              clipsCount={selectedPlan?.clips.length ?? 0}
            />
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <Button variant="ghost">
              {truncateText(selectedClip.title, 25)}
            </Button>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              onClick={() => handleAddClipToPlan(selectedClip)}
            >
              <Plus className="size-4" />
              Add to plan
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleDeleteClip(selectedClip.id)}
                >
                  <Trash2 className="size-4" />
                  Delete clip
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      );
    }

    // Clips list view
    if (centralView === "clips") {
      return (
        <div className="px-4 py-2 flex items-center gap-3 border-b shrink-0">
          <div className="flex items-center flex-1">
            <Button variant="ghost" onClick={() => setCentralView("plan")}>
              {selectedPlan?.title || "Untitled plan"}
            </Button>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <ViewSwitcherDropdown
              currentView={centralView}
              onViewChange={handleViewChange}
              clipsCount={selectedPlan?.clips.length ?? 0}
            />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" onClick={handleAddClip}>
              <Plus className="size-4" />
              Add clip
            </Button>
            <AlertDialog
              open={openDeletePlanDialog}
              onOpenChange={setOpenDeletePlanDialog}
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
                      Delete plan
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete "{selectedPlan?.title}"?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePlan}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      );
    }

    // Plan or Map view - unified breadcrumb pattern
    return (
      <div className="px-4 py-2 flex items-center gap-3 border-b shrink-0">
        <div className="flex items-center flex-1">
          <Button variant="ghost">
            {selectedPlan?.title || "Untitled plan"}
          </Button>
          <ChevronRight className="size-3.5 text-muted-foreground" />
          <ViewSwitcherDropdown
            currentView={centralView}
            onViewChange={handleViewChange}
            clipsCount={selectedPlan?.clips.length ?? 0}
          />
        </div>
        {centralView === "plan" && (
          <div className="flex items-center gap-1 shrink-0">
            <AlertDialog
              open={openClearPlanDialog}
              onOpenChange={setOpenClearNoteDialog}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>
                      <Eraser className="size-4" />
                      Clear plan
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear plan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all content from this plan. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearPlan}>
                    Clear
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    );
  };

  // =============================================================================
  // Central Panel Content
  // =============================================================================

  const renderCentralPanelContent = () => {
    // Clip detail view
    if (centralView === "clips" && selectedClip) {
      return (
        <ClipDetail
          clip={selectedClip}
          onUpdateClip={handleUpdateClip}
          onAddToPlan={handleAddClipToPlan}
        />
      );
    }

    // Clips list view
    if (centralView === "clips") {
      return (
        <ClipsList
          clips={selectedPlan?.clips ?? []}
          onSelectClip={setSelectedClipId}
        />
      );
    }

    // Map view (placeholder)
    if (centralView === "map") {
      return (
        <Empty className="border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MapIcon />
            </EmptyMedia>
            <EmptyTitle>Map view coming soon</EmptyTitle>
          </EmptyHeader>
        </Empty>
      );
    }

    // Plan view (default)
    return (
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 py-8 max-w-[42.5rem] mx-auto">
          <input
            type="text"
            value={selectedPlan?.title ?? ""}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full text-xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 mb-0"
            placeholder="Untitled plan"
          />
          <EditorContent editor={editor} />
        </div>
      </ScrollArea>
    );
  };

  // =============================================================================
  // Chat Panel
  // =============================================================================

  const renderChatPanel = () => (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b shrink-0 flex items-center justify-between">
        <h2 className="font-medium text-sm">Chat</h2>
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
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="size-4" />
                  Delete chat history
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete chat history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all messages in this chat. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteChatHistory}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {selectedPlan?.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
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
                <div className="text-sm text-foreground max-w-[90%]">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <SuggestedChips visible={hasUnsavedEdits} onChipClick={handleChipClick} />
      <Separator />
      <div className="px-4 py-3 shrink-0">
        <div className="flex items-end gap-2">
          <Textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="rounded-[0px] min-h-[104px] max-h-[200px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 text-sm!"
          />
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            disabled={!chatInput.trim()}
            onClick={handleSendMessage}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // =============================================================================
  // Render: Collapsed Navigation
  // =============================================================================

  if (navCollapsed) {
    return (
      <div className="h-screen max-h-screen w-full overflow-hidden flex">
        {/* Collapsed sidebar */}
        <div className="group w-[52px] min-w-[52px] max-w-[52px] shrink-0 h-full border-r-[1px] border-solid border-border">
          <TooltipProvider delayDuration={0}>
            <div className="h-full w-full flex flex-col bg-background">
              <div className="p-2 flex flex-col gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="border-0"
                      onClick={toggleNav}
                    >
                      <KiwiLogo className="size-6 group-hover:hidden" />
                      <PanelLeft className="size-4 hidden group-hover:block" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Expand sidebar</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="border-0"
                      onClick={handleNewPlan}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">New plan</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex-1" />

              <div className="p-2">
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="border-0"
                        >
                          <Settings className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                  </Tooltip>
                  {settingsDropdownContent}
                </DropdownMenu>
              </div>
            </div>
          </TooltipProvider>
        </div>

        {/* Main content area */}
        <div className="flex-1 h-full overflow-hidden">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full overflow-hidden"
          >
            {/* Central Panel */}
            <ResizablePanel
              defaultSize={100 - CHAT_DEFAULT_SIZE}
              minSize={30}
              className="overflow-hidden"
            >
              <div className="h-full flex flex-col">
                {renderCentralPanelHeader()}
                {renderCentralPanelContent()}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Chat Panel */}
            <ResizablePanel
              defaultSize={CHAT_DEFAULT_SIZE}
              minSize={CHAT_MIN_SIZE}
              maxSize={CHAT_MAX_SIZE}
              className="overflow-hidden"
            >
              {renderChatPanel()}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    );
  }

  // =============================================================================
  // Render: Expanded Navigation
  // =============================================================================

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="!h-screen max-h-screen w-full overflow-hidden"
    >
      {/* Left Sidebar */}
      <ResizablePanel
        defaultSize={lastExpandedNavSize}
        minSize={NAV_MIN_SIZE}
        maxSize={NAV_MAX_SIZE}
        className="overflow-hidden"
        onResize={(size) => setLastExpandedNavSize(size)}
      >
        <div className="h-full flex flex-col bg-background">
          {/* Sidebar header */}
          <div className="px-2 py-2 flex flex-col gap-1 border-b">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                className="flex-1 justify-start border-0 px-[0.625rem]"
                asChild
              >
                <Link to="/prototype-v6">
                  <KiwiLogo className="size-6 -ml-1 mr-0.5" />
                  <span className=" font-bold text-base">Trip Kiwi</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="border-0"
                onClick={toggleNav}
              >
                <PanelLeftClose className="size-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start h-9 font-medium border-0 px-[0.625rem]"
              onClick={handleNewPlan}
            >
              <Plus className="size-4" />
              <span>New plan</span>
            </Button>
          </div>

          {/* Plans list */}
          <div className="flex-1 min-h-0 overflow-auto px-2 pt-2">
            <div className="text-xs font-medium text-muted-foreground h-9 flex items-center px-[0.625rem]">
              Plans
            </div>
            <div className="flex flex-col gap-1">
              {plans.map((plan) => (
                <Button
                  key={plan.id}
                  variant={plan.id === selectedPlanId ? "secondary" : "ghost"}
                  className="w-full justify-start h-9 font-medium border-0 px-[0.625rem]"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.title || "Untitled plan"}
                </Button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="p-2 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 font-medium border-0 px-[0.625rem]"
                >
                  <Settings className="size-4" />
                  <span>Settings</span>
                </Button>
              </DropdownMenuTrigger>
              {settingsDropdownContent}
            </DropdownMenu>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Main content */}
      <ResizablePanel
        defaultSize={100 - lastExpandedNavSize}
        minSize={50}
        className="overflow-hidden"
      >
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full overflow-hidden"
        >
          {/* Central Panel */}
          <ResizablePanel
            defaultSize={100 - CHAT_DEFAULT_SIZE}
            minSize={30}
            className="overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {renderCentralPanelHeader()}
              {renderCentralPanelContent()}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Chat Panel */}
          <ResizablePanel
            defaultSize={CHAT_DEFAULT_SIZE}
            minSize={CHAT_MIN_SIZE}
            maxSize={CHAT_MAX_SIZE}
            className="overflow-hidden"
          >
            {renderChatPanel()}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
