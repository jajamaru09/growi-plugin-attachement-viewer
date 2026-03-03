import { useState } from 'react';
import type { AttachmentViewModel, DownloadFileNameFormat } from '../types';
import { buildDownloadFileNameByFormat } from '../utils/attachment';
import { downloadFile } from '../utils/download';
import { CopyButton } from './CopyButton';

type Props = {
  attachment: AttachmentViewModel;
  format: DownloadFileNameFormat;
};

export function AttachmentRow({ attachment, format }: Props) {
  const [hovered, setHovered] = useState(false);

  const handleDownload = async () => {
    const fileName = buildDownloadFileNameByFormat(attachment.originalName, attachment.id, format);
    await downloadFile(attachment.downloadUrl, fileName);
  };

  return (
    <tr>
      <td style={{ textAlign: 'center', verticalAlign: 'middle', minWidth: '5rem' }}>
        {attachment.isImage ? (
          <img
            src={attachment.viewUrl}
            alt={attachment.originalName}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              maxHeight: hovered ? '120px' : '60px',
              maxWidth: hovered ? '160px' : '80px',
              objectFit: 'contain',
              transition: 'max-height 0.2s ease, max-width 0.2s ease',
              cursor: 'zoom-in',
            }}
          />
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
    </tr>
  );
}
