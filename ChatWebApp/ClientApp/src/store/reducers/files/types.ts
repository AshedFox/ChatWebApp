import {Action} from "@reduxjs/toolkit";
import {FileModel} from "../../../models/FileModel";
import {ChatModel} from "../../../models/ChatModel";
import {State} from "../root";

export enum FilesActionType {
    PostRequest = "POST_FILES_REQUEST",
    PostError = "POST_FILES_ERROR",
    PostSuccess = "POST_FILES_SUCCESS",
    GetRequest = "GET_FILES_REQUEST",
    GetError = "GET_FILES_ERROR",
    GetSuccess = "GET_FILES_SUCCESS",
}

type PostRequestAction = Action<FilesActionType.PostRequest>;
type PostErrorAction = Action<FilesActionType.PostError> & {
    error: string
}
type PostSuccessAction = Action<FilesActionType.PostSuccess> & {
    payload: FileModel
}
type GetRequestAction = Action<FilesActionType.GetRequest>;
type GetErrorAction = Action<FilesActionType.GetError> & {
    error: string
}
type GetSuccessAction = Action<FilesActionType.GetSuccess> & {
    payload: FileModel
}

export type FilesAction =
    PostRequestAction | PostErrorAction | PostSuccessAction |
    GetRequestAction | GetErrorAction | GetSuccessAction

export type FilesData = {

}

export type FilesLoading = boolean

export type FilesState = State<FilesData, FilesLoading>
