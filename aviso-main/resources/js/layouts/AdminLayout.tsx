import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background flex w-full">
                <AdminSidebar />
                <main className="flex-1 p-8 overflow-auto w-full">
                    <SidebarTrigger className="mb-4" />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
