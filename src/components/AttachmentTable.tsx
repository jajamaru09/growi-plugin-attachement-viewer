import type { AttachmentViewModel, DownloadFileNameFormat } from '../types';
import { AttachmentRow } from './AttachmentRow';

type Props = {
  attachments: AttachmentViewModel[];
  format: DownloadFileNameFormat;
};

export function AttachmentTable({ attachments, format }: Props) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table table-sm table-bordered table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th>プレビュー</th>
            <th>ファイル名</th>
            <th>ファイルID</th>
            <th>サイズ</th>
            <th>寸法</th>
            <th>MDリンク</th>
            <th>URL</th>
            <th>DL</th>
          </tr>
        </thead>
        <tbody>
          {attachments.map((a) => (
            <AttachmentRow key={a.id} attachment={a} format={format} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
