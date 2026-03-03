import { useEffect, useRef } from 'react';
import type { AttachmentViewModel, DownloadFileNameFormat } from '../types';
import { AttachmentRow } from './AttachmentRow';

type Props = {
  attachments: AttachmentViewModel[];
  format: DownloadFileNameFormat;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
};

export function AttachmentTable({ attachments, format, selectedIds, onToggle, onToggleAll }: Props) {
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const allChecked  = attachments.length > 0 && selectedIds.size === attachments.length;
  const someChecked = selectedIds.size > 0 && !allChecked;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someChecked;
    }
  }, [someChecked]);

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
            <th style={{ textAlign: 'center' }}>
              <input
                type="checkbox"
                ref={headerCheckboxRef}
                checked={allChecked}
                onChange={onToggleAll}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {attachments.map((a) => (
            <AttachmentRow
              key={a.id}
              attachment={a}
              format={format}
              checked={selectedIds.has(a.id)}
              onToggle={() => onToggle(a.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
