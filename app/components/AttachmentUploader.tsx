"use client";

import { ChangeEvent, useRef, useState } from "react";

interface AttachmentUploaderProps {
  onChange?: (files: File[]) => void;
}

export default function AttachmentUploader({ onChange }: AttachmentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const updateFiles = (nextFiles: File[]) => {
    setFiles(nextFiles);
    onChange?.(nextFiles);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateFiles(Array.from(event.target.files ?? []));
  };

  const removeFile = (index: number) => {
    const nextFiles = files.filter((_, fileIndex) => fileIndex !== index);
    updateFiles(nextFiles);

    if (nextFiles.length === 0 && inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="form-field">
      <label htmlFor="files">첨부파일</label>
      <div className="attachment-picker">
        <input
          ref={inputRef}
          id="files"
          type="file"
          multiple
          onChange={handleChange}
        />
        <label className="file-select-button" htmlFor="files">파일 선택</label>
        <span>{files.length > 0 ? `${files.length}개 선택됨` : "선택된 파일 없음"}</span>
      </div>
      <p className="attachment-help">파일당 최대 10MB까지 업로드할 수 있습니다.</p>
      {files.length > 0 && (
        <ul className="selected-file-list">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.lastModified}`}>
              <span className="file-name">{file.name}</span>
              <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              <button type="button" onClick={() => removeFile(index)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
