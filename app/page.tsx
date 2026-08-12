"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchBoardList} from "../lib/api/board/board.api";
import {BoardListResDto} from "../lib/api/board/board.types";

export default function Home() {

  const [totalCount, setTotalCount] = useState(0);
  const [boards, setBoards] = useState<BoardListResDto[]>([]);

  const answeredQuestionIds = new Set(
    boards
      .filter((board) => board.parentId != null)
      .map((board) => board.parentId)
  );

  useEffect(() => {
    const replyData = async () => {
      const response = await fetchBoardList({
        curPage: 1,
        rowSize: 10,
      });

      console.log(response);

      setBoards(response?.resultData);
      setTotalCount(response?.totalCount);
    };

    replyData();
  }, []);

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

      <main className="board-container" id="board">
        <section className="board-heading">
          <div>
            <p className="eyebrow">COMMUNITY</p>
            <h1>질문 게시판</h1>
            <p className="description">궁금한 내용을 자유롭게 묻고 답해보세요.</p>
          </div>
          <Link className="write-button" href="/board/create">
            <span aria-hidden="true">＋</span>
            글쓰기
          </Link>
        </section>

        <section className="board-panel" aria-label="게시글 목록">
          <div className="board-toolbar">
            <p>전체 <strong>{totalCount}</strong>개</p>
            <div className="search-form" role="search">
              <label className="sr-only" htmlFor="search-type">검색 기준</label>
              <select id="search-type" defaultValue="title" aria-label="검색 기준">
                <option value="title">제목</option>
                <option value="author">작성자</option>
              </select>
              <label className="sr-only" htmlFor="search">게시글 검색</label>
              <input id="search" type="search" placeholder="검색어를 입력하세요" />
              <button type="button" aria-label="검색">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4 4" />
                </svg>
              </button>
            </div>
          </div>

          <div className="post-table">
            <div className="table-row table-head" aria-hidden="true">
              <span>번호</span>
              <span>제목</span>
              <span>작성자</span>
              <span>작성일</span>
              <span>조회</span>
            </div>
            {boards?.map((board, index) => {
              const isReply = board.parentId != null;
              const hasReplies = !isReply && answeredQuestionIds.has(board.boardId);
              const groupId = board.parentId ?? board.boardId;
              const nextBoard = boards[index + 1];
              const nextGroupId = nextBoard
                ? nextBoard.parentId ?? nextBoard.boardId
                : null;
              const isGroupEnd = groupId !== nextGroupId;

              return (
                <article
                  className={`table-row post-row ${
                    isReply ? "reply-row" : "question-row"
                  } ${hasReplies ? "question-with-replies" : ""} ${
                    isGroupEnd ? "group-end" : ""
                  }`}
                  key={board.boardId}
                >
                  <span className="post-number">{board.boardId}</span>
                  <div className="post-title">
                    <span className={`answer-status ${
                      isReply
                        ? "answer-status-reply"
                        : hasReplies
                          ? "answer-status-complete"
                          : "answer-status-waiting"
                    }`}>
                      {isReply ? "답변" : hasReplies ? "답변완료" : "답변대기"}
                    </span>
                    <Link href={`/board/detail/${board.boardId}`}>{board.title}</Link>
                  </div>
                  <span className="post-author">{board.username}</span>
                  <time dateTime={board.regDate}>{board.regDate.split(".")[0].replace("T", " ")}</time>
                  <span className="post-views">{board.viewCount}</span>
                </article>
              );
            })}
          </div>

          <nav className="pagination" aria-label="페이지 이동">
            <button type="button" aria-label="이전 페이지" disabled>‹</button>
            <a className="current" href="#page-1" aria-current="page">1</a>
            <a href="#page-2">2</a>
            <button type="button" aria-label="다음 페이지">›</button>
          </nav>
        </section>
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
