import React, { useEffect, useState } from 'react';
import { MilkdownProvider } from '@milkdown/react';
import { MilkdownEditor } from './MilkdownEditor';

// Acquire VS Code API
const vscode = acquireVsCodeApi();

const App: React.FC = () => {
    const [text, setText] = useState('');

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message.type === 'update') {
                setText(message.text);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleChange = (markdown: string) => {
        setText(markdown);
        vscode.postMessage({
            type: 'updateText',
            text: markdown
        });
    };

    return (
        <MilkdownProvider>
            <div style={{ padding: '20px', fontFamily: 'sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    {/* Key forces re-render when content changes from outside to ensure editor updates */}
                    <MilkdownEditor content={text} onChange={handleChange} />
                </div>
            </div>
        </MilkdownProvider>
    );
};

export default App;
