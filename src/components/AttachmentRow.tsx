import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { AttachmentViewModel, DownloadFileNameFormat } from '../types';
import { buildDownloadFileNameByFormat } from '../utils/attachment';
import { downloadFile } from '../utils/download';
import { CopyButton } from './CopyButton';

const PREVIEW_MAX_W = 320;
const PREVIEW_MAX_H = 240;
const CURSOR_OFFSET = 16;

type Props = {
  attachment: AttachmentViewModel;
  format: DownloadFileNameFormat;
  checked: boolean;
  inUse: boolean;
  onToggle: () => void;
};

export function AttachmentRow({ attachment, format, checked, inUse, onToggle }: Props) {
  const [previewPos, setPreviewPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent) => setPreviewPos({ x: e.clientX, y: e.clientY });
  const handleMouseMove  = (e: React.MouseEvent) => setPreviewPos({ x: e.clientX, y: e.clientY });
  const handleMouseLeave = () => setPreviewPos(null);

  const handleDownload = async () => {
    const fileName = buildDownloadFileNameByFormat(attachment.originalName, attachment.id, format);
    await downloadFile(attachment.downloadUrl, fileName);
  };

  const previewStyle: React.CSSProperties = previewPos
    ? {
        position: 'fixed',
        ...(previewPos.x + CURSOR_OFFSET + PREVIEW_MAX_W > window.innerWidth
          ? { right: window.innerWidth - previewPos.x + CURSOR_OFFSET }
          : { left: previewPos.x + CURSOR_OFFSET }),
        ...(previewPos.y + CURSOR_OFFSET + PREVIEW_MAX_H > window.innerHeight
          ? { bottom: window.innerHeight - previewPos.y + CURSOR_OFFSET }
          : { top: previewPos.y + CURSOR_OFFSET }),
        zIndex: 99999,
        pointerEvents: 'none',
        background: '#fff',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        padding: '4px',
      }
    : {};

  return (
    <tr>
      <td style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '5rem' }}>
        {attachment.isImage ? (
          <>
            <img
              src={attachment.viewUrl}
              alt={attachment.originalName}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ maxHeight: '60px', maxWidth: '80px', objectFit: 'contain', cursor: 'zoom-in' }}
            />
            {previewPos &&
              createPortal(
                <div style={previewStyle}>
                  <img
                    src={attachment.viewUrl}
                    alt={attachment.originalName}
                    style={{
                      maxHeight: `${PREVIEW_MAX_H}px`,
                      maxWidth: `${PREVIEW_MAX_W}px`,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>,
                document.body,
              )}
          </>
        ) : (
          '-'
        )}
      </td>
      <td>
        <span
          style={{
            maxWidth: '12rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
          }}
          title={attachment.originalName}
        >
          {attachment.originalName}
        </span>
      </td>
      <td>
        <code style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
          {attachment.id}
        </code>
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>{attachment.fileSizeLabel}</td>
      <td style={{ whiteSpace: 'nowrap' }}>
        {attachment.imageDimensions
          ? `${attachment.imageDimensions.width} × ${attachment.imageDimensions.height}`
          : attachment.isImage
            ? '取得中...'
            : '-'}
      </td>
      <td>
        <CopyButton text={attachment.markdownLink} label="MDリンク" />
      </td>
      <td>
        <CopyButton text={attachment.viewUrl} label="URL" />
      </td>
      <td>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={handleDownload}
          title={`${buildDownloadFileNameByFormat(attachment.originalName, attachment.id, format)} をダウンロード`}
        >
          DL
        </button>
      </td>
      <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
        {inUse ? <span className="badge bg-success">In Use</span> : '-'}
      </td>
      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
        />
      </td>
    </tr>
  );
}
