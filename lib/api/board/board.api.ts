import {
    BoardListParams, CreateBoardReqDto, ModifyBoardReqDto, BoardDetailResDto, BoardListResDto
} from "./board.types";

// 게시글 목록 조회
export async function fetchBoardList(params: BoardListParams) {
    try {
        const response = await fetch("http://localhost:8080/apis/board")
        if (!response.ok) {
            throw new Error(`게시글 목록 조회 실패: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

// 게시글 상세
export async function fetchBoardDetail(boardId: number) {
    try {
        const response = await fetch(`http://localhost:8080/apis/board/detail/${boardId}`)
        if (!response.ok) {
            throw new Error(`게시글 상세 조회 실패: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

// 게시글 등록
export async function createBoard(formData: FormData) {

    const response = await fetch("http://localhost:8080/apis/board/create", {
        method: "POST",
        body: formData
    }).catch(error => {
        throw new Error(error);
    })

    if (!response.ok) {
        throw new Error(`게시글 등록 실패: ${response.status} ${response.statusText}`);
    }
}

// 게시글 수정
export async function modifyBoard(formData: FormData) {

    const response = await fetch("http://localhost:8080/apis/board/modify", {
        method: "POST",
        body: formData
    }).catch(error => {
        throw new Error(error);
    })

    if (!response.ok) {
        throw new Error(`게시글 수정 실패: ${response.status} ${response.statusText}`);
    }
}