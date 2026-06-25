import {
  Building2,
  CalendarClock,
  FileText,
  LayoutDashboard,
  LineChart,
  Megaphone,
  Plane,
  Rocket,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: LineChart },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Directory", href: "/directory", icon: Users },
      { label: "Departments", href: "/departments", icon: Building2 },
      { label: "Onboarding", href: "/onboarding", icon: Rocket },
    ],
  },
  {
    title: "HR",
    items: [
      { label: "Leave", href: "/hr/leave", icon: Plane },
      { label: "Approvals", href: "/hr/approvals", icon: CalendarClock },
      { label: "Reviews", href: "/hr/reviews", icon: LineChart },
    ],
  },
  {
    title: "Workplace",
    items: [
      { label: "Announcements", href: "/announcements", icon: Megaphone },
      { label: "Rooms", href: "/rooms", icon: CalendarClock },
      { label: "Documents", href: "/documents", icon: FileText },
      { label: "Payroll", href: "/payroll", icon: Wallet },
    ],
  },
];
