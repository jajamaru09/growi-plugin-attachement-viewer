export type PageMode = 'view' | 'edit';

export type GrowiPageContext = {
  pageId: string;
  mode: PageMode;
  revisionId?: string;
};

const PAGE_ID_RE = /^\/([0-9a-f]{24})$/i;

export function isPageIdUrl(pathname: string): boolean {
  return PAGE_ID_RE.test(pathname);
}

export function extractPageId(pathname: string): string | null {
  const m = pathname.match(PAGE_ID_RE);
  return m ? m[1] : null;
}
