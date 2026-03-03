import type { Attachment, AttachmentViewModel, DownloadFileNameFormat } from '../types';
import { formatFileSize } from './format';

export function buildDownloadFileNameByFormat(
  originalName: string,
  id: string,
  format: DownloadFileNameFormat,
): string {
  const lastDot = originalName.lastIndexOf('.');
  const hasExt = lastDot !== -1;
  const base = hasExt ? originalName.substring(0, lastDot) : originalName;
  const ext = hasExt ? originalName.substring(lastDot + 1) : '';

  switch (format) {
    case 'hash-only':
      return id;
    case 'hash-ext':
      return hasExt ? `${id}.${ext}` : id;
    case 'name-hash-ext':
    default:
      return hasExt ? `${base}-${id}.${ext}` : `${base}-${id}`;
  }
}

export function buildMarkdownLink(name: string, url: string, isImage: boolean): string {
  return isImage ? `![${name}](${url})` : `[${name}](${url})`;
}

export function toViewModel(attachment: Attachment, origin: string): AttachmentViewModel {
  const isImage = attachment.fileFormat.startsWith('image/');
  const viewUrl = `${origin}${attachment.filePathProxied}`;
  const downloadUrl = `${origin}${attachment.downloadPathProxied}`;
  return {
    id: attachment._id,
    originalName: attachment.originalName,
    fileFormat: attachment.fileFormat,
    isImage,
    fileSizeBytes: attachment.fileSize,
    fileSizeLabel: formatFileSize(attachment.fileSize),
    imageDimensions: null,
    viewUrl,
    downloadUrl,
    markdownLink: buildMarkdownLink(attachment.originalName, viewUrl, isImage),
  };
}

export async function fetchImageDimensions(
  url: string,
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = url;
  });
}
