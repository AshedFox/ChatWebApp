import {appSettings} from "../../appsettings";
import {authHeader} from "../../helpers/authHeader";
import {Dispatch} from "@reduxjs/toolkit";
import {ChatsAction, ChatsActionType} from "../reducers/chats/types";
import {ChatModel} from "../../models/ChatModel";
import {ChatDTO} from "../../DTOs/ChatDTO";
import {UserModel} from "../../models/UserModel";


const requestGet = (userId:string) => {
    return async (dispatch: Dispatch<ChatsAction>) => {
        dispatch({type: ChatsActionType.GetRequest});
        const headersInit = new Headers(authHeader());

        let query = appSettings.apiUrl + `/chats?userId=${userId}`;

        try {
            const response = await fetch(
            query,
            {
                headers: headersInit
            })

            if (response.ok) {
                const data = await response.json();
                dispatch({type: ChatsActionType.GetSuccess, payload: data})
            }
            else dispatch({type: ChatsActionType.GetError, error: response.statusText});
        }
        catch (error) {
            dispatch({type: ChatsActionType.GetError, error: error.message})
        }
    }
}

const requestPost = (chatData:ChatDTO) => {
    return async (dispatch: Dispatch<ChatsAction>) => {
        dispatch({type: ChatsActionType.PostRequest});
        const headersInit = new Headers(authHeader());
        headersInit.append("Content-Type", "application/json");

        let query = appSettings.apiUrl + `/chats`;
        try {
            const response = await fetch(
                query,
                {
                    method: "POST",
                    headers: headersInit,
                    body: JSON.stringify(chatData)
                })

            if (response.ok) {
                const data = await response.json();
                dispatch({type: ChatsActionType.PostSuccess, payload: data})
            }
            else {
                dispatch({type: ChatsActionType.PostError, error: response.statusText})
            }
        }
        catch (error){
            dispatch({type: ChatsActionType.PostError, error: error.message})
        }
    }
}

const requestSearch = (pattern:string) => {
    return async (dispatch: Dispatch<ChatsAction>) => {
        dispatch({type: ChatsActionType.SearchRequest});
        const headersInit = new Headers(authHeader());
        let query = appSettings.apiUrl + `/chats/search?pattern=${pattern}`;

        try {
            const response = await fetch(
                query,
                {
                    headers: headersInit
                })

            const data:ChatModel[] = await response.json();
            dispatch({type: ChatsActionType.SearchSuccess, payload: data})
        }
        catch (error){
            dispatch({type: ChatsActionType.SearchError, error: error.message})
        }
    }
}

const startSearch = ():ChatsAction => {
    return {type: ChatsActionType.StartSearch}
}

const stopSearch = ():ChatsAction => {
    return {type: ChatsActionType.StopSearch}
}

const setCurrent = (chat:ChatModel):ChatsAction => {
    return {type: ChatsActionType.SetCurrent, payload: chat}
}

const unsetCurrent = ():ChatsAction => {
    return {type: ChatsActionType.UnsetCurrent}
}

const addNew = (chat: ChatModel):ChatsAction => {
    return {type: ChatsActionType.AddNew, payload: chat}
}


const remove = (chatId: string):ChatsAction => {
    return {
        type: ChatsActionType.Remove,
        payload:  chatId,
    }
}

const addNewUser = (chatId: string, user:UserModel):ChatsAction => {
    return {
        type: ChatsActionType.AddNewUser,
        payload: {
            chatId: chatId,
            user: user
        }
    }
}

const removeUser = (chatId: string, userId: string):ChatsAction => {
    return {
        type: ChatsActionType.RemoveUser,
        payload: {
            chatId: chatId,
            userId: userId
        }
    }
}

export const chatsActions = {
    getChats: requestGet,
    postChat: requestPost,
    searchChats: requestSearch,
    setCurrentChat: setCurrent,
    unsetCurrentChat: unsetCurrent,
    startSearchChat: startSearch,
    stopSearchChat: stopSearch,
    addNewChat: addNew,
    removeChat: remove,
    addNewChatUser: addNewUser,
    removeChatUser: removeUser,
}
