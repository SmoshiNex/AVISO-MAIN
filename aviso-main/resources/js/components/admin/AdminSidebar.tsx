import { Link, usePage } from "@inertiajs/react";
import {
    Map,
    AlertTriangle,
    BarChart3,
    Settings,
    LogOut,
    LayoutDashboard,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Live Map",
        url: "/map",
        icon: Map,
    },
    {
        title: "Hazards Log",
        url: "/hazards",
        icon: AlertTriangle,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
];

export default function AdminSidebar() {
    const { url } = usePage();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center space-x-3 p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                        <img
                            src="/logo-removebg.png"
                            alt="Aviso Logo"
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>
                    <div className="group-data-[collapsible=icon]:hidden">
                        <h2 className="font-heading font-bold text-lg leading-tight">
                            Aviso
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Admin Portal
                        </p>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                // simple check if current url starts with item url (or matches exactly)
                                const isActive =
                                    item.url === "/dashboard"
                                        ? url === "/dashboard" ||
                                          url.startsWith("/dashboard?")
                                        : item.url !== "#" &&
                                          url.startsWith(item.url);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className={
                                                isActive
                                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                            }
                                        >
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="w-full justify-start"
                            >
                                <LogOut />
                                <span>Log Out</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
