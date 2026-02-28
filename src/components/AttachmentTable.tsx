import type { AttachmentViewModel } from '../types';
import { AttachmentRow } from './AttachmentRow';

type Props = {
  attachments: AttachmentViewModel[];
};

export function AttachmentTable({ attachments }: Props) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table table-sm table-bordered table-hover mb-0">
        <thead className="table-light">
          <tr>
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
            <AttachmentRow key={a.id} attachment={a} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
