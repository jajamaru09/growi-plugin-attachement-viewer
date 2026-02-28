# 技術仕様書

## テクノロジースタック

| カテゴリ | 技術 | バージョン | 選定理由 |
|----------|------|-----------|---------|
| 言語 | TypeScript | ^5.5.0 | 型安全性・GROWI エコシステムとの統一 |
| UIフレームワーク | React | ^18.3.0 | GROWI 本体と同一バージョン（`growiFacade.react` 共有） |
| ビルドツール | Vite | ^5.4.0 | GROWI プラグイン標準ツールチェーン |
| プラグインキット | @growi/pluginkit | ^1.1.0 | GROWI 公式プラグイン開発ツール |
| スタイリング | Bootstrap 5 | （GROWI 本体が提供） | GROWI 本体が Bootstrap 5 を使用しており、グローバルに利用可能 |

## プラグイン設定（`package.json` の `growiPlugin` フィールド）

```json
{
  "name": "growi-plugin-attachment-viewer",
  "version": "0.1.0",
  "type": "module",
  "keywords": ["growi", "growi-plugin"],
  "growiPlugin": {
    "schemaVersion": "4",
    "types": ["script"]
  }
}
```

- `schemaVersion`: `"4"` 固定（文字列）
- `types`: `["script"]` — JS バンドルをブラウザでロードするプラグイン種別
- `keywords`: `"growi"` と `"growi-plugin"` が必須（プラグインディレクトリ掲載の条件）

## 開発ツールと手法

### ビルド構成（`vite.config.ts`）

```typescript
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,  // dist/.vite/manifest.json を生成（GROWI がバンドルを発見するために必要）
    rollupOptions: {
      input: ['client-entry.tsx'],
      preserveEntrySignatures: 'strict',  // activate/deactivate がツリーシェイクされないよう保護
    },
  },
});
```

### TypeScript 設定（`tsconfig.json`）

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true
  },
  "include": ["client-entry.tsx", "src/**/*.ts", "src/**/*.tsx"]
}
```

### 開発スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（ホットリロード） |
| `npm run build` | 本番ビルド（`tsc && vite build`） |
| `npm run build:watch` | ウォッチモードでビルド（GROWI との連携確認時） |

## React インスタンス管理

GROWI は複数の React インスタンスが存在するとフック動作が壊れる問題を防ぐため、
本番環境では `window.growiFacade.react` の共有インスタンスを使用する必要がある。

```typescript
// src/utils/react.ts
import React from 'react';

export function getReact(): typeof React {
  if (process.env.NODE_ENV === 'production') {
    return (window as any).growiFacade?.react ?? React;
  }
  return React;
}
```

ただし、`@growi/pluginkit` の `growiReact()` ユーティリティが同等の機能を提供するため、
実装ではそちらを利用する。

## ページ遷移検知

### Navigation API（`window.navigation`）

```typescript
// ブラウザサポート状況
// Chrome 102+: 対応
// Firefox: 未対応（グレースフルデグラデーション）
// Edge 102+: 対応
```

Firefox は Navigation API 未対応のため、`window.navigation` が存在しない場合は
`start()` 内で早期リターンする（参考リポジトリの実装に準拠）。

Firefox への対応が必要な場合は将来の課題とし、初期実装では Chrome / Edge を主ターゲットとする。

## セキュリティ考慮事項

### XSS 対策
- ファイル名を DOM に挿入する際は必ず React の JSX レンダリング（自動エスケープ）を使用
- `dangerouslySetInnerHTML` は使用しない
- Markdown リンク文字列はプレーンテキストとしてクリップボードに送信するのみで、DOM に直接挿入しない

### CSRF 対策
- GROWI の API はセッション Cookie を使用するため、プラグインからのリクエストは
  同一オリジンポリシーで保護される
- `credentials: 'include'` を fetch オプションに指定してセッションを送信

### ファイルダウンロードの安全性
- ダウンロード URL は GROWI の `/download/{id}` エンドポイントを使用
- 外部 URL への誘導は行わない

## パフォーマンス要件と実装方針

| 要件 | 目標値 | 実装方針 |
|------|--------|---------|
| 添付ファイル一覧取得 | 2秒以内 | 1ページ目取得後に残ページを並列 fetch |
| 画像寸法取得 | 非同期・非ブロッキング | `Promise.allSettled` で並列取得、取得後に state 更新 |
| モーダル初回表示 | ちらつきなし | ローディングスピナーを表示してからデータ取得 |

## ブラウザ互換性

| ブラウザ | バージョン | 対応状況 |
|----------|-----------|---------|
| Chrome | 最新版（102+） | 完全対応 |
| Edge | 最新版（102+） | 完全対応 |
| Firefox | 最新版 | Navigation API 未使用のため動作しない可能性あり（初期スコープ外） |

## 技術的制約と要件

### GROWI プラグインシステムの制約

1. **GitHub リポジトリのみ対応**: GROWI のプラグインは npm パッケージとしてではなく、GitHub リポジトリとして登録・配布する
2. **ビルド成果物の同梱**: `dist/` ディレクトリをリポジトリにコミットする必要がある（GROWI が GitHub から直接 `dist/.vite/manifest.json` を参照するため）
3. **ES Module 必須**: `"type": "module"` が必要
4. **React バージョン整合**: 本番では `growiFacade.react` を使用し、GROWI 本体の React と統一する

### Bootstrap 5 の利用

GROWI 本体が Bootstrap 5 をグローバルに読み込むため、プラグイン側で Bootstrap を
別途インポートする必要はない。Bootstrap のクラス名（`btn`, `modal`, `table` 等）を
そのまま使用できる。

ただし、Bootstrap の CSS がグローバルに影響するため、プラグイン固有のスタイルは
`growi-attachment-viewer-` プレフィックスを付けたクラス名を使用して名前衝突を避ける。
