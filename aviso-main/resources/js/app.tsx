import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster, sileo } from 'sileo';
import { router } from '@inertiajs/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Listen for Inertia navigation success to trigger flash messages globally
router.on('navigate', (event) => {
    const page = event.detail.page;
    const flash = page.props.flash as { success?: string; error?: string; info?: string } | undefined;
    
    if (flash?.success) sileo.success({ title: flash.success });
    if (flash?.error) sileo.error({ title: flash.error });
    if (flash?.info) sileo.info({ title: flash.info });
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
                <Toaster position="top-center" theme="system" />
                <App {...props} />
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
