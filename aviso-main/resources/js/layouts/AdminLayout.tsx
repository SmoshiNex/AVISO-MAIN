import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background flex w-full">
                <AdminSidebar />
                <main className="flex-1 p-8 overflow-auto w-full">
                    <div className="flex items-center justify-between mb-4">
                        <SidebarTrigger />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            className="rounded-full"
                        >
                            {resolvedTheme === 'dark'
                                ? <Sun className="w-5 h-5" />
                                : <Moon className="w-5 h-5" />
                            }
                        </Button>
                    </div>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
