// 게시글 목록 검색
export interface BoardListParams extends Record<string, unknown> {
    isPaging?: boolean;
    curPage?: number;
    rowSize?: number;
    searchType?: "title" | "username";
    keyword?: string;
}

// 게시글 목록 (BoardListResDto)
export interface BoardListResDto extends Record<string, unknown> {
    boardId: number;
    parentId: number | null;
    title: string;
    content: string;
    username: string;
    regDate: string;
    viewCount: number;
}

// 게시글 상세 (BoardDetailResDto)
export interface BoardDetailResDto extends Record<string, unknown> {
    boardId: number;
    parentId: number | null;
    title: string;
    content: string;
    username: string;
    regDate: string;
    updDate?: string;
    viewCount: number;
}

// 게시글 등록 (CreateBoardReqDto)
export interface CreateBoardReqDto extends Record<string, unknown> {
    title: string;
    content: string;
    username: string;
}

// 게시글 수정 (ModifyBoardReqDto)
export interface ModifyBoardReqDto extends Record<string, unknown> {
    title: string;
    content: string;
    username: string;
}
