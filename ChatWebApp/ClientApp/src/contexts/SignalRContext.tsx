import React, {createContext, FC, useContext, useEffect, useState} from 'react';
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {useAppSelector} from "../hooks/useAppSelector";
import {appSettings} from "../appsettings";
import {UserModel} from "../models/UserModel";
import {connect} from "react-redux";
import {chatsActions} from "../store/action-creators/chatsActions";
import {AppDispatch} from "../store/store";
import {bindActionCreators} from "@reduxjs/toolkit";
import {ChatModel} from "../models/ChatModel";
import {MessageModel} from "../models/MessageModel";
import {messagesActions} from "../store/action-creators/messagesActions";


const SignalRContext = createContext<HubConnection | undefined>(undefined);

const actions = {
    addNewChat: chatsActions.addNewChat,
    removeChat: chatsActions.removeChat,
    addNewChatUser: chatsActions.addNewChatUser,
    removeChatUser: chatsActions.removeChatUser,
    receiveMessage: messagesActions.receiveMessage
}

type DispatchProps = typeof actions;

const SignalRProvider:FC<DispatchProps> =
    ({children, addNewChat, removeChat, addNewChatUser, removeChatUser, receiveMessage}) => {

    const {accessToken} = useAppSelector(state => state.user.data);
    const [connection, setConnection] = useState<HubConnection|undefined>(undefined);

    if (connection === undefined) {
        const connection = new HubConnectionBuilder()
            .withUrl(appSettings.hubUrl + "/main", {
                accessTokenFactory: () => accessToken as string,
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build()

        connection.on("AddChatUser", (chatId: string, user: UserModel) => {
            addNewChatUser(chatId, user);
        })
        connection.on("RemoveChatUser", (chatId: string, userId: string) => {
            removeChatUser(chatId, userId);
        })
        connection.on("AddNewChat", (chat:ChatModel)=> {
            addNewChat(chat);
        })
        connection.on("RemoveChat", (chatId:string) => {
            removeChat(chatId);
        })
        connection.on("ReceiveMessage", (message:MessageModel) => {
            receiveMessage(message);
        })
        setConnection(connection);
    }

    useEffect(() => {
        connection?.start();

        return () => {
            connection?.stop();
        }
    }, [connection])

    return (
        <SignalRContext.Provider value={connection} children={children}/>
    );
};

const mapDispatchToProps = (dispatch:AppDispatch) => {
    return bindActionCreators(actions, dispatch);
}

export const useSignalRConnection = () => {
    return useContext(SignalRContext);
}

export default connect(null, mapDispatchToProps)(SignalRProvider);
