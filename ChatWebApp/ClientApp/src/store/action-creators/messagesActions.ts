import {MessageDTO} from "../../DTOs/MessageDTO";
import {appSettings} from "../../appsettings";
import {authHeader} from "../../helpers/authHeader";
import {MessageModel} from "../../models/MessageModel";
import {Dispatch} from "@reduxjs/toolkit";
import {MessagesAction, MessagesActionType} from "../reducers/messages/types";
import {MessagesSinceModel} from "../../models/MessagesSinceModel";


const requestGet = (chatId:string, limit?: number) => {
    return async (dispatch: Dispatch<MessagesAction>) => {
        dispatch({type: MessagesActionType.GetRequest});
        const headersInit = new Headers(authHeader());

        let query = appSettings.apiUrl + `/messages?chatId=${chatId}`;
        if (limit) {
            query += `&limit=${limit}`;
        }
        await fetch(
            query,
            {
                headers: headersInit
            })
            .then(response => {
                if (!response.ok) {
                    dispatch({type: MessagesActionType.GetError, error: response.statusText});
                } else {
                    return response.json()
                }
            })
            .then((data: MessageModel[]) => {
                dispatch({type: MessagesActionType.GetSuccess, payload: data})
            });
    }
}

const requestGetSince = (chatId:string, lastMessageId: string, limit?: number) => {
    return async (dispatch: Dispatch<MessagesAction>) => {
        dispatch({type: MessagesActionType.GetSinceRequest});
        const headersInit = new Headers(authHeader());

        let query = appSettings.apiUrl + `/messages?chatId=${chatId}&lastMessageId=${lastMessageId}`;
        if (limit) {
            query += `&limit=${limit}`;
        }
        await fetch(
            query,
            {
                headers: headersInit
            })
            .then(response => {
                if (!response.ok) {
                    dispatch({type: MessagesActionType.GetSinceError, error: response.statusText});
                } else {
                    return response.json()
                }
            })
            .then((data: MessagesSinceModel) => {
                dispatch({type: MessagesActionType.GetSinceSuccess, payload: data})
            });
    }
}

const requestPost = (messageData:MessageDTO) => {
    return async (dispatch: Dispatch<MessagesAction>) => {
        dispatch({type: MessagesActionType.PostRequest});
        const headersInit = new Headers(authHeader());
        headersInit.append("Content-Type", "application/json");

        let query = appSettings.apiUrl + `/messages`;
        await fetch(
            query,
            {
                headers: headersInit,
                body: JSON.stringify(messageData)
            })
            .then(response => {
                if (!response.ok) {
                    dispatch({type: MessagesActionType.PostError, error: response.statusText});
                } else {
                    return response.json()
                }
            })
            .then((data: MessageModel) => {
                dispatch({type: MessagesActionType.PostSuccess, payload: data})
            });
    }
}

const receiveMessage = (message:MessageModel) => {
    return {
        type: MessagesActionType.ReceiveMessage,
        payload: message
    }
}

export const messagesActions = {
    getMessages: requestGet,
    getMessagesSince: requestGetSince,
    postMessage: requestPost,
    receiveMessage,
}
