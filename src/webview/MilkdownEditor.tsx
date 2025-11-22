import React, { useEffect } from 'react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { history } from '@milkdown/plugin-history';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { replaceAll } from '@milkdown/utils';

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
                        // Reset flag after a short delay or immediately?
                        // React state update is async, so the prop update will come later.
                        // We need to keep this flag true until the prop update arrives.
                        // But we don't know when that is.
                        // Better: Check if content prop matches markdown.
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
                // If the content prop is different from what we just typed (local change),
                // then it must be a remote change (or we are out of sync).
                // But wait, if we type 'a', onChange sends 'a'. App updates state 'a'.
                // Prop 'content' becomes 'a'.
                // Here, we receive 'a'.
                // If we call replaceAll('a'), it triggers markdownUpdated again?
                // Yes, replaceAll triggers listener.

                // We need to check the CURRENT editor content.
                // If prop content == current editor content, DO NOT replace.

                // How to get current content?
                // We can't easily get it synchronously without a command.
                // But we know 'isLocalChange' was set.

                if (isLocalChange.current) {
                    isLocalChange.current = false;
                    return;
                }

                editor.action(replaceAll(content));
            }
        }
    }, [content, loading, get]);

    return <Milkdown />;
};
