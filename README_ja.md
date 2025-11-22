# Markdown WYSIWYG Editor for VS Code

[English](README.md) | [日本語](README_ja.md)

VS Code用のモダンな、NotionライクなWYSIWYG（見たまま編集）Markdownエディタ拡張機能です。

![Demo Placeholder](https://via.placeholder.com/800x400?text=Demo+GIF+Coming+Soon)

## 特徴

- **WYSIWYG インターフェース**: [Milkdown](https://milkdown.dev/) を採用し、リッチでリアルタイムなプレビュー編集体験を提供します。
- **双方向同期**: WYSIWYGエディタでの変更は即座に元のMarkdownファイルに反映され、その逆も同様です。
- **Notionライクな体験**: スラッシュコマンド、即時のフォーマット適用、クリーンなUIを楽しめます。
- **シームレスな統合**: 標準のVS Codeエディタと並行して動作します。

## インストール方法

### ソースからビルドする場合

1.  リポジトリをクローンします:
    ```bash
    git clone https://github.com/shuheilocale/vscode-markdown-wysiwyg-editor.git
    cd vscode-markdown-wysiwyg-editor
    ```

2.  依存関係をインストールします:
    ```bash
    npm install
    ```

3.  拡張機能をビルドします:
    ```bash
    npm run compile
    ```

4.  デバッグモードで実行します:
    - VS Codeでプロジェクトを開きます。
    - `F5` キーを押して、拡張機能開発ホストを起動します。

## 使い方

1.  任意のMarkdownファイル（`.md`）を開きます。
2.  コマンドパレットを開きます（`Cmd+Shift+P` / `Ctrl+Shift+P`）。
3.  コマンド **Markdown WYSIWYG: Open Editor** を実行します。
4.  新しいパネルで編集を開始してください！

## 技術スタック

- **Extension**: TypeScript
- **Webview**: React
- **Editor Core**: [Milkdown](https://milkdown.dev/) (based on ProseMirror)
- **Bundler**: Webpack

## コントリビューション

プルリクエスト（PR）は大歓迎です！お気軽に投稿してください。

## ライセンス

[MIT](LICENSE)
