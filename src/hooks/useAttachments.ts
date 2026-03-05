import { useEffect, useState } from 'react';
import type { Attachment, AttachmentListResponse, AttachmentViewModel } from '../types';
import { fetchImageDimensions, toViewModel } from '../utils/attachment';

async function fetchAllAttachments(pageId: string): Promise<AttachmentViewModel[]> {
  const origin = window.location.origin;

  const firstRes = await fetch(
    `/_api/v3/attachment/list?pageId=${pageId}&page=1`,
    { credentials: 'include' },
  );
  if (!firstRes.ok) throw new Error(`API error: ${firstRes.status}`);
  const firstData: AttachmentListResponse = await firstRes.json();
  const { docs: firstDocs, limit, totalDocs } = firstData.paginateResult;

  const allDocs: Attachment[] = [...firstDocs];

  // totalPages は GROWI バージョンによって不正確なことがあるため
  // totalDocs / limit から実際のページ数を自前で計算する
  const expectedPages = Math.ceil(totalDocs / limit);

  for (let page = 2; page <= expectedPages; page++) {
    const res = await fetch(
      `/_api/v3/attachment/list?pageId=${pageId}&page=${page}`,
      { credentials: 'include' },
    );
    if (!res.ok) throw new Error(`API error: ${res.status} (page ${page})`);
    const data: AttachmentListResponse = await res.json();
    const docs = data.paginateResult.docs;
    allDocs.push(...docs);
    if (docs.length === 0) break; // 空ページが来たら安全に終了
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
