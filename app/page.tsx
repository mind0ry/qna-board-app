"use client"

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { fetchBoardList } from "../lib/api/board/board.api";
import { BoardListResDto } from "../lib/api/board/board.types";

export default function Home() {
  const rowSize = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [boards, setBoards] = useState<BoardListResDto[]>([]);
  const [curPage, setCurPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchType, setSearchType] = useState<"title" | "username">("title");
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState({
    searchType: "title" as "title" | "username",
    keyword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const answeredQuestionIds = new Set(
    boards
      .filter((board) => board.parentId != null)
      .map((board) => board.parentId)
  );

  useEffect(() => {
    let isCurrent = true;

    const replyData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetchBoardList({
          isPaging: true,
          curPage,
          rowSize,
          searchType: search.searchType,
          keyword: search.keyword,
        });

        if (!isCurrent) return;
        setBoards(response.resultData ?? []);
        setTotalCount(response.totalCount ?? 0);
        setTotalPage(response.pagingData?.totalPage ?? 0);
      } catch {
        if (!isCurrent) return;
        setBoards([]);
        setTotalCount(0);
        setTotalPage(0);
        setError("게시글 목록을 불러오지 못했습니다.");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    replyData();
    return () => {
      isCurrent = false;
    };
  }, [curPage, search]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurPage(1);
    setSearch({ searchType, keyword: keyword.trim() });
  };

  const pageGroupStart = Math.floor((curPage - 1) / 5) * 5 + 1;
  const pages = Array.from(
    { length: Math.max(0, Math.min(5, totalPage - pageGroupStart + 1)) },
    (_, index) => pageGroupStart + index,
  );

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
            <form className="search-form" role="search" onSubmit={handleSearch}>
              <label className="sr-only" htmlFor="search-type">검색 기준</label>
              <select
                id="search-type"
                value={searchType}
                onChange={(event) => setSearchType(event.target.value as "title" | "username")}
                aria-label="검색 기준"
              >
                <option value="title">제목</option>
                <option value="username">작성자</option>
              </select>
              <label className="sr-only" htmlFor="search">게시글 검색</label>
              <input
                id="search"
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="검색어를 입력하세요"
              />
              <button type="submit" aria-label="검색">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4 4" />
                </svg>
              </button>
            </form>
          </div>

          <div className="post-table">
            <div className="table-row table-head" aria-hidden="true">
              <span>번호</span>
              <span>제목</span>
              <span>작성자</span>
              <span>작성일</span>
              <span>조회</span>
            </div>
            {!isLoading && !error && boards.length === 0 && (
              <p className="board-message">검색 결과가 없습니다.</p>
            )}
            {isLoading && <p className="board-message">불러오는 중...</p>}
            {error && <p className="board-message board-error">{error}</p>}
            {!isLoading && !error && boards.map((board, index) => {
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
            <button
              type="button"
              aria-label="이전 페이지"
              onClick={() => setCurPage((page) => Math.max(1, page - 1))}
              disabled={curPage <= 1 || isLoading}
            >‹</button>
            {pages.map((page) => (
              <button
                type="button"
                className={page === curPage ? "current" : undefined}
                aria-current={page === curPage ? "page" : undefined}
                onClick={() => setCurPage(page)}
                disabled={isLoading}
                key={page}
              >{page}</button>
            ))}
            <button
              type="button"
              aria-label="다음 페이지"
              onClick={() => setCurPage((page) => Math.min(totalPage, page + 1))}
              disabled={curPage >= totalPage || isLoading}
            >›</button>
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
