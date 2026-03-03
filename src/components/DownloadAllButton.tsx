import { useState } from 'react';
import type { AttachmentViewModel, DownloadFileNameFormat } from '../types';
import { buildDownloadFileNameByFormat } from '../utils/attachment';
import { downloadFile } from '../utils/download';

type Props = {
  attachments: AttachmentViewModel[];
  format: DownloadFileNameFormat;
};

export function DownloadAllButton({ attachments, format }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleClick = async () => {
    if (isDownloading || attachments.length === 0) return;
    setIsDownloading(true);
    try {
      for (const attachment of attachments) {
        const fileName = buildDownloadFileNameByFormat(attachment.originalName, attachment.id, format);
        await downloadFile(attachment.downloadUrl, fileName);
        await new Promise<void>((resolve) => setTimeout(resolve, 300));
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-sm btn-primary"
      onClick={handleClick}
      disabled={isDownloading || attachments.length === 0}
    >
      {isDownloading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-1"
            role="status"
            aria-hidden="true"
          />
          ダウンロード中...
        </>
      ) : (
        `全てダウンロード (${attachments.length}件)`
      )}
    </button>
  );
}
