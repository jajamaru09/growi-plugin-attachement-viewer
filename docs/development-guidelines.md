# 開発ガイドライン

## コーディング規約

### 全般

- TypeScript の `strict` モードを有効にし、型エラーを残さない
- `any` 型の使用は原則禁止。GROWI の型が不明な場合のみ `unknown` を使い、型ガードで絞り込む
- `console.log` はデバッグ用途のみ。リリース前に削除する（`console.error` はエラーハンドリングで許可）
- `dangerouslySetInnerHTML` は使用禁止

### React コンポーネント

- 関数コンポーネントのみ使用（クラスコンポーネント禁止）
- Props の型は `type Props = { ... }` で定義し、コンポーネントファイル内に記述する
- コンポーネント内で直接 API 呼び出しを行わない（`useAttachments` フック経由で行う）
- `useEffect` の依存配列は省略しない

### 非同期処理

- `async/await` を使用し、`.then().catch()` チェーンは使わない
- API 呼び出しは必ず `try/catch` でエラーをハンドリングする

## 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `AttachmentTable`, `CopyButton` |
| フック | `use` プレフィックス + camelCase | `useAttachments` |
| ユーティリティ関数 | camelCase | `buildDownloadFileName`, `formatFileSize` |
| 型・インターフェース | PascalCase | `AttachmentViewModel`, `GrowiPageContext` |
| 定数 | UPPER_SNAKE_CASE | `PLUGIN_NAME`, `PAGE_ID_REGEX` |
| CSS クラス（独自） | `growi-attachment-viewer-` プレフィックス + kebab-case | `growi-attachment-viewer-modal` |
| ファイル名（コンポーネント） | PascalCase + `.tsx` | `AttachmentTable.tsx` |
| ファイル名（その他） | camelCase + `.ts` | `useAttachments.ts`, `attachment.ts` |

## スタイリング規約

- **Bootstrap 5 クラスを優先使用**する（GROWI 本体が提供するため追加インポート不要）
- プラグイン固有のスタイルが必要な場合のみ、コンポーネント内に `<style>` タグを記述する
- 独自クラス名には必ず `growi-attachment-viewer-` プレフィックスを付ける（名前衝突防止）
- インラインスタイル（`style={{ ... }}`）は最小限に留め、Bootstrap クラスで代替できる場合は使わない

**使用する主な Bootstrap クラス:**

| UI要素 | 使用クラス |
|--------|-----------|
| モーダル | `modal`, `modal-dialog`, `modal-content`, `modal-header`, `modal-body` |
| テーブル | `table`, `table-sm`, `table-bordered`, `table-hover` |
| ボタン | `btn`, `btn-sm`, `btn-outline-secondary`, `btn-primary` |
| ローディング | `spinner-border`, `spinner-border-sm` |
| アラート | `alert`, `alert-danger` |

## テスト規約

本プロジェクトの初期実装ではユニットテストを設けない。
ただし、以下の関数は副作用がなく純粋関数のため、将来テスト追加が容易な形で実装する：

- `buildDownloadFileName(originalName, id)` — `src/utils/attachment.ts`
- `formatFileSize(bytes)` — `src/utils/format.ts`
- `extractPageId(pathname)` — `src/pageContext.ts`

## Git 規約

### ブランチ戦略

| ブランチ | 用途 |
|---------|------|
| `main` | リリース済みコード。`dist/` を含む |
| `feature/*` | 機能追加・変更作業 |
| `fix/*` | バグ修正 |

### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) に準拠する。

```
<type>: <summary>

[optional body]
```

| type | 用途 |
|------|------|
| `feat` | 新機能追加 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみの変更 |
| `refactor` | 機能変更を伴わないコード改善 |
| `build` | ビルド設定・依存関係の変更 |
| `chore` | その他（`dist/` の更新など） |

**例:**
```
feat: add bulk download button to modal
fix: handle attachments with no extension in file name
chore: build dist for v0.2.0
```

### `dist/` のコミット運用

GROWI が GitHub から `dist/.vite/manifest.json` を直接参照するため、
ビルド後に `dist/` を必ずコミットする。

```bash
npm run build
git add dist/
git commit -m "chore: build dist for vX.Y.Z"
```

## 品質チェック

コードをコミットする前に以下を実施する：

```bash
# TypeScript 型チェック（エラーがないことを確認）
npx tsc --noEmit

# ビルド確認（成功することを確認）
npm run build
```
