"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import {modifyBoard, fetchBoardDetail, fetchBoardDetailModify} from "../../../../lib/api/board/board.api";
import {useParams, useRouter} from "next/navigation";
import {BoardDetailResDto} from "@/lib/api/board/board.types";
import AttachmentUploader from "../../../components/AttachmentUploader";

export default function ModifyPage() {

  const params = useParams<{boardId : string}>();

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const ModifyData = async() => {
      const response = await fetchBoardDetailModify(Number(params.boardId));

      const data = response?.resultData

      setUsername(data?.username ?? "");
      setTitle(data?.title ?? "");
      setContent(data?.content ?? "");
    }

    ModifyData();
  }, []);

  const handleSubmit = async () => {

    const formData = new FormData();
    formData.append("username", username.trim());
    formData.append("title", title.trim());
    formData.append("content", content.trim());

    await modifyBoard(Number(params.boardId), formData);

    router.replace("/");
  }

  const handleBack = () => {
    router.back();
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/public" aria-label="Q&A 홈">Q&amp;A</Link>
          <nav className="main-nav" aria-label="주요 메뉴">
            <Link className="active" href="/public">게시판</Link>
          </nav>
        </div>
      </header>

      <main className="content-container write-container">
        <div className="breadcrumb"><Link href="/public">게시판</Link><span>›</span><span>수정하기</span></div>
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
          <AttachmentUploader />
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
    </div>
  );
}
