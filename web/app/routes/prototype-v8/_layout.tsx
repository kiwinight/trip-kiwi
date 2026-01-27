import { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, Link, useLocation, useNavigate } from "react-router";
import {
  Compass,
  Newspaper,
  User,
  Settings,
  Menu,
  type LucideIcon,
} from "lucide-react";
import {
  KiwiLogo as KiwiSymbol,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  useTheme,
  SheetFooter,
} from "~/components/ui";

// =============================================================================
// Constants
// =============================================================================

const UI_SCALES = ["90%", "95%", "100%", "105%", "110%"] as const;
type UIScale = (typeof UI_SCALES)[number];

// =============================================================================
// SidebarNavItem Component
// =============================================================================

function SidebarNavItem({
  to,
  icon: Icon,
  label,
  end,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className="group flex flex-col items-center gap-1 px-2 py-2"
    >
      {({ isActive }) => (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={`cursor-pointer ${isActive ? "bg-muted" : "group-hover:bg-muted"}`}
            tabIndex={-1}
          >
            <Icon />
          </Button>
          <span className="text-xs">{label}</span>
        </>
      )}
    </NavLink>
  );
}

// =============================================================================
// TabBarItem Component
// =============================================================================

function TabBarItem({
  to,
  icon: Icon,
  label,
  end,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className="group flex flex-1 flex-col justify-end items-center px-2"
    >
      {({ isActive }) => (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={`cursor-pointer ${isActive ? "bg-muted" : "group-hover:bg-muted"}`}
            tabIndex={-1}
          >
            <Icon />
          </Button>
          <span className="text-xs">{label}</span>
        </>
      )}
    </NavLink>
  );
}

// =============================================================================
// Layout Component
// =============================================================================

export default function PrototypeV8Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);
  const { theme, setTheme } = useTheme();
  const [uiScale, setUiScale] = useState<UIScale>("100%");
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);

  // Apply UI scale
  useEffect(() => {
    document.documentElement.style.fontSize = uiScale;
  }, [uiScale]);

  // Scroll to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // Settings dropdown content (reused for desktop and mobile)
  const settingsContent = (
    <>
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
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - desktop only */}
      <nav className="hidden md:block border-r bg-background">
        <div className="flex w-16 h-full flex-col items-center py-4 gap-4">
          {/* Kiwizard symbol */}
          <Link to="/prototype-v8">
            <KiwiSymbol className="size-7" />
          </Link>

          <div className="flex-1 flex flex-col w-full">
            <SidebarNavItem
              to="/prototype-v8"
              icon={Compass}
              label="Discover"
              end
            />
            <SidebarNavItem
              to="/prototype-v8/feed"
              icon={Newspaper}
              label="Feed"
            />
          </div>

          <div className="w-full">
            <SidebarNavItem
              to="/prototype-v8/profile"
              icon={User}
              label="Profile"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex flex-col items-center gap-1 px-2 py-2 w-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer group-hover:bg-muted"
                    tabIndex={-1}
                  >
                    <Settings />
                  </Button>
                  <span className="text-xs">Settings</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-40">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {settingsContent}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main ref={mainRef} className="flex-1 overflow-auto pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* TabBar - mobile only */}
      <nav className="fixed bottom-0 inset-x-0 border-t bg-background md:hidden pb-safe">
        <div className="flex h-14">
          <TabBarItem to="/prototype-v8" icon={Compass} label="Discover" end />
          <TabBarItem to="/prototype-v8/feed" icon={Newspaper} label="Feed" />

          {/* More tab - opens sheet */}
          <Sheet open={moreSheetOpen} onOpenChange={setMoreSheetOpen}>
            <SheetTrigger asChild>
              <button className="group flex flex-1 flex-col justify-end items-center px-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer group-hover:bg-muted"
                  tabIndex={-1}
                >
                  <Menu />
                </Button>
                <span className="text-xs">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="pb-safe">
              <SheetHeader>
                <SheetTitle>More</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col">
                {/* Profile link */}
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate("/prototype-v8/profile");
                    setMoreSheetOpen(false);
                  }}
                >
                  <User />
                  Profile
                </Button>

                {/* Settings - inline options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start">
                      <Settings />
                      Settings
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align="start"
                    className="w-40"
                  >
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {settingsContent}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}
