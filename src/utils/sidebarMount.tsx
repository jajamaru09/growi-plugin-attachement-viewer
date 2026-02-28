import { createRoot, type Root } from 'react-dom/client';
import { SidebarButton } from '../components/SidebarButton';

const MOUNT_ID = 'growi-attachment-viewer-sidebar-mount';

let root: Root | null = null;
let updatePageId: ((id: string) => void) | null = null;

function getSidebarContainer(): Element | null {
  const primary = document.querySelector('[data-testid="pageListButton"]');
  const fallback = document.querySelector('[data-testid="page-comment-button"]');
  return (primary ?? fallback)?.parentElement ?? null;
}

export function mountSidebar(pageId: string): void {
  if (document.getElementById(MOUNT_ID) != null) {
    updatePageId?.(pageId);
    return;
  }

  const container = getSidebarContainer();
  if (container == null) {
    console.warn('[growi-plugin-attachment-viewer] Sidebar container not found');
    return;
  }

  const mountPoint = document.createElement('div');
  mountPoint.id = MOUNT_ID;
  container.appendChild(mountPoint);
  root = createRoot(mountPoint);
  root.render(
    <SidebarButton
      initialPageId={pageId}
      onRegisterUpdater={(fn) => {
        updatePageId = fn;
      }}
    />,
  );
}

export function unmountSidebar(): void {
  root?.unmount();
  root = null;
  updatePageId = null;
  document.getElementById(MOUNT_ID)?.remove();
}
