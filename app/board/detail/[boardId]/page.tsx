"use client"

import Link from "next/link";
import {fetchBoardDetail} from "@/lib/api/board/board.api";
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {BoardDetailResDto} from "@/lib/api/board/board.types";
import {deleteBoard} from "@/lib/api/board/board.api";

export default function DetailPage() {

  const router = useRouter();
  const params = useParams<{ boardId: string }>();
  const [boardDetail, setBoardDetail] = useState<BoardDetailResDto>();

  useEffect(() => {
    const fetchData  = async() => {
       const response = await fetchBoardDetail(Number(params.boardId));

       console.log(response);

       setBoardDetail(response.resultData);
    }

    fetchData();
  }, []);

  const handleDelete = async () => {
    await deleteBoard(Number(params.boardId));
    router.replace("/");
  };

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

      <main className="content-container">
        <div className="breadcrumb"><Link href="/public">게시판</Link><span>›</span><span>상세보기</span></div>
        <article className="detail-panel">
          <header className="detail-header">
            <h1>{ boardDetail?.title }</h1>
            <div className="post-meta">
              <strong>{ boardDetail?.username }</strong><span> {boardDetail?.regDate.split(".")[0].replace("T", " ")} </span><span>조회 {boardDetail?.viewCount}</span>
            </div>
          </header>
          <div className="detail-body">
            <p>{ boardDetail?.content }</p>
          </div>
          <section className="detail-attachments" aria-labelledby="attachment-title">
            <div className="attachment-title-row">
              <h2 id="attachment-title">첨부파일</h2>
              <span>2개</span>
            </div>
            <ul className="download-file-list">
              <li>
                <span><strong>요구사항.pdf</strong><small>1.2 MB</small></span>
                <button type="button" className="download-button">다운로드</button>
              </li>
              <li>
                <span><strong>화면예시.png</strong><small>842 KB</small></span>
                <button type="button" className="download-button">다운로드</button>
              </li>
            </ul>
          </section>
          <div className="detail-actions">
            <Link className="text-button"  href={`/board/modify/${params.boardId}`}>수정</Link>
            <button className="text-button danger" type="button" onClick={handleDelete}>삭제</button>
            {boardDetail?.parentId == null && (
              <Link className="answer-button" href={`/board/reply/${params.boardId}`}>답변</Link>
            )}
          </div>
        </article>
        <div className="page-actions"><Link className="secondary-button" href="/public">목록으로</Link></div>
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
