const posts = [
  {
    id: 8,
    category: "질문",
    title: "Next.js에서 환경 변수는 어떻게 설정하나요?",
    author: "김민수",
    date: "2026.08.09",
    views: 24,
  },
  {
    id: 7,
    category: "질문",
    title: "게시글 수정 기능을 구현하고 싶어요",
    author: "이지은",
    date: "2026.08.08",
    views: 18,
  },
  {
    id: 6,
    category: "정보",
    title: "처음 시작하는 분들을 위한 게시판 이용 안내",
    author: "관리자",
    date: "2026.08.07",
    views: 102,
  },
  {
    id: 5,
    category: "질문",
    title: "React 컴포넌트 구조에 대해 질문드립니다",
    author: "박서준",
    date: "2026.08.06",
    views: 31,
  },
  {
    id: 4,
    category: "자유",
    title: "반갑습니다. 오늘 가입했어요!",
    author: "최유진",
    date: "2026.08.05",
    views: 15,
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#" aria-label="Q&A 홈">
            Q&amp;A
          </a>
          <nav className="main-nav" aria-label="주요 메뉴">
            <a className="active" href="#board">게시판</a>
            <a href="#about">이용 안내</a>
          </nav>
          <div className="account-links">
            <a href="#login">로그인</a>
            <a className="join-link" href="#join">회원가입</a>
          </div>
        </div>
      </header>

      <main className="board-container" id="board">
        <section className="board-heading">
          <div>
            <p className="eyebrow">COMMUNITY</p>
            <h1>질문 게시판</h1>
            <p className="description">궁금한 내용을 자유롭게 묻고 답해보세요.</p>
          </div>
          <a className="write-button" href="#write">
            <span aria-hidden="true">＋</span>
            글쓰기
          </a>
        </section>

        <section className="board-panel" aria-label="게시글 목록">
          <div className="board-toolbar">
            <p>전체 <strong>8</strong>개</p>
            <form className="search-form" action="#" role="search">
              <label className="sr-only" htmlFor="search">게시글 검색</label>
              <input id="search" name="q" type="search" placeholder="검색어를 입력하세요" />
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
            {posts.map((post) => (
              <article className="table-row post-row" key={post.id}>
                <span className="post-number">{post.id}</span>
                <div className="post-title">
                  <span className={`category category-${post.category}`}>{post.category}</span>
                  <a href={`#post-${post.id}`}>{post.title}</a>
                </div>
                <span className="post-author">{post.author}</span>
                <time dateTime={post.date.replaceAll(".", "-")}>{post.date}</time>
                <span className="post-views">{post.views}</span>
              </article>
            ))}
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
