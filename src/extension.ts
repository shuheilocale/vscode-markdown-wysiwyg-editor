import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-markdown-wysiwyg-editor" is now active!');

    let disposable = vscode.commands.registerCommand('markdown-wysiwyg.openEditor', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const document = editor.document;
        const panel = vscode.window.createWebviewPanel(
            'markdownWysiwyg',
            `[WYSIWYG] ${path.basename(editor.document.fileName)}`,
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'out'))]
            }
        );

        panel.iconPath = new vscode.ThemeIcon('preview') as any;

        const scriptUri = panel.webview.asWebviewUri(
            vscode.Uri.joinPath(context.extensionUri, 'out', 'webview.js')
        );

        panel.webview.html = getWebviewContent(panel.webview, scriptUri);

        // Send initial content
        panel.webview.postMessage({
            type: 'update',
            text: document.getText()
        });

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.type) {
                    case 'updateText':
                        const edit = new vscode.WorkspaceEdit();
                        const fullRange = new vscode.Range(
                            document.positionAt(0),
                            document.positionAt(document.getText().length)
                        );
                        edit.replace(document.uri, fullRange, message.text);
                        vscode.workspace.applyEdit(edit);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );

        // Listen for document changes
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                panel.webview.postMessage({
                    type: 'update',
                    text: e.document.getText()
                });
            }
        });

        // Clean up when the panel is closed
        panel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        }, null, context.subscriptions);
    });

    context.subscriptions.push(disposable);
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function getWebviewContent(webview: vscode.Webview, scriptUri: vscode.Uri) {
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown WYSIWYG</title>
</head>
<body>
    <div id="root"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

export function deactivate() { }
