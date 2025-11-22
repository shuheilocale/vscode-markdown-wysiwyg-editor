# Markdown WYSIWYG Editor for VS Code

[English](README.md) | [日本語](README_ja.md)

A modern, Notion-like WYSIWYG (What You See Is What You Get) Markdown editor extension for Visual Studio Code.

![Demo Placeholder](https://via.placeholder.com/800x400?text=Demo+GIF+Coming+Soon)

## Features

- **WYSIWYG Interface**: Edit Markdown with a rich, live preview experience powered by [Milkdown](https://milkdown.dev/).
- **Bidirectional Synchronization**: Changes in the WYSIWYG editor are instantly reflected in the underlying Markdown file, and vice-versa.
- **Notion-like Experience**: Enjoy slash commands, immediate formatting, and a clean UI.
- **Seamless Integration**: Works alongside the standard VS Code editor.

## Installation

### From Source

1.  Clone the repository:
    ```bash
    git clone https://github.com/shuheilocale/vscode-markdown-wysiwyg-editor.git
    cd vscode-markdown-wysiwyg-editor
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Build the extension:
    ```bash
    npm run compile
    ```

4.  Run in Debug Mode:
    - Open the project in VS Code.
    - Press `F5` to launch the Extension Development Host.

## Usage

1.  Open any Markdown file (`.md`).
2.  Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).
3.  Run the command: **Markdown WYSIWYG: Open Editor**.
4.  Start editing in the new panel!

## Tech Stack

- **Extension**: TypeScript
- **Webview**: React
- **Editor Core**: [Milkdown](https://milkdown.dev/) (based on ProseMirror)
- **Bundler**: Webpack

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
