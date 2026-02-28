# リポジトリ構造定義書

## フォルダ・ファイル構成

```
growi-plugin-attachment-viewer/
├── src/
│   ├── components/
│   │   ├── AttachmentViewerModal.tsx   # モーダル本体（API呼び出し・状態管理）
│   │   ├── AttachmentTable.tsx         # テーブル（ヘッダー＋行一覧）
│   │   ├── AttachmentRow.tsx           # テーブル1行（各フィールドとコピーボタン）
│   │   ├── CopyButton.tsx              # クリップボードコピーボタン
│   │   ├── DownloadAllButton.tsx       # 一括ダウンロードボタン
│   │   └── SidebarButton.tsx           # サイドバー埋め込みボタン（モーダル起動）
│   ├── hooks/
│   │   └── useAttachments.ts           # 添付ファイル一覧取得カスタムフック
│   ├── utils/
│   │   ├── attachment.ts               # AttachmentViewModel 変換・ダウンロードファイル名生成
│   │   └── format.ts                   # ファイルサイズ表示用フォーマット関数
│   ├── growiNavigation.ts              # Navigation API ページ遷移検知（参考リポジトリ流用）
│   ├── pageContext.ts                  # GrowiPageContext 型・URL抽出ユーティリティ（参考リポジトリ流用）
│   └── types.ts                        # Attachment / AttachmentViewModel 型定義
├── docs/                               # 永続的ドキュメント
│   ├── product-requirements.md
│   ├── functional-design.md
│   ├── architecture.md
│   ├── repository-structure.md         # 本ファイル
│   ├── development-guidelines.md
│   └── glossary.md
├── .steering/                          # 作業単位のステアリングファイル
│   └── YYYYMMDD-[タイトル]/
│       ├── requirements.md
│       ├── design.md
│       └── tasklist.md
├── dist/                               # ビルド成果物（Git管理対象）
│   └── .vite/
│       └── manifest.json               # GROWIがバンドルを発見するために必要
├── client-entry.tsx                    # プラグインエントリポイント
├── vite.config.ts                      # Vite ビルド設定
├── tsconfig.json                       # TypeScript 設定（ブラウザ向け）
├── tsconfig.node.json                  # TypeScript 設定（vite.config.ts 向け）
├── package.json                        # 依存関係・growiPlugin フィールド
├── package-lock.json
├── .gitignore
├── LICENSE                             # MIT ライセンス
├── CLAUDE.md                           # プロジェクトメモリ（Claude Code 用）
└── README.md                           # プラグインの説明・インストール方法
```

## ディレクトリの役割

### `src/components/`

UI コンポーネントを格納する。各コンポーネントは単一責任原則に従い、親から必要なデータを props で受け取る。コンポーネント内での API 呼び出しは行わない（`AttachmentViewerModal` のみ例外として `useAttachments` フックを使用）。

### `src/hooks/`

React カスタムフックを格納する。API 呼び出しやサイドエフェクトを含むロジックを UI コンポーネントから分離する。

### `src/utils/`

副作用のない純粋関数ユーティリティを格納する。テストが容易な形で実装する。

### `src/growiNavigation.ts` / `src/pageContext.ts`

参考リポジトリ（`growi-plugin-page-hook`）から流用するファイル。
GROWI の Navigation API ラッパーと URL パース処理を提供する。

### `dist/`

Vite のビルド成果物。**Git 管理対象**（GROWI が GitHub リポジトリから直接 `dist/.vite/manifest.json` を参照するため、コミット必須）。

### `client-entry.tsx`

プラグインのエントリポイント。`window.pluginActivators` への `activate` / `deactivate` 登録と、React コンポーネントのマウント処理を担う。

## ファイル配置ルール

| ルール | 詳細 |
|--------|------|
| コンポーネントファイル名 | PascalCase（例: `AttachmentTable.tsx`） |
| フック・ユーティリティ名 | camelCase（例: `useAttachments.ts`, `attachment.ts`） |
| 型定義の配置 | コンポーネント固有の型はそのコンポーネントファイル内。共有型は `src/types.ts` |
| スタイル | Bootstrap 5 クラスを直接使用。プラグイン固有スタイルが必要な場合のみ `<style>` タグをコンポーネント内に記述し、`growi-attachment-viewer-` プレフィックスを付ける |
| `dist/` のコミット | ビルド後に必ずコミットする。`.gitignore` から除外しない |
