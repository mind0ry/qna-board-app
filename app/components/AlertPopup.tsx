"use client";

interface AlertPopupProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export default function AlertPopup({
  open,
  title = "알림",
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: AlertPopupProps) {
  if (!open) return null;

  return (
    <div className="alert-popup-backdrop" role="presentation">
      <div className="alert-popup" role="alertdialog" aria-modal="true" aria-labelledby="alert-popup-title">
        <h2 id="alert-popup-title">{title}</h2>
        <p>{message}</p>
        <div className="alert-popup-actions">
          {onCancel && <button type="button" className="secondary-button" onClick={onCancel}>{cancelText}</button>}
          <button type="button" className="primary-button" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
