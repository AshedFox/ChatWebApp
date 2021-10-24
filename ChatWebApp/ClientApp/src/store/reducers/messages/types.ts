import {MessageModel} from "../../../models/MessageModel";
import {Action} from "@reduxjs/toolkit";
import {MessagesSinceModel} from "../../../models/MessagesSinceModel";

export enum MessagesActionType {
    GetRequest = "GET_MESSAGES_REQUEST",
    GetSuccess = "GET_MESSAGES_SUCCESS",
    GetError = "GET_MESSAGES_ERROR",
    GetSinceRequest = "GET_SINCE_MESSAGES_REQUEST",
    GetSinceSuccess = "GET_SINCE_MESSAGES_SUCCESS",
    GetSinceError = "GET_SINCE_MESSAGES_ERROR",
    PostRequest = "POST_MESSAGE_REQUEST",
    PostSuccess = "POST_MESSAGES_SUCCESS",
    PostError = "POST_MESSAGES_ERROR",
    ReceiveMessage = "RECEIVE_MESSAGES"
}

type GetRequestAction = Action<MessagesActionType.GetRequest>
type GetSuccessAction = Action<MessagesActionType.GetSuccess> & {
    payload: MessageModel[]
}
type GetErrorAction = Action<MessagesActionType.GetError> & {
    error: string
}
type GetSinceRequestAction = Action<MessagesActionType.GetSinceRequest>
type GetSinceSuccessAction = Action<MessagesActionType.GetSinceSuccess> & {
    payload: MessagesSinceModel
}
type GetSinceErrorAction = Action<MessagesActionType.GetSinceError> & {
    error: string
}
type PostRequestAction = Action<MessagesActionType.PostRequest>
type PostSuccessAction = Action<MessagesActionType.PostSuccess> & {
    payload: MessageModel
}
type PostErrorAction = Action<MessagesActionType.PostError> & {
    error: string
}
type ReceiveMessage = Action<MessagesActionType.ReceiveMessage> & {
    payload: MessageModel
}

export type MessagesAction =
    GetRequestAction | GetSuccessAction | GetErrorAction |
    GetSinceRequestAction | GetSinceSuccessAction | GetSinceErrorAction |
    PostRequestAction | PostSuccessAction | PostErrorAction |
    ReceiveMessage
