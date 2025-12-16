import { Outlet, Link, useLocation } from "react-router";
import { Settings, Plus, Briefcase, PanelLeft } from "lucide-react";
import type { Route } from "./+types/trips";
import {
  KiwiLogo,
  Large,
  Button,
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
  SidebarSeparator,
  useSidebar,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui";
import { cn } from "~/libs/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Trip Kiwi" },
    { name: "description", content: "AI-powered travel planning assistant" },
  ];
}

// Placeholder data - shared across sidebar
const trips = [
  { id: "1", name: "Paris Trip", dates: "Dec 15-20, 2024" },
  { id: "2", name: "Tokyo 2025", dates: "Mar 1-10, 2025" },
  { id: "3", name: "London Adventure", dates: "Jun 5-12, 2025" },
  { id: "4", name: "Seoul Food Tour", dates: "Aug 20-27, 2025" },
];

function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Extract current tripId from URL
  const tripIdMatch = location.pathname.match(/\/trips\/([^/]+)/);
  const currentTripId = tripIdMatch ? tripIdMatch[1] : null;

  return (
    <Sidebar collapsible="offcanvas">
      {/* Header */}
      <SidebarHeader className="h-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="md"
              asChild
              // className="h-auto"
            >
              <Link to="/trips">
                <div className="flex items-center gap-2">
                  <KiwiLogo className="size-6" />
                  <span className="font-semibold text-base">Trip Kiwi</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* <SidebarSeparator /> */}

      {/* Content */}
      <SidebarContent>
        {/* New Trip Button */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="New Trip"
                size="md"
                asChild
                // className={cn("h-auto")}
              >
                <Link to="/trips/new">
                  <Plus />
                  <span>New Trip</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* My Trips - only show in expanded mode */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>My Trips</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {trips.map((trip) => (
                  <SidebarMenuItem key={trip.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentTripId === trip.id}
                      size="md"
                      className="data-[active=true]:font-normal data-[active=true]:bg-accent"
                    >
                      <Link to={`/trips/${trip.id}`}>
                        <span>{trip.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* My Trips icon - only show in collapsed mode */}
        {isCollapsed && (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="My Trips" asChild>
                  <Link to="/trips">
                    <Briefcase className="size-4" />
                    <span>My Trips</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function TripsLayout({}: Route.ComponentProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col">
          {/* Small header with just the toggle */}
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1 size-9" />
          </header>
          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
