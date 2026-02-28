import { createPageChangeListener } from './src/growiNavigation';
import type { GrowiPageContext } from './src/pageContext';
import { mountSidebar, unmountSidebar } from './src/utils/sidebarMount';

declare global {
  interface Window {
    pluginActivators?: Record<string, { activate(): void; deactivate(): void }>;
  }
}

const PLUGIN_NAME = 'growi-plugin-attachment-viewer';

async function handlePageChange(ctx: GrowiPageContext): Promise<void> {
  const pageId = ctx.pageId.replace('/', '');
  mountSidebar(pageId);
}

const { start, stop } = createPageChangeListener(handlePageChange);

function activate(): void {
  start();
}

function deactivate(): void {
  stop();
  unmountSidebar();
}

if (window.pluginActivators == null) {
  window.pluginActivators = {};
}
window.pluginActivators[PLUGIN_NAME] = { activate, deactivate };
