import { createRoot, type Root } from 'react-dom/client';
import { createPageChangeListener } from './src/growiNavigation';
import type { GrowiPageContext } from './src/pageContext';
import { SidebarButton } from './src/components/SidebarButton';

declare global {
  interface Window {
    pluginActivators?: Record<string, { activate(): void; deactivate(): void }>;
  }
}

const PLUGIN_NAME = 'growi-plugin-attachment-viewer';
const CONTAINER_ID = 'growi-attachment-viewer-root';

let root: Root | null = null;
let updatePageId: ((id: string) => void) | null = null;

async function handlePageChange(ctx: GrowiPageContext): Promise<void> {
  const pageId = ctx.pageId.replace('/', '');

  if (root == null) {
    const container = document.createElement('div');
    container.id = CONTAINER_ID;
    document.body.appendChild(container);
    root = createRoot(container);
    root.render(
      <SidebarButton
        initialPageId={pageId}
        onRegisterUpdater={(fn) => {
          updatePageId = fn;
        }}
      />,
    );
  } else {
    updatePageId?.(pageId);
  }
}

const { start, stop } = createPageChangeListener(handlePageChange);

function activate(): void {
  console.log(`[${PLUGIN_NAME}] activated`);
  start();
}

function deactivate(): void {
  console.log(`[${PLUGIN_NAME}] deactivated`);
  stop();
  if (root != null) {
    root.unmount();
    root = null;
    updatePageId = null;
  }
  document.getElementById(CONTAINER_ID)?.remove();
}

if (window.pluginActivators == null) {
  window.pluginActivators = {};
}
window.pluginActivators[PLUGIN_NAME] = { activate, deactivate };
