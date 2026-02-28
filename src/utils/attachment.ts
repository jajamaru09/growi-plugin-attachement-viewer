import type { Attachment, AttachmentViewModel } from '../types';
import { formatFileSize } from './format';

export function buildDownloadFileName(originalName: string, id: string): string {
  const lastDot = originalName.lastIndexOf('.');
  if (lastDot === -1) return `${originalName}-${id}`;
  const base = originalName.substring(0, lastDot);
  const ext = originalName.substring(lastDot + 1);
  return `${base}-${id}.${ext}`;
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
    downloadFileName: buildDownloadFileName(attachment.originalName, attachment._id),
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
