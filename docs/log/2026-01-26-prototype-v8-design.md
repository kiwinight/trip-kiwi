# Prototype V8 Design

This document captures the design decisions and visual patterns for the Kiwizard prototype v8 interface.

## Design Overview

Prototype v8 introduces an adaptive navigation system that provides optimal user experience across mobile and desktop devices. The design prioritizes:

- **Simplicity**: Clean, minimal interface with clear navigation
- **Accessibility**: Thumb-friendly navigation on mobile, visible sidebar on desktop
- **Consistency**: Unified visual language across breakpoints

## Responsive Layout

The interface adapts between two distinct navigation patterns based on screen width.

![Prototype V8 Responsive Design](assets/2026-01-26-prototype-v8-responsive.png)

### Mobile (< 768px)

- **Bottom Tab Bar**: Fixed at the bottom of the screen for easy thumb access
- **Full-width Content**: Content area spans the entire screen width
- **Equal-width Tabs**: Navigation items distributed evenly across the tab bar
- **Safe Area Padding**: Accounts for device home indicators and notches

### Desktop (768px and above)

- **Left Sidebar**: Narrow 64px sidebar with vertical navigation
- **Brand Placement**: Kiwi logo positioned at the top of the sidebar
- **Grouped Navigation**: Primary navigation at top, profile at bottom
- **Border Separation**: Subtle right border divides navigation from content

## Navigation Design

### Visual States

| State | Appearance |
|-------|------------|
| Default | Ghost button (transparent background) |
| Hover | Muted background fill |
| Active | Persistent muted background |

### Navigation Items

Each navigation item consists of:
- **Icon**: Lucide icon (24px) providing visual recognition
- **Label**: Small text below the icon for clarity

| Item | Icon | Purpose |
|------|------|---------|
| Discover | Compass | Main exploration/discovery page |
| Feed | Newspaper | Content feed and updates |
| Profile | User | User account and settings |

## Visual Design System

### Typography
- **Page Titles**: Bold, large text (24px equivalent)
- **Navigation Labels**: Extra-small text below icons
- **Card Titles**: Semi-bold, standard size
- **Card Descriptions**: Muted, smaller text

### Color Palette
- **Background**: Clean white/light background
- **Borders**: Subtle gray for navigation separation
- **Active States**: Muted gray background
- **Text**: Standard dark text with muted variants

### Spacing
- **Content Padding**: 16px consistent padding
- **Card Spacing**: 16px vertical gap between cards
- **Navigation Gap**: Consistent spacing between nav items

## Content Layout

Pages follow a consistent structure:
1. **Page Title**: Bold heading at the top
2. **Scrollable Content**: Vertical list of cards
3. **Card Design**: Compact cards with title and description

The main content area scrolls independently while navigation remains fixed.

## Design Rationale

### Why Bottom Navigation for Mobile?
- Thumb reachability: Bottom of screen is easiest to reach one-handed
- Follows established mobile patterns (iOS tab bar, Material bottom navigation)
- Keeps primary actions always visible

### Why Sidebar for Desktop?
- Utilizes available horizontal screen space efficiently
- Vertical stacking allows for future navigation expansion
- Common desktop application pattern (Slack, Discord, Figma)

### Icon Selection
- **Compass**: Universal symbol for discovery and exploration
- **Newspaper**: Represents feed/news content
- **User**: Standard profile/account icon

## Key Design Decisions

1. **Icon + Label Combination**: Both icon and text shown for clarity, reducing cognitive load
2. **Fixed Navigation**: Navigation stays visible during scroll for quick access
3. **Minimal Chrome**: Focus on content with subtle navigation boundaries
4. **Consistent Interaction**: Same hover/active states across mobile and desktop
