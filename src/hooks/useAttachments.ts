import { useEffect, useState } from 'react';
import type { AttachmentListResponse, AttachmentViewModel } from '../types';
import { fetchImageDimensions, toViewModel } from '../utils/attachment';

// GROWI API の正規ページネーションパラメータ:
//   pageNumber: ページ番号（1-indexed）※ "page" は Wiki ページ識別子と混同されるため使用不可
//   limit: 1 リクエストあたりの件数（最大 100）
const ATTACHMENT_LIST_LIMIT = 100;

async function fetchAllAttachments(pageId: string): Promise<AttachmentViewModel[]> {
  const origin = window.location.origin;
  const allDocs: AttachmentListResponse['paginateResult']['docs'] = [];
  let pageNumber = 1;

  while (true) {
    const res = await fetch(
      `/_api/v3/attachment/list?pageId=${pageId}&pageNumber=${pageNumber}&limit=${ATTACHMENT_LIST_LIMIT}`,
      { credentials: 'include' },
    );
    if (!res.ok) throw new Error(`API error: ${res.status} (pageNumber ${pageNumber})`);
    const data: AttachmentListResponse = await res.json();
    const { docs, totalPages } = data.paginateResult;

    allDocs.push(...docs);

    if (pageNumber >= totalPages) break;
    pageNumber++;
  }

  // _id による重複排除
  const uniqueDocs = Array.from(new Map(allDocs.map((d) => [d._id, d])).values());
  return uniqueDocs.map((a) => toViewModel(a, origin));
}

export function useAttachments(pageId: string, isOpen: boolean) {
  const [attachments, setAttachments] = useState<AttachmentViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !pageId) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setAttachments([]);

    fetchAllAttachments(pageId)
      .then(async (vms) => {
        if (cancelled) return;
        setAttachments(vms);
        setIsLoading(false);

        // 画像の寸法を非同期で取得して更新
        const imageVms = vms.filter((v) => v.isImage);
        if (imageVms.length === 0) return;

        const results = await Promise.allSettled(
          imageVms.map((v) => fetchImageDimensions(v.viewUrl)),
        );
        if (cancelled) return;

        setAttachments((prev) =>
          prev.map((v) => {
            if (!v.isImage) return v;
            const idx = imageVms.findIndex((iv) => iv.id === v.id);
            if (idx === -1) return v;
            const r = results[idx];
            return {
              ...v,
              imageDimensions: r.status === 'fulfilled' ? r.value : null,
            };
          }),
        );
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : '添付ファイルの取得に失敗しました');
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pageId, isOpen]);

  return { attachments, isLoading, error };
}
