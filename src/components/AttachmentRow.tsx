import type { AttachmentViewModel } from '../types';
import { downloadFile } from '../utils/download';
import { CopyButton } from './CopyButton';

type Props = {
  attachment: AttachmentViewModel;
};

export function AttachmentRow({ attachment }: Props) {
  const handleDownload = async () => {
    await downloadFile(attachment.downloadUrl, attachment.downloadFileName);
  };

  return (
    <tr>
      <td style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '5rem' }}>
        {attachment.isImage ? (
          <img
            src={attachment.viewUrl}
            alt={attachment.originalName}
            style={{ maxHeight: '60px', maxWidth: '80px', objectFit: 'contain' }}
          />
        ) : (
          '-'
        )}
      </td>
      <td>
        <div className="d-flex align-items-center gap-1">
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
          <CopyButton text={attachment.originalName} label="コピー" />
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-1">
          <code
            style={{
              maxWidth: '8rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              fontSize: '0.75rem',
            }}
            title={attachment.id}
          >
            {attachment.id}
          </code>
          <CopyButton text={attachment.id} label="コピー" />
        </div>
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
          title={`${attachment.downloadFileName} をダウンロード`}
        >
          DL
        </button>
      </td>
    </tr>
  );
}
