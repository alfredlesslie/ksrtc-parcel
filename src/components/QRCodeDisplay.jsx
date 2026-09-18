import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export const QRCodeDisplay = ({ value, size = 160, className = '' }) => {
  const [qrSrc, setQrSrc] = useState('');

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        setQrSrc(url);
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });
  }, [value, size]);

  if (!qrSrc) {
    return (
      <div
        className={`bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 text-xs ${className}`}
        style={{ width: size, height: size }}
      >
        Generating QR...
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center p-2 bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      <img
        src={qrSrc}
        alt={`QR Code for consignment ${value}`}
        style={{ width: size, height: size }}
        className="rounded-lg block"
      />
      <span className="mt-1.5 font-mono text-[11px] font-medium tracking-wider text-slate-500">
        {value}
      </span>
    </div>
  );
};
