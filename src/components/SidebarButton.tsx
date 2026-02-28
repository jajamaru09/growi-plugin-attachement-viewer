import { useEffect, useState } from 'react';
import { AttachmentViewerModal } from './AttachmentViewerModal';

type Props = {
  initialPageId: string;
  onRegisterUpdater: (fn: (id: string) => void) => void;
};

export function SidebarButton({ initialPageId, onRegisterUpdater }: Props) {
  const [pageId, setPageId] = useState(initialPageId);
  const [isOpen, setIsOpen] = useState(false);

  // client-entry.tsx からページIDを更新できるように setter を登録
  useEffect(() => {
    onRegisterUpdater((id) => {
      setPageId(id);
      setIsOpen(false); // ページ遷移時はモーダルを閉じる
    });
  }, [onRegisterUpdater]);

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-light btn-sm rounded-pill"
        onClick={() => setIsOpen(true)}
        title="添付ファイル一覧を表示"
      >
        📎 添付ファイル
      </button>

      <AttachmentViewerModal
        pageId={pageId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
