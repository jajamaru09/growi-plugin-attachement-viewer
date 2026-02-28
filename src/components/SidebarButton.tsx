import { useEffect, useState } from 'react';
import { AttachmentViewerModal } from './AttachmentViewerModal';

type Props = {
  initialPageId: string;
  buttonClass: string;
  onRegisterUpdater: (fn: (id: string) => void) => void;
};

export function SidebarButton({ initialPageId, buttonClass, onRegisterUpdater }: Props) {
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
      <div className="d-flex">
        <button
          type="button"
          className={buttonClass}
          onClick={() => setIsOpen(true)}
          title="添付ファイル一覧を表示"
        >
          <span className="grw-icon d-flex me-lg-2">
            <span className="material-symbols-outlined">attach_file</span>
          </span>
          <span className="grw-labels d-none d-lg-flex">添付ファイル</span>
        </button>
      </div>

      <AttachmentViewerModal
        pageId={pageId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
