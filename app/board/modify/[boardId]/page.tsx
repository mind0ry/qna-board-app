"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import {modifyBoard, fetchBoardDetailModify} from "@/lib/api/board/board.api";
import {useParams, useRouter} from "next/navigation";
import {BoardFileResDto} from "@/lib/api/board/board.types";
import AttachmentUploader from "../../../components/AttachmentUploader";
import AlertPopup from "../../../components/AlertPopup";

export default function ModifyPage() {

  const params = useParams<{boardId : string}>();

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<BoardFileResDto[]>([]);
  const [deleteFileSeqs, setDeleteFileSeqs] = useState<number[]>([]);
  const [alert, setAlert] = useState<{ message: string; completed?: boolean }>();

  useEffect(() => {
    const ModifyData = async() => {
      const response = await fetchBoardDetailModify(Number(params.boardId));

      const data = response?.resultData

      setUsername(data?.username ?? "");
      setTitle(data?.title ?? "");
      setContent(data?.content ?? "");
      setExistingFiles(data?.files ?? []);
    }

    ModifyData();
  }, [params.boardId]);

  const handleSubmit = async () => {

    if (!username.trim() || !title.trim() || !content.trim()) {
      setAlert({ message: "작성자, 제목, 내용을 모두 입력해주세요." });
      return;
    }

    const formData = new FormData();
    formData.append("username", username.trim());
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    files.forEach(file => formData.append("files", file));
    deleteFileSeqs.forEach(fileSeq => formData.append("deleteFileSeqs", String(fileSeq)));

    await modifyBoard(Number(params.boardId), formData);

    setAlert({ message: "게시글이 수정되었습니다.", completed: true });
  }

  const handleBack = () => {
    router.back();
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Q&A 홈">Q&amp;A</Link>
          <nav className="main-nav" aria-label="주요 메뉴">
            <Link className="active" href="/">게시판</Link>
          </nav>
        </div>
      </header>

      <main className="content-container write-container">
        <div className="breadcrumb"><Link href="/">게시판</Link><span>›</span><span>수정하기</span></div>
        <section className="form-heading">
          <h1>게시글 수정</h1>
        </section>
        <div className="write-panel">
          <div className="form-field compact-field">
            <label htmlFor="author">작성자 <span>*</span></label>
            <input id="author" placeholder="작성자명" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="title">제목 <span>*</span></label>
            <input id="title" placeholder="제목을 입력하세요" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="content">내용 <span>*</span></label>
            <textarea id="content" placeholder="내용을 입력하세요" rows={14} value={content} onChange={e => setContent(e.target.value)} />
          </div>
          {existingFiles.length > 0 && (
            <div className="form-field">
              <label>기존 첨부파일</label>
              <ul className="selected-file-list">
                {existingFiles.map(file => (
                  <li key={file.fileSeq}>
                    <span className="file-name">{file.fileNm}</span>
                    <span className="file-size">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    <button type="button" onClick={() => {
                      setExistingFiles(current => current.filter(item => item.fileSeq !== file.fileSeq));
                      setDeleteFileSeqs(current => [...current, file.fileSeq]);
                    }}>삭제</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <AttachmentUploader onChange={setFiles} />
          <div className="form-actions">
            <button className="secondary-button" onClick={handleBack}>취소</button>
            <button className="primary-button" type="button" onClick={handleSubmit}>수정하기</button>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p><strong>Q&amp;A Board</strong> · 함께 묻고 답하는 공간</p>
          <p>© 2026 Q&amp;A Board</p>
        </div>
      </footer>
      <AlertPopup
        open={Boolean(alert)}
        message={alert?.message ?? ""}
        onConfirm={() => alert?.completed ? router.replace("/") : setAlert(undefined)}
      />
    </div>
  );
}
