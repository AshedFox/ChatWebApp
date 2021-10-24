import {State} from "../root";
import {Action} from "@reduxjs/toolkit";
import {ChatModel} from "../../../models/ChatModel";
import {UserModel} from "../../../models/UserModel";
import {MessagesAction} from "../messages/types";

export enum ChatsActionType {
    GetRequest = "GET_CHATS_REQUEST",
    GetSuccess = "GET_CHATS_SUCCESS",
    GetError = "GET_CHATS_ERROR",
    PostRequest = "POST_CHATS_REQUEST",
    PostSuccess = "POST_CHATS_SUCCESS",
    PostError = "POST_CHATS_ERROR",
    SearchRequest = "SEARCH_CHATS_REQUEST",
    SearchSuccess = "SEARCH_CHATS_SUCCESS",
    SearchError = "SEARCH_CHATS_ERROR",
    StartSearch = "START_SEARCH_CHATS",
    StopSearch = "STOP_SEARCH_CHATS",
    SetCurrent = "SET_CURRENT_CHAT",
    UnsetCurrent = "UNSET_CURRENT_CHAT",
    AddNew = "ADD_NEW_CHAT",
    Remove = "REMOVE_CHAT",
    AddNewUser = "ADD_NEW_CHAT_USER",
    RemoveUser = "REMOVE_CHAT_USER",
}

type GetRequestAction = Action<ChatsActionType.GetRequest>
type GetSuccessAction = Action<ChatsActionType.GetSuccess> & {
    payload: ChatModel[]
}
type GetErrorAction = Action<ChatsActionType.GetError> & {
    error: string
}
type PostRequestAction = Action<ChatsActionType.PostRequest>
type PostSuccessAction = Action<ChatsActionType.PostSuccess> & {
    payload: ChatModel
}
type PostErrorAction = Action<ChatsActionType.PostError> & {
    error: string
}
type SearchRequestAction = Action<ChatsActionType.SearchRequest>
type SearchSuccessAction = Action<ChatsActionType.SearchSuccess> & {
    payload: ChatModel[]
}
type SearchErrorAction = Action<ChatsActionType.SearchError> & {
    error: string
}
type StartSearchAction = Action<ChatsActionType.StartSearch>;
type StopSearchAction = Action<ChatsActionType.StopSearch>;
type SetCurrentAction = Action<ChatsActionType.SetCurrent> & {
    payload: ChatModel
}
type UnsetCurrentAction = Action<ChatsActionType.UnsetCurrent>;
type AddNewAction = Action<ChatsActionType.AddNew> & {
    payload: ChatModel
};
type RemoveAction = Action<ChatsActionType.Remove> & {
    payload: string
}
type AddNewUserAction = Action<ChatsActionType.AddNewUser> & {
    payload: {
        chatId: string,
        user: UserModel
    }
};
type RemoveUserAction = Action<ChatsActionType.RemoveUser> & {
    payload: {
        chatId: string,
        userId: string
    }
}

export type ChatsAction = MessagesAction |
    GetRequestAction | GetSuccessAction | GetErrorAction |
    PostRequestAction | PostSuccessAction | PostErrorAction |
    SearchRequestAction | SearchSuccessAction | SearchErrorAction |
    StartSearchAction | StopSearchAction | SetCurrentAction |
    UnsetCurrentAction | AddNewAction | RemoveAction |
    AddNewUserAction | RemoveUserAction

export type ChatsData = {
    chats: ChatModel[]
    searchChats: ChatModel[]
    currentChat?: ChatModel
    isSearch: boolean
}

export type ChatsLoading = {
    messagesLoading: boolean
    chatsLoading: boolean
}

export type ChatsState = State<ChatsData, ChatsLoading>
