import Link from "next/link";

export default function CreatePage() {
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
            <input id="author" placeholder="작성자명" />
          </div>
          <div className="form-field">
            <label htmlFor="title">제목 <span>*</span></label>
            <input id="title" placeholder="제목을 입력하세요" />
          </div>
          <div className="form-field">
            <label htmlFor="content">내용 <span>*</span></label>
            <textarea id="content" placeholder="내용을 입력하세요" rows={14} />
          </div>
          <div className="form-actions">
            <Link className="secondary-button" href="/">취소</Link>
            <button className="primary-button" type="button">등록하기</button>
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
