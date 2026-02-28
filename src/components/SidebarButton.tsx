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
        onClick={() => setIsOpen(true)}
        title="添付ファイル一覧を表示"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9000,
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: '#4e73df',
          color: '#fff',
          fontSize: '1.25rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
      >
        📎
      </button>

      <AttachmentViewerModal
        pageId={pageId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
