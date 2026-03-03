import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DownloadFileNameFormat } from '../types';
import { useAttachments } from '../hooks/useAttachments';
import { usePageBody } from '../hooks/usePageBody';
import { AttachmentTable } from './AttachmentTable';
import { DownloadAllButton } from './DownloadAllButton';

type Props = {
  pageId: string;
  isOpen: boolean;
  onClose: () => void;
};

const FORMAT_OPTIONS: { value: DownloadFileNameFormat; label: string }[] = [
  { value: 'hash-only', label: 'ハッシュのみ' },
  { value: 'hash-ext', label: 'ハッシュ＋拡張子' },
  { value: 'name-hash-ext', label: 'ファイル名_ハッシュ.拡張子' },
];

export function AttachmentViewerModal({ pageId, isOpen, onClose }: Props) {
  const { attachments, isLoading, error } = useAttachments(pageId, isOpen);
  const { body: pageBody } = usePageBody(pageId, isOpen);
  const [format, setFormat] = useState<DownloadFileNameFormat>('name-hash-ext');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const inUseMap = useMemo<Record<string, boolean>>(() => {
    if (pageBody == null) return {};
    return Object.fromEntries(
      attachments.map((a) => [a.id, pageBody.indexOf(a.id) >= 0]),
    );
  }, [attachments, pageBody]);

  const handleToggle = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    if (selectedIds.size === attachments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(attachments.map(a => a.id)));
    }
  };

  // Esc キーで閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* オーバーレイ */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
        }}
      />

      {/* モーダル本体 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="添付ファイル一覧"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: 'min(90vw, 900px)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          borderRadius: '0.5rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        {/* ヘッダー */}
        <div
          className="d-flex align-items-center justify-content-between px-3 py-2"
          style={{ borderBottom: '1px solid #dee2e6', flexShrink: 0 }}
        >
          <span className="fw-bold">
            添付ファイル一覧
            {!isLoading && !error && ` (${attachments.length}件)`}
          </span>
          <button
            type="button"
            className="btn-close"
            aria-label="閉じる"
            onClick={onClose}
          />
        </div>

        {/* ボディ */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {isLoading && (
            <div className="d-flex justify-content-center align-items-center p-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">読み込み中...</span>
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="alert alert-danger m-3" role="alert">
              {error}
            </div>
          )}

          {!isLoading && !error && attachments.length === 0 && (
            <p className="text-muted text-center p-4 mb-0">添付ファイルはありません</p>
          )}

          {!isLoading && !error && attachments.length > 0 && (
            <>
              <div className="px-3 pt-3 pb-2 d-flex align-items-center gap-3 flex-wrap">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <small className="text-muted">DL ファイル名:</small>
                  {FORMAT_OPTIONS.map(({ value, label }) => (
                    <label
                      key={value}
                      className="d-flex align-items-center gap-1"
                      style={{ cursor: 'pointer', marginBottom: 0 }}
                    >
                      <input
                        type="radio"
                        name="dl-filename-format"
                        value={value}
                        checked={format === value}
                        onChange={() => setFormat(value)}
                      />
                      <small>{label}</small>
                    </label>
                  ))}
                </div>
                <DownloadAllButton
                  attachments={attachments}
                  format={format}
                  selectedIds={selectedIds}
                />
              </div>
              <div className="px-3 pb-3">
                <AttachmentTable
                  attachments={attachments}
                  format={format}
                  selectedIds={selectedIds}
                  inUseMap={inUseMap}
                  onToggle={handleToggle}
                  onToggleAll={handleToggleAll}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}
