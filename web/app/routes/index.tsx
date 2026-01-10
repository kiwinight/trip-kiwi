import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import {
  Settings,
  Plus,
  Send,
  MoreHorizontal,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  Gift,
  Sparkles,
  Heart,
  Users,
  Briefcase,
  User,
  DollarSign,
  ShoppingBag,
  Copy,
  Download,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
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
  useTheme,
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  Card,
  CardContent,
  Input,
  RadioGroup,
  RadioGroupItem,
  Field,
  FieldLabel,
  FieldContent,
} from "~/components/ui";
import { cn } from "~/libs/utils";

// =============================================================================
// Types
// =============================================================================

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  questionStep?: SearchStep; // If set, render question card for this step
};

type QuickOption = {
  label: string;
  value: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

// Search step tracking for guided flow
type SearchStep =
  | "type" // What are you looking for?
  | "recipient" // Who is this for?
  | "budget" // What's your budget?
  | "complete"; // Report is ready

type SearchState = {
  id: string;
  title: string;
  messages: ChatMessage[];
  reportContent: string | null;
  step: SearchStep;
  // Collected data from guided flow
  giftType?: string;
  recipient?: string;
  budget?: string;
  createdAt: Date;
};

// =============================================================================
// Question Flow Configuration
// =============================================================================

type QuestionConfig = {
  step: SearchStep;
  title: string;
  question: string;
  options?: QuickOption[];
  isLastQuestion?: boolean;
};

const QUESTIONS: QuestionConfig[] = [
  {
    step: "type",
    title: "Gift Type",
    question: "What are you looking for?",
    options: [
      { label: "Birthday gift", value: "birthday" },
      { label: "Thank you gift", value: "thankyou" },
      { label: "Holiday gift", value: "holiday" },
      { label: "Just because", value: "justbecause" },
    ],
  },
  {
    step: "recipient",
    title: "Recipient",
    question: "Who is this gift for?",
    options: [
      {
        label: "Partner / Spouse",
        value: "partner",
      },
      {
        label: "Family member",
        value: "family",
      },
      {
        label: "Friend",
        value: "friend",
      },
      {
        label: "Colleague",
        value: "colleague",
      },
    ],
  },
  {
    step: "budget",
    title: "Budget",
    question: "What's your budget?",
    options: [
      { label: "Under $30", value: "under30" },
      { label: "$30 - $50", value: "30to50" },
      { label: "$50 - $100", value: "50to100" },
      { label: "$100 - $200", value: "100to200" },
      { label: "Over $200", value: "over200" },
    ],
    isLastQuestion: true,
  },
];

function getQuestionIndex(step: SearchStep): number {
  return QUESTIONS.findIndex((q) => q.step === step);
}

function getNextStep(currentStep: SearchStep): SearchStep {
  const currentIndex = getQuestionIndex(currentStep);
  if (currentIndex === -1 || currentIndex >= QUESTIONS.length - 1) {
    return "complete";
  }
  return QUESTIONS[currentIndex + 1].step;
}

function getCurrentQuestion(step: SearchStep): QuestionConfig | undefined {
  return QUESTIONS.find((q) => q.step === step);
}

function getQuestionText(step: SearchStep): string {
  const question = getCurrentQuestion(step);
  if (question) return question.question;

  switch (step) {
    case "complete":
      return "Your report is ready! Check the panel on the right for my recommendations.";
    default:
      return "";
  }
}

// =============================================================================
// Mock Data
// =============================================================================

const MOCK_REPORT_CONTENT = `
<h2>🎯 Quick Pick</h2>
<p><strong>OXO Good Grips 11-Pound Food Scale</strong> — $54.95</p>
<p>Best balance of precision, durability, and ease of use for home cooks. Pull-out display prevents bowl shadows.</p>

<h2>📊 Top Options Comparison</h2>
<ul>
  <li><strong>OXO Good Grips 11lb Scale</strong> ($54.95) — Best for daily home cooking ★★★★★</li>
  <li><strong>Escali Primo Digital Scale</strong> ($24.95) — Best budget option ★★★★☆</li>
  <li><strong>Zwilling Enfinigy Digital Scale</strong> ($99.95) — Premium look & feel ★★★★☆</li>
</ul>

<h2>✨ Why This Pick</h2>
<p>The OXO scale consistently ranks #1 across cooking communities for home use. Its pull-out display solves the common problem of large bowls blocking the screen. The 11lb capacity handles everything from baking to meal prep, and OXO's build quality means it'll last for years.</p>

<h2>💬 What Reddit Says</h2>
<ul>
  <li><strong>r/Cooking</strong> (↑847): "Had my OXO scale for 6 years now, still works perfectly. The pull-out display is a game changer."</li>
  <li><strong>r/BuyItForLife</strong> (↑423): "This is one of those products where spending a bit more upfront saves you from buying replacements."</li>
  <li><strong>r/Baking</strong> (↑256): "Essential for serious baking. Measuring by weight changed my bread game completely."</li>
</ul>

<h2>⚠️ Watch Out For</h2>
<ul>
  <li>The display can be sensitive to water - wipe dry after cleaning</li>
  <li>Needs 4 AAA batteries (not included in some packages)</li>
  <li>The pull-out display adds to the footprint when extended</li>
</ul>

<h2>🛒 Where to Buy</h2>
<ul>
  <li><strong>Amazon</strong> — $54.95 (In Stock, Free 2-day with Prime)</li>
  <li><strong>Target</strong> — $54.99 (In Stock, Free shipping over $35)</li>
  <li><strong>OXO Direct</strong> — $54.95 (In Stock, Free shipping)</li>
</ul>

<h2>❌ What We Ruled Out</h2>
<ul>
  <li><strong>Greater Goods Digital Scale</strong> — Lower build quality, common complaints about accuracy drift</li>
  <li><strong>KitchenAid Dual Platform Scale</strong> — Over budget at $129, features she won't need</li>
</ul>

<h2>🎁 Gift Presentation Ideas</h2>
<p>Consider pairing with a nice set of measuring spoons or a recipe book. Wrap in kraft paper with a ribbon for that 'practical but thoughtful' feel she'll appreciate.</p>
`;

const createMockSearches = (): SearchState[] => [
  {
    id: "search-1",
    title: "Birthday gift",
    step: "complete",
    giftType: "Birthday gift",
    recipient: "Partner / Spouse",
    budget: "$50 - $100",
    messages: [
      {
        id: "msg-1",
        role: "assistant",
        content: "What are you looking for?",
        questionStep: "type",
      },
      { id: "msg-2", role: "user", content: "Birthday gift" },
      {
        id: "msg-3",
        role: "assistant",
        content: "Who is this gift for?",
        questionStep: "recipient",
      },
      { id: "msg-4", role: "user", content: "Partner / Spouse" },
      {
        id: "msg-5",
        role: "assistant",
        content: "What's your budget?",
        questionStep: "budget",
      },
      { id: "msg-6", role: "user", content: "$50 - $100" },
    ],
    reportContent: MOCK_REPORT_CONTENT,
    createdAt: new Date("2026-01-02T10:30:00"),
  },
  {
    id: "search-2",
    title: "Just because",
    step: "budget",
    giftType: "Just because",
    recipient: "Friend",
    messages: [
      {
        id: "msg-1",
        role: "assistant",
        content: "What are you looking for?",
        questionStep: "type",
      },
      { id: "msg-2", role: "user", content: "Just because" },
      {
        id: "msg-3",
        role: "assistant",
        content: "Who is this gift for?",
        questionStep: "recipient",
      },
      { id: "msg-4", role: "user", content: "Friend" },
      {
        id: "msg-5",
        role: "assistant",
        content: "What's your budget?",
        questionStep: "budget",
      },
    ],
    reportContent: null,
    createdAt: new Date("2026-01-03T14:20:00"),
  },
  {
    id: "search-3",
    title: "New search",
    step: "type",
    messages: [
      {
        id: "msg-1",
        role: "assistant",
        content: "What are you looking for?",
        questionStep: "type",
      },
    ],
    reportContent: null,
    createdAt: new Date("2026-01-04T09:15:00"),
  },
];

// =============================================================================
// Constants
// =============================================================================

const NAV_DEFAULT_SIZE = 18;
const NAV_MIN_SIZE = 14;
const NAV_MAX_SIZE = 28;
const REPORT_DEFAULT_SIZE = 45;
const REPORT_MIN_SIZE = 30;
const REPORT_MAX_SIZE = 60;

const UI_SCALES = ["90%", "95%", "100%", "105%", "110%"] as const;
type UIScale = (typeof UI_SCALES)[number];

// =============================================================================
// Report Panel Component (TipTap Editor)
// =============================================================================

function ReportPanel({
  content,
  onContentChange,
}: {
  content: string | null;
  onContentChange?: (content: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Your report will appear here...",
      }),
    ],
    content: content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none min-h-[400px]",
      },
    },
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(editor.getHTML());
      }
    },
  });

  // Sync editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [editor, content]);

  if (!content) {
    return (
      <Empty className="border-0 h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingBag />
          </EmptyMedia>
          <EmptyTitle>Your report will appear here</EmptyTitle>
          <EmptyDescription>
            Chat with me to get your recommendation
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="px-4 py-6 max-w-none">
        <EditorContent editor={editor} />
      </div>
    </ScrollArea>
  );
}

