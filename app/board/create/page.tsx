"use client"

import Link from "next/link";
import { useState } from "react";
import {createBoard} from "@/lib/api/board/board.api";
import { useRouter } from "next/navigation";
import AttachmentUploader from "../../components/AttachmentUploader";
import AlertPopup from "../../components/AlertPopup";

export default function CreatePage() {

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [alert, setAlert] = useState<{ message: string; completed?: boolean }>();

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

    await createBoard(formData);

    setAlert({ message: "게시글이 작성되었습니다.", completed: true });
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
        <div className="breadcrumb"><Link href="/">게시판</Link><span>›</span><span>글쓰기</span></div>
        <section className="form-heading">
          <p className="eyebrow">NEW POST</p>
          <h1>새 글 작성</h1>
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
          <AttachmentUploader onChange={setFiles} />
          <div className="form-actions">
            <Link className="secondary-button" href="/">취소</Link>
            <button className="primary-button" type="button" onClick={handleSubmit}>등록하기</button>
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
