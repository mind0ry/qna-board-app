import {BoardDetailResponse, BoardListParams, BoardListResponse} from "./board.types";

export const BOARD_API_URL = "http://localhost:8080/apis/board";

// 게시글 목록 조회
export async function fetchBoardList(params: BoardListParams): Promise<BoardListResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.set(key, String(value));
        }
    });

    const response = await fetch(`${BOARD_API_URL}?${searchParams.toString()}`);
    if (!response.ok) {
        throw new Error(`게시글 목록 조회 실패: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// 게시글 상세
export async function fetchBoardDetail(boardId: number): Promise<BoardDetailResponse> {
    const response = await fetch(`${BOARD_API_URL}/detail/${boardId}`);
    if (!response.ok) {
        throw new Error(`게시글 상세 조회 실패: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// 게시글 등록
export async function createBoard(formData: FormData) {

    const response = await fetch(`${BOARD_API_URL}/create`, {
        method: "POST",
        body: formData
    }).catch(error => {
        throw new Error(error);
    })

    if (!response.ok) {
        throw new Error(`게시글 등록 실패: ${response.status} ${response.statusText}`);
    }
}

// 수정 시 게시글 내용 가져오기
export async function fetchBoardDetailModify(boardId: number) {
    try {
        const response = await fetch(`${BOARD_API_URL}/detail/${boardId}/modify`)
        if (!response.ok) {
            throw new Error(`게시글 내용 조회 실패: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

// 게시글 수정
export async function modifyBoard(boardId: number, formData: FormData) {

    const response = await fetch(`${BOARD_API_URL}/${boardId}/modify`, {
        method: "POST",
        body: formData
    }).catch(error => {
        throw new Error(error);
    })

    if (!response.ok) {
        throw new Error(`게시글 수정 실패: ${response.status} ${response.statusText}`);
    }
}

// 게시글 삭제
export async function deleteBoard(boardId: number) {
    const response = await fetch(`${BOARD_API_URL}${boardId}/delete`, {
        method: "POST"
    }).catch(error => {
        throw new Error(error);
    })

    if (!response.ok) {
        throw new Error(`게시글 삭제 실패: ${response.status} ${response.statusText}`)
    }
}

// 게시글 답변
export async function replyBoard(patentId: number, formData: FormData) {

    const response = await fetch(`${BOARD_API_URL}/${patentId}/reply`, {
        method: "POST",
        body: formData
    }).catch(error => {
        throw new Error(error);
    })

    if (!response.ok) {
        throw new Error(`답변 실패: ${response.status} ${response.statusText}`);
    }
}
