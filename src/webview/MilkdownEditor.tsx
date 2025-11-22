import React, { useEffect } from 'react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, useEditor } from '@milkdown/react';
import {
    commonmark,
    toggleStrongCommand,
    toggleEmphasisCommand,
    wrapInHeadingCommand,
    wrapInBlockquoteCommand,
    wrapInBulletListCommand,
    wrapInOrderedListCommand,
    toggleInlineCodeCommand
} from '@milkdown/preset-commonmark';
import { gfm, toggleStrikethroughCommand } from '@milkdown/preset-gfm';
import { history, undoCommand, redoCommand } from '@milkdown/plugin-history';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { replaceAll, callCommand } from '@milkdown/utils';

interface MilkdownEditorProps {
    content: string;
    onChange: (markdown: string) => void;
}

export const MilkdownEditor: React.FC<MilkdownEditorProps> = ({ content, onChange }) => {
    const isLocalChange = React.useRef(false);

    const { get, loading } = useEditor((root) =>
        Editor.make()
            .config((ctx) => {
                ctx.set(rootCtx, root);
                ctx.set(defaultValueCtx, content);
                ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
                    if (markdown !== prevMarkdown) {
                        isLocalChange.current = true;
                        onChange(markdown);
                    }
                });
            })
            .config(nord)
            .use(commonmark)
            .use(gfm)
            .use(history)
            .use(listener)
    );

    useEffect(() => {
        if (!loading && get) {
            const editor = get();
            if (editor) {
                if (isLocalChange.current) {
                    isLocalChange.current = false;
                    return;
                }
                editor.action(replaceAll(content));
            }
        }
    }, [content, loading, get]);

    const run = (command: any, payload?: any) => {
        if (!loading && get) {
            const editor = get();
            if (editor) {
                editor.action(callCommand(command, payload));
            }
        }
    };

    const ToolbarButton = ({ icon, onClick, label }: { icon: React.ReactNode, onClick: () => void, label: string }) => (
        <button
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            title={label}
            style={{
                marginRight: '4px',
                padding: '4px 6px',
                cursor: 'pointer',
                background: 'var(--vscode-button-secondaryBackground)',
                color: 'var(--vscode-button-secondaryForeground)',
                border: 'none',
                borderRadius: '2px',
                fontSize: '12px',
                minWidth: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--vscode-font-family)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--vscode-button-secondaryHoverBackground)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--vscode-button-secondaryBackground)';
            }}
        >
            {icon}
        </button>
    );

    const Divider = () => (
        <div style={{ width: '1px', background: 'var(--vscode-widget-border)', margin: '0 4px', height: '16px', alignSelf: 'center' }} />
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{
                padding: '4px 8px',
                borderBottom: '1px solid var(--vscode-widget-border)',
                background: 'var(--vscode-editor-background)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2px',
                alignItems: 'center'
            }}>
                <ToolbarButton icon={<strong>B</strong>} label="Bold" onClick={() => run(toggleStrongCommand.key)} />
                <ToolbarButton icon={<em>I</em>} label="Italic" onClick={() => run(toggleEmphasisCommand.key)} />
                <ToolbarButton icon={<span style={{ textDecoration: 'line-through' }}>S</span>} label="Strike" onClick={() => run(toggleStrikethroughCommand.key)} />
                <Divider />
                <ToolbarButton icon="H1" label="Heading 1" onClick={() => run(wrapInHeadingCommand.key, 1)} />
                <ToolbarButton icon="H2" label="Heading 2" onClick={() => run(wrapInHeadingCommand.key, 2)} />
                <ToolbarButton icon="H3" label="Heading 3" onClick={() => run(wrapInHeadingCommand.key, 3)} />
                <Divider />
                <ToolbarButton icon="❝" label="Quote" onClick={() => run(wrapInBlockquoteCommand.key)} />
                <ToolbarButton icon="<>" label="Code" onClick={() => run(toggleInlineCodeCommand.key)} />
                <Divider />
                <ToolbarButton icon="•" label="Bullet List" onClick={() => run(wrapInBulletListCommand.key)} />
                <ToolbarButton icon="1." label="Ordered List" onClick={() => run(wrapInOrderedListCommand.key)} />
                <Divider />
                <ToolbarButton icon="↩" label="Undo" onClick={() => run(undoCommand.key)} />
                <ToolbarButton icon="↪" label="Redo" onClick={() => run(redoCommand.key)} />
            </div>
            <div style={{ flex: 1, overflow: 'auto', background: 'var(--vscode-editor-background)' }}>
                <Milkdown />
            </div>
        </div>
    );
};
