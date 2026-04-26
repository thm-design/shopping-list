import { X, Copy } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface ShareModalProps {
  listName: string;
  onClose: () => void;
}

export function ShareModal({ listName, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (canvasRef.current && shareUrl) {
      QRCode.toCanvas(canvasRef.current, shareUrl, {
        width: 160,
        margin: 0,
        color: {
          dark: '#111',
          light: '#fff',
        },
      }, (error) => {
        if (error) console.error('QR Code generation failed', error);
      });
    }
  }, [shareUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'oklch(0% 0 0 / 0.5)',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--r-xl)',
          padding: 24,
          maxWidth: 340,
          width: '90%',
          boxShadow: '0 8px 24px oklch(0% 0 0 / 0.14)',
          animation: 'slideUp 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Share "{listName || "AirList"}"</h3>
          <button
            onClick={onClose}
            style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 'var(--r-sm)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* QR code */}
        <div
          style={{
            width: 160,
            height: 160,
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            overflow: 'hidden',
          }}
        >
          <canvas ref={canvasRef} style={{ width: '100% !important', height: '100% !important' }} />
        </div>

        {/* URL row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            readOnly
            value={shareUrl}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: 13,
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)',
              color: 'var(--text-2)',
              outline: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              fontWeight: 600,
              background: copied ? 'oklch(52% 0.17 145)' : 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--r-sm)',
              cursor: 'pointer',
              transition: 'background 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Copy size={14} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}