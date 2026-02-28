/** GROWI API /_api/v3/attachment/list のレスポンスに含まれる添付ファイル型 */
export type Attachment = {
  _id: string;
  originalName: string;
  fileName: string;
  fileFormat: string;
  fileSize: number;
  page: string;
  creator: string;
  createdAt: string;
  filePathProxied: string;
  downloadPathProxied: string;
};

export type AttachmentListResponse = {
  paginateResult: {
    docs: Attachment[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

/** UI 表示用に加工した添付ファイル型 */
export type AttachmentViewModel = {
  id: string;
  originalName: string;
  fileFormat: string;
  isImage: boolean;
  fileSizeBytes: number;
  fileSizeLabel: string;
  imageDimensions: { width: number; height: number } | null;
  viewUrl: string;
  downloadUrl: string;
  markdownLink: string;
  downloadFileName: string;
};
