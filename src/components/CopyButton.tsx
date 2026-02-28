import { useState } from 'react';

type Props = {
  text: string;
  label?: string;
};

export function CopyButton({ text, label = 'コピー' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('[AttachmentViewer] clipboard write failed', e);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-secondary"
      onClick={handleClick}
      title={text}
      style={{ whiteSpace: 'nowrap' }}
    >
      {copied ? '✓ コピー済み' : label}
    </button>
  );
}
