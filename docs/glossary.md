# ユビキタス言語定義

## ドメイン用語

| 日本語 | 英語 | 定義 |
|--------|------|------|
| 添付ファイル | Attachment | GROWI のページに紐づけられたファイル。画像・PDF・その他あらゆる形式を含む |
| 添付ファイル一覧 | Attachment List | 1つのページに紐づく全添付ファイルのコレクション |
| ページ | Page | GROWI の Wiki ページ。MongoDB の ObjectId で識別される |
| ページID | Page ID | GROWI が内部で使用するページの識別子。24桁の16進数（MongoDB ObjectId） |
| ファイルID | File ID | 添付ファイルの識別子。24桁の16進数（MongoDB ObjectId）。`_id` フィールドに対応 |
| ファイルサイズ | File Size | ファイルの容量。バイト単位で管理し、表示時は KB / MB に変換する |
| 画像寸法 | Image Dimensions | 画像ファイルの幅（px）と高さ（px） |
| Markdown リンク | Markdown Link | Markdown 記法で表現したリンク文字列。画像は `![ファイル名](URL)`、その他は `[ファイル名](URL)` |
| 閲覧URL | View URL | ブラウザでファイルを直接表示するための URL。`/attachment/{ファイルID}` |
| ダウンロードURL | Download URL | ファイルをダウンロードするための URL。`/download/{ファイルID}` |
| ダウンロードファイル名 | Download File Name | ダウンロード時に保存されるファイル名。形式: `{元ファイル名（拡張子なし）}-{ファイルID}.{拡張子}` |

## UI/UX 用語

| 日本語 | 英語 | 定義 |
|--------|------|------|
| サイドバーボタン | Sidebar Button | GROWI のサイドバーに挿入されるプラグイン起動ボタン |
| モーダル | Modal | 添付ファイル一覧を表示するオーバーレイダイアログ |
| コピーボタン | Copy Button | フィールドの値をクリップボードにコピーするボタン |
| 一括ダウンロード | Bulk Download | モーダル内の全添付ファイルを連続してダウンロードする操作 |
| コピー成功フィードバック | Copy Success Feedback | コピー完了を示す一時的な視覚的通知（2秒後に元の表示に戻る） |
| ローディング状態 | Loading State | API からデータ取得中であることを示すスピナー表示 |
| エラー状態 | Error State | API 呼び出し失敗時のエラーメッセージ表示 |

## 技術用語

| 日本語 | 英語（コード上の名称） | 定義 |
|--------|----------------------|------|
| プラグインエントリポイント | `client-entry.tsx` | GROWI がロードするプラグインの起点ファイル |
| 活性化 | `activate()` | GROWI がプラグインを有効化するときに呼び出す関数 |
| 非活性化 | `deactivate()` | GROWI がプラグインを無効化するときに呼び出す関数 |
| ページ遷移リスナー | `createPageChangeListener` | Navigation API を使ったページ遷移検知ユーティリティ |
| ページコンテキスト | `GrowiPageContext` | 現在のページID・モード・リビジョンIDを保持する型 |
| 添付ファイルビューモデル | `AttachmentViewModel` | API レスポンスを UI 表示用に加工したデータ型 |
| ビルド成果物 | `dist/` | Vite がビルドした JavaScript バンドルと manifest を含むディレクトリ |

## GROWI 固有用語

| 用語 | 定義 |
|------|------|
| `growiFacade` | GROWI がグローバルに公開するプラグイン向けインターフェース（`window.growiFacade`） |
| `pluginActivators` | プラグインが `activate` / `deactivate` を登録するグローバルオブジェクト（`window.pluginActivators`） |
| `schemaVersion` | プラグインの設定スキーマバージョン。現在は `"4"` 固定 |
| script プラグイン | JavaScript バンドルをブラウザでロードするプラグイン種別（`growiPlugin.types: ["script"]`） |
| `manifest.json` | Vite が生成するビルドマニフェスト。GROWI がバンドルファイルのパスを解決するために使用 |

## 英語・日本語対応表（コード命名用）

| 日本語概念 | コード上の命名 |
|-----------|--------------|
| 添付ファイル | `attachment` / `Attachment` |
| 添付ファイル一覧 | `attachments` / `attachmentList` |
| ページID | `pageId` |
| ファイルID | `id`（`AttachmentViewModel`）/ `_id`（API レスポンス） |
| ファイルサイズ（バイト） | `fileSizeBytes` |
| ファイルサイズ（表示用） | `fileSizeLabel` |
| 画像寸法 | `imageDimensions` |
| 元のファイル名 | `originalName` |
| 拡張子なしファイル名 | `baseName` |
| 拡張子 | `extension` |
| 閲覧URL | `viewUrl` |
| ダウンロードURL | `downloadUrl` |
| ダウンロードファイル名 | `downloadFileName` |
| Markdown リンク | `markdownLink` |
| 画像ファイルかどうか | `isImage` |
