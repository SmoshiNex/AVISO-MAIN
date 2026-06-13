import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                Hello from Laravel & React!
            </h1>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
