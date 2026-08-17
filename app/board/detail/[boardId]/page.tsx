"use client"

import Link from "next/link";
import { BOARD_API_URL, deleteBoard, fetchBoardDetail } from "@/lib/api/board/board.api";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BoardDetailResDto } from "@/lib/api/board/board.types";
import AlertPopup from "../../../components/AlertPopup";

export default function DetailPage() {
  const router = useRouter();
  const params = useParams<{ boardId: string }>();
  const [boardDetail, setBoardDetail] = useState<BoardDetailResDto>();
  const [deletePopup, setDeletePopup] = useState<"confirm" | "completed">();

  useEffect(() => {
    let isCurrent = true;

    const fetchData = async () => {
      const response = await fetchBoardDetail(Number(params.boardId));
      if (isCurrent) setBoardDetail(response.resultData);
    };

    fetchData();
    return () => {
      isCurrent = false;
    };
  }, [params.boardId]);

  const handleDelete = async () => {
    await deleteBoard(Number(params.boardId));
    setDeletePopup("completed");
  };

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

      <main className="content-container">
        <div className="breadcrumb"><Link href="/">게시판</Link><span>›</span><span>상세보기</span></div>
        <article className="detail-panel">
          <header className="detail-header">
            <h1>{boardDetail?.title}</h1>
            <div className="post-meta">
              <strong>{boardDetail?.username}</strong>
              <span>{boardDetail?.regDate.split(".")[0].replace("T", " ")}</span>
              <span>조회 {boardDetail?.viewCount}</span>
            </div>
          </header>
          <div className="detail-body">
            <p>{boardDetail?.content}</p>
          </div>
          <section className="detail-attachments" aria-labelledby="attachment-title">
            <div className="attachment-title-row">
              <h2 id="attachment-title">첨부파일</h2>
              <span>{boardDetail?.files?.length ?? 0}개</span>
            </div>
            {boardDetail?.files?.length ? (
              <ul className="download-file-list">
                {boardDetail.files.map((file) => (
                  <li key={file.fileSeq}>
                    <span>
                      <strong>{file.fileNm}</strong>
                      <small>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</small>
                    </span>
                    <a
                      className="download-button"
                      href={`${BOARD_API_URL}/${params.boardId}/files/${file.fileSeq}/download`}
                    >다운로드</a>
                  </li>
                ))}
              </ul>
            ) : <p className="attachment-help">첨부파일이 없습니다.</p>}
          </section>
          <div className="detail-actions">
            <Link className="text-button" href={`/board/modify/${params.boardId}`}>수정</Link>
            <button className="text-button danger" type="button" onClick={() => setDeletePopup("confirm")}>삭제</button>
            {boardDetail?.parentId == null && (
              <Link className="answer-button" href={`/board/reply/${params.boardId}`}>답변</Link>
            )}
          </div>
        </article>
        <div className="page-actions"><Link className="secondary-button" href="/">목록으로</Link></div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p><strong>Q&amp;A Board</strong> · 함께 묻고 답하는 공간</p>
          <p>© 2026 Q&amp;A Board</p>
        </div>
      </footer>
      <AlertPopup
        open={Boolean(deletePopup)}
        title={deletePopup === "confirm" ? "삭제 확인" : "알림"}
        message={deletePopup === "confirm" ? "게시글을 삭제하시겠습니까?" : "게시글이 삭제되었습니다."}
        confirmText={deletePopup === "confirm" ? "삭제" : "확인"}
        onConfirm={deletePopup === "confirm" ? handleDelete : () => router.replace("/")}
        onCancel={deletePopup === "confirm" ? () => setDeletePopup(undefined) : undefined}
      />
    </div>
  );
}