// =============================================================================
// Chat Message Components
// =============================================================================

function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="text-sm text-foreground max-w-[90%] px-0 py-2 ">
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}

// Inline question card that appears below assistant messages
function InlineQuestionCard({
  question,
  onSelectOption,
  onSkip,
}: {
  question: QuestionConfig;
  onSelectOption: (value: string, label: string) => void;
  onSkip?: () => void;
}) {
  const [otherInput, setOtherInput] = useState("");
  const [selectedValue, setSelectedValue] = useState<string | undefined>();

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleSubmit = () => {
    if (!selectedValue) return;

    if (selectedValue === "other") {
      if (otherInput.trim()) {
        onSelectOption("other", otherInput.trim());
        setOtherInput("");
        setSelectedValue(undefined);
      }
    } else {
      const option = question.options?.find((o) => o.value === selectedValue);
      if (option) {
        onSelectOption(option.value, option.label);
        setSelectedValue(undefined);
      }
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  // Check if submit should be disabled
  const isSubmitDisabled =
    !selectedValue || (selectedValue === "other" && !otherInput.trim());

  if (!question.options) return null;

  return (
    <div>
      <Card size="sm">
        <CardContent>
          <RadioGroup
            value={selectedValue}
            onValueChange={handleValueChange}
            className="gap-2"
          >
            {question.options.map((option) => (
              <FieldLabel
                key={option.value}
                htmlFor={option.value}
                className="rounded-4xl!"
              >
                <Field orientation="horizontal" className="px-3! py-2!">
                  <FieldContent>
                    <div className="font-medium text-sm">{option.label}</div>
                    {option.description && (
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    )}
                  </FieldContent>
                  <RadioGroupItem value={option.value} id={option.value} />
                </Field>
              </FieldLabel>
            ))}

            {/* Other option */}
            <FieldLabel htmlFor="other" className="rounded-4xl!">
              <Field orientation="horizontal" className="px-3! py-2!">
                <FieldContent>
                  <div className="font-medium text-sm">Other</div>
                </FieldContent>
                <RadioGroupItem value="other" id="other" />
              </Field>
            </FieldLabel>
          </RadioGroup>

          {/* Input for "other" option */}
          {selectedValue === "other" && (
            <div className="mt-2">
              <Input
                value={otherInput}
                onChange={(e) => setOtherInput(e.target.value)}
                placeholder="Type your answer..."
                // className="h-9"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && otherInput.trim()) {
                    handleSubmit();
                  }
                }}
              />
            </div>
          )}

          {/* Skip and Submit buttons */}
          <div className="flex justify-end gap-2 mt-3">
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// Chat Panel Component
// =============================================================================

function ChatPanel({
  search,
  onSelectOption,
  onSkip,
  onSendMessage,
}: {
  search: SearchState;
  onSelectOption: (value: string, label: string) => void;
  onSkip: () => void;
  onSendMessage: (message: string) => void;
}) {
  const [chatInput, setChatInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { step, messages } = search;

  const currentQuestion = getCurrentQuestion(step);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, step]);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      onSendMessage(chatInput.trim());
      setChatInput("");
    }
  };

  return (
    <div className="flex-1 min-h-0 relative">
      {/* Scrollable messages - full height */}
      <ScrollArea className="h-full" ref={scrollRef}>
        <div className="p-4 pb-40 space-y-4 mx-auto">
          {/* Render all messages */}
          {messages.map((message, idx) => {
            const isLastMessage = idx === messages.length - 1;
            const isAssistant = message.role === "assistant";
            const hasQuestionCard = isAssistant && message.questionStep;
            const shouldShowInteractiveCard =
              hasQuestionCard && isLastMessage && currentQuestion;

            return (
              <div key={message.id} className="space-y-2">
                {isAssistant ? (
                  <>
                    <AssistantMessage content={message.content} />
                    {/* Show interactive question card only for the last assistant message */}
                    {shouldShowInteractiveCard && currentQuestion && (
                      <InlineQuestionCard
                        question={currentQuestion}
                        onSelectOption={onSelectOption}
                        onSkip={onSkip}
                      />
                    )}
                  </>
                ) : (
                  <UserMessage content={message.content} />
                )}
              </div>
            );
          })}

          {/* Show complete state */}
          {step === "complete" && (
            <AssistantMessage content="Your report is ready! Check the panel on the right for my recommendations." />
          )}
        </div>
      </ScrollArea>

      {/* Floating chat input - fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 px-4 pt-0 mx-auto bg-gradient-to-t from-background from-20% to-transparent">
        <Card size="sm">
          <CardContent className="">
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
                placeholder="Reply..."
                className="min-h-[60px] max-h-[120px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 rounded-none text-sm!"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function meta() {
  return [
    { title: "Pick Kiwi - Your Personal Shopping Assistant" },
    {
      name: "description",
      content: "AI-powered shopping assistant that finds what to buy for you",
    },
  ];
}

export default function PrototypeV7Route() {
  const { theme, setTheme } = useTheme();

  // Navigation state
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [lastExpandedNavSize, setLastExpandedNavSize] =
    useState(NAV_DEFAULT_SIZE);
  const [uiScale, setUiScale] = useState<UIScale>("100%");

  // Searches state
  const [searches, setSearches] = useState<SearchState[]>(createMockSearches());
  const [selectedSearchId, setSelectedSearchId] = useState<string>(
    searches[0]?.id
  );
  const selectedSearch = searches.find((s) => s.id === selectedSearchId);

  // Dialog states
  const [openDeleteSearchDialog, setOpenDeleteSearchDialog] = useState(false);

  // Apply UI scale
  useEffect(() => {
    document.documentElement.style.fontSize = uiScale;
  }, [uiScale]);

  // Handlers
  const toggleNav = () => setNavCollapsed((prev) => !prev);

  const handleSelectSearch = (searchId: string) => {
    setSelectedSearchId(searchId);
  };

  const handleNewSearch = () => {
    const newSearch: SearchState = {
      id: `search-${Date.now()}`,
      title: "New search",
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: getQuestionText("type"),
          questionStep: "type",
        },
      ],
      reportContent: null,
      step: "type",
      createdAt: new Date(),
    };
    setSearches((prev) => [newSearch, ...prev]);
    setSelectedSearchId(newSearch.id);
  };

  const handleDeleteSearch = () => {
    if (!selectedSearch) return;
    setSearches((prev) => {
      const filtered = prev.filter((s) => s.id !== selectedSearch.id);
      if (filtered.length > 0) {
        setSelectedSearchId(filtered[0].id);
      }
      return filtered;
    });
    setOpenDeleteSearchDialog(false);
  };

  const handleSelectOption = (value: string, label: string) => {
    if (!selectedSearch) return;

    const currentStep = selectedSearch.step;
    const nextStep = getNextStep(currentStep);
    const nextQuestion = getCurrentQuestion(nextStep);
    const nextQuestionText = getQuestionText(nextStep);

    // Build messages array: add user response, then next assistant question
    const newMessages: ChatMessage[] = [
      ...selectedSearch.messages,
      { id: `msg-${Date.now()}`, role: "user" as const, content: label },
    ];

    // Add assistant message with the next question (if not complete)
    if (nextQuestionText && nextStep !== "complete") {
      newMessages.push({
        id: `msg-${Date.now() + 1}`,
        role: "assistant" as const,
        content: nextQuestionText,
        questionStep: nextQuestion ? nextStep : undefined,
      });
    }

    // Update the search with the selected value
    const updates: Partial<SearchState> = {
      step: nextStep,
      messages: newMessages,
    };

    // Store the value in the appropriate field
    switch (currentStep) {
      case "type":
        updates.giftType = label;
        // Update title based on first selection
        if (selectedSearch.title === "New search") {
          updates.title = label;
        }
        break;
      case "recipient":
        updates.recipient = label;
        break;
      case "budget":
        updates.budget = label;
        break;
    }

    // If completing, add mock report content
    if (nextStep === "complete") {
      updates.reportContent = MOCK_REPORT_CONTENT;
    }

    setSearches((prev) =>
      prev.map((s) => (s.id === selectedSearchId ? { ...s, ...updates } : s))
    );
  };

  const handleSendMessage = (message: string) => {
    if (!selectedSearch) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: message,
    };

    // Mock AI response
    const aiResponse: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: getMockChatResponse(message),
    };

    setSearches((prev) =>
      prev.map((s) =>
        s.id === selectedSearchId
          ? { ...s, messages: [...s.messages, userMessage, aiResponse] }
          : s
      )
    );
  };

  const handleSkipQuestion = () => {
    if (!selectedSearch) return;

    const currentStep = selectedSearch.step;
    const nextStep = getNextStep(currentStep);
    const nextQuestion = getCurrentQuestion(nextStep);
    const nextQuestionText = getQuestionText(nextStep);

    // Build messages array: add "Skipped" user response, then next assistant question
    const newMessages: ChatMessage[] = [
      ...selectedSearch.messages,
      { id: `msg-${Date.now()}`, role: "user" as const, content: "Skipped" },
    ];

    // Add assistant message with the next question (if not complete)
    if (nextQuestionText && nextStep !== "complete") {
      newMessages.push({
        id: `msg-${Date.now() + 1}`,
        role: "assistant" as const,
        content: nextQuestionText,
        questionStep: nextQuestion ? nextStep : undefined,
      });
    }

    const updates: Partial<SearchState> = {
      step: nextStep,
      messages: newMessages,
    };

    // If completing, add mock report content
    if (nextStep === "complete") {
      updates.reportContent = MOCK_REPORT_CONTENT;
    }

    setSearches((prev) =>
      prev.map((s) => (s.id === selectedSearchId ? { ...s, ...updates } : s))
    );
  };

  // Mock chat response
  function getMockChatResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes("help") || lower.includes("how")) {
      return "I'm here to help you find the perfect gift! You can answer the questions above, or tell me more about what you're looking for.";
    }
    if (lower.includes("budget") || lower.includes("price")) {
      return "I can work with any budget! Just let me know your range and I'll find the best options within it.";
    }
    if (lower.includes("recommend") || lower.includes("suggest")) {
      return "Based on what you've told me so far, I'd be happy to make some recommendations. Could you share a bit more about the recipient's interests?";
    }
    return "Got it! Feel free to continue with the questions above, or let me know if you have any specific requirements.";
  }

  // Settings dropdown content
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
  // Render: Collapsed Navigation
  // =============================================================================

  if (navCollapsed) {
    return (
      <div className="h-screen max-h-screen w-full overflow-hidden flex">
        {/* Collapsed sidebar */}
        <div className="border-r border-border">
          <div className="group w-12 min-w-12 max-w-12 shrink-0 h-full">
            <TooltipProvider delayDuration={0}>
              <div className="h-full w-full flex flex-col bg-background">
                <div className="p-1.5 flex flex-col gap-1">
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
                        onClick={handleNewSearch}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">New search</TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex-1" />

                <div className="p-1.5">
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
        </div>

        {/* Main content area */}
        <div className="flex-1 h-full overflow-hidden">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full overflow-hidden"
          >
            {/* Chat Panel */}
            <ResizablePanel
              defaultSize={100 - REPORT_DEFAULT_SIZE}
              minSize={30}
              className="overflow-hidden"
            >
              <div className="h-full flex flex-col">
                <div className="px-4 h-12 border-b shrink-0 flex items-center justify-between">
                  <h2 className="font-medium text-sm truncate">
                    {selectedSearch?.title || "New search"}
                  </h2>
                  <AlertDialog
                    open={openDeleteSearchDialog}
                    onOpenChange={setOpenDeleteSearchDialog}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="size-4" />
                            Delete search
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this search?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the conversation and
                          report. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteSearch}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                {selectedSearch && (
                  <ChatPanel
                    search={selectedSearch}
                    onSelectOption={handleSelectOption}
                    onSkip={handleSkipQuestion}
                    onSendMessage={handleSendMessage}
                  />
                )}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Report Panel */}
            <ResizablePanel
              defaultSize={REPORT_DEFAULT_SIZE}
              minSize={REPORT_MIN_SIZE}
              maxSize={REPORT_MAX_SIZE}
              className="overflow-hidden"
            >
              <div className="h-full flex flex-col">
                <div className="px-4 h-12 border-b shrink-0 flex items-center justify-between">
                  <h2 className="font-medium text-sm">Report</h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="size-4" />
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="size-4" />
                        Export
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <ReportPanel content={selectedSearch?.reportContent ?? null} />
              </div>
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
          <div className="px-[0.25rem] py-1.5 flex flex-col gap-1 border-b">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                className="flex-1 justify-start border-0"
                asChild
              >
                <Link to="/prototype-v7">
                  <KiwiLogo className="size-6 -ml-1 mr-0.5" />
                  <span className="font-bold text-base">Pick Kiwi</span>
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
              className="w-full justify-start h-9 font-medium border-0"
              onClick={handleNewSearch}
            >
              <Plus className="size-4" />
              <span>New search</span>
            </Button>
          </div>

          {/* Searches list */}
          <div className="flex-1 min-h-0 overflow-auto px-2 pt-2">
            <div className="text-xs font-medium text-muted-foreground h-9 flex items-center px-3">
              Recents
            </div>
            <div className="flex flex-col gap-1">
              {searches.map((search) => (
                <Button
                  key={search.id}
                  variant={
                    search.id === selectedSearchId ? "secondary" : "ghost"
                  }
                  className="w-full justify-start h-9 font-medium border-0"
                  onClick={() => handleSelectSearch(search.id)}
                >
                  {search.title || "New search"}
                </Button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="px-[0.25rem] py-1.5 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 font-medium border-0"
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
          {/* Chat Panel */}
          <ResizablePanel
            defaultSize={100 - REPORT_DEFAULT_SIZE}
            minSize={30}
            className="overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="px-4 h-12 border-b shrink-0 flex items-center justify-between">
                <h2 className="font-medium text-sm truncate">
                  {selectedSearch?.title || "New search"}
                </h2>
                <AlertDialog
                  open={openDeleteSearchDialog}
                  onOpenChange={setOpenDeleteSearchDialog}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="size-4" />
                          Delete search
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this search?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the conversation and
                        report. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSearch}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              {selectedSearch && (
                <ChatPanel
                  search={selectedSearch}
                  onSelectOption={handleSelectOption}
                  onSkip={handleSkipQuestion}
                  onSendMessage={handleSendMessage}
                />
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Report Panel */}
          <ResizablePanel
            defaultSize={REPORT_DEFAULT_SIZE}
            minSize={REPORT_MIN_SIZE}
            maxSize={REPORT_MAX_SIZE}
            className="overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="px-4 h-12 border-b shrink-0 flex items-center justify-between">
                <h2 className="font-medium text-sm">Report</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Copy className="size-4" />
                      Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="size-4" />
                      Export
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <ReportPanel content={selectedSearch?.reportContent ?? null} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
