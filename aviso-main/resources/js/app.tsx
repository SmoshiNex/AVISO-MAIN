import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});
import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sileo';
import 'sileo/styles.css';
import { router } from '@inertiajs/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { toast } from '@/lib/toast';

import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'AVISO';

// Listen for Inertia navigation success to trigger flash messages globally
router.on('navigate', (event) => {
    // Consume any pending session-storage toasts first
    toast.consumePending();

    const page = event.detail.page;
    const flash = page.props.flash as { success?: string; error?: string; info?: string } | undefined;
    
    if (flash?.success) toast.success({ title: flash.success });
    if (flash?.error) toast.error({ title: flash.error });
    if (flash?.info) toast.info({ title: flash.info });
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <Toaster
                    position="top-center"
                    theme="dark"
                    options={{
                        roundness: 16,
                        fill: '#09090b',
                    }}
                />
                <App {...props} />
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
