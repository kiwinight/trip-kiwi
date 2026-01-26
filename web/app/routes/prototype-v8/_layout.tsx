import { useEffect, useRef } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router";
import { Compass, Newspaper, User, type LucideIcon } from "lucide-react";
import { KiwiLogo as KiwiSymbol, Button } from "~/components/ui";

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
    <NavLink to={to} end={end} className="group flex flex-col items-center gap-1 px-2 py-2">
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
    <NavLink to={to} end={end} className="group flex flex-1 flex-col justify-end items-center px-2">
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
  const mainRef = useRef<HTMLElement>(null);

  // TODO: Check if this can be avoided
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

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
            <SidebarNavItem to="/prototype-v8" icon={Compass} label="Discover" end />
            <SidebarNavItem to="/prototype-v8/feed" icon={Newspaper} label="Feed" />
          </div>

          <div className="w-full">
            <SidebarNavItem to="/prototype-v8/profile" icon={User} label="Profile" />
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
          <TabBarItem to="/prototype-v8/profile" icon={User} label="Profile" />
        </div>
      </nav>
    </div>
  );
}
