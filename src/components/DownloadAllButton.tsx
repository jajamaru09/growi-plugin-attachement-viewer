import { useState } from 'react';
import type { AttachmentViewModel, DownloadFileNameFormat } from '../types';
import { buildDownloadFileNameByFormat } from '../utils/attachment';
import { downloadFile } from '../utils/download';

type Props = {
  attachments: AttachmentViewModel[];
  format: DownloadFileNameFormat;
  selectedIds: Set<string>;
};

export function DownloadAllButton({ attachments, format, selectedIds }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  const hasSelection = selectedIds.size > 0;
  const targets = hasSelection
    ? attachments.filter(a => selectedIds.has(a.id))
    : attachments;

  const handleClick = async () => {
    if (isDownloading || targets.length === 0) return;
    setIsDownloading(true);
    try {
      for (const attachment of targets) {
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
      disabled={isDownloading || targets.length === 0}
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
      ) : hasSelection ? (
        `選択をダウンロード (${selectedIds.size}件)`
      ) : (
        `全てダウンロード (${attachments.length}件)`
      )}
    </button>
  );
}
