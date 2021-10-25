import React, {
    ChangeEventHandler,
    createRef,
    FormEventHandler,
    KeyboardEventHandler, Ref,
    useEffect,
    useRef,
    useState
} from 'react';
import Message from "./Message";
import styles from "../css/ConversationBlock.module.css"
import {useAppSelector} from "../hooks/useAppSelector";
import {MessageDTO} from "../DTOs/MessageDTO";
import {AppDispatch} from "../store/store";
import {bindActionCreators} from "@reduxjs/toolkit";
import {connect} from "react-redux";
import {chatsActions} from "../store/action-creators/chatsActions";
import {messagesActions} from "../store/action-creators/messagesActions";
import {useSignalRConnection} from "../contexts/SignalRContext";
import AttachmentToSend from "./AttachmentToSend";
import {appSettings} from "../appsettings";
import {authHeader} from "../helpers/authHeader";
import {FileModel} from "../models/FileModel";

const actions = {
    unsetCurrentChat: chatsActions.unsetCurrentChat,
    getMessages: messagesActions.getMessages,
}

type DispatchProps = typeof actions;

const ConversationBlock = ({getMessages, unsetCurrentChat}:DispatchProps) => {
    const {
        chats: {data: { currentChat }},
        user: {data: {user}}
    } = useAppSelector(state => state);

    const [messageToSend, setMessageToSend] = useState<string>("");
    const [filesToSend, setFilesToSend] = useState<File[]>([])
    const connection = useSignalRConnection();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isUserJoined = currentChat!.users.some((chatUser) =>  chatUser.id === user!.id);

    const handleSendMessageSubmit:FormEventHandler = async (event) => {
        event.preventDefault();
        await sendMessage();
    }

    const sendMessage = async () => {
        setMessageToSend(messageToSend.trim());

        if (messageToSend !== "" || (filesToSend.length > 0)) {
            const messageData: MessageDTO = {
                senderId: user!.id,
                chatId: currentChat!.id,
                content: messageToSend,
                attachmentsIds: []
            }

            if (filesToSend.length > 0) {
                for (const file of filesToSend) {
                    let query = appSettings.apiUrl + `/files`;

                    const headersInit = new Headers(authHeader());
                    const formData = new FormData();
                    formData.append("file", file);

                    const response = await fetch(
                        query,
                        {
                            method: "POST",
                            headers: headersInit,
                            body: formData
                        });

                    if (response.ok) {
                        const data = await response.json() as FileModel;
                        messageData.attachmentsIds = [...messageData.attachmentsIds, data.id];
                    }
                }
            }

            connection?.send("SendMessage", messageData);

            setMessageToSend("");
            setFilesToSend([]);
        }
    }

    const handleSendMessageShortcut:KeyboardEventHandler = async (event) => {
        if (event.ctrlKey && event.key === "Enter") {
            await sendMessage();
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
        //getMessages(currentChat!.id);
        return () => {
            setMessageToSend("");
        }
    }, [currentChat, getMessages]);

    const handleChatClose = () => {
        unsetCurrentChat();
    }

    const handleChatJoin = async () => {
        await connection?.send("JoinChat", currentChat?.id)
    }

    const handleMessageFilesChange:ChangeEventHandler = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files !== null) {
            const files = Array.from(target.files);
            setFilesToSend(files);
        }
        else {
            setFilesToSend([]);
        }
    }

    const handleMessageFileRemove = (fileIndex:number) => {
        setFilesToSend(filesToSend?.filter((_, index) => index !== fileIndex));
    }

    return (
        <div className={styles.container}
             onKeyDown={(event) => handleSendMessageShortcut(event)}
        >
            <div className={styles.header}>
                <div className={"icon-arrow " + styles.back_arrow} onClick={handleChatClose}/>
                <div className={styles.name}>{currentChat?.name}</div>
                <div className={"icon-more " + styles.more}/>
            </div>
            <div className={styles.messages_container}>
                {currentChat!.messages.map((message) =>
                    <Message key={message.id} message={message}/>
                )}
                <div ref={messagesEndRef}/>
            </div>
            {
                !isUserJoined &&
                <div onClick={handleChatJoin}>
                    {"JOIN"}
                </div>
            }
            <div className={styles.footer}>
                <div className={styles.attachments_container}>
                    <div className={styles.attachments}>
                        {
                            filesToSend?.map((file, index) => {
                                return (
                                    <AttachmentToSend index={index} file={file} handleFileRemove={handleMessageFileRemove}/>
                                );
                            })
                        }
                    </div>
                </div>
                <form className={styles.message_form} onSubmit={handleSendMessageSubmit}>
                    <input id={"message-files"} className={styles.image_input} type="file" name="message-files"
                           multiple hidden
                           onChange={(e) => handleMessageFilesChange(e)}
                    />
                    <label htmlFor={"message-files"} className={"icon-clip " + styles.add_attachment}/>
                    <textarea className={styles.new_message} value={messageToSend}
                              placeholder={"Текст сообщения..."} rows={1}
                              onChange={(e)=>setMessageToSend(e.target.value)}
                    />
                    <button type={"submit"} className={"icon-send " + styles.send_button}/>
                </form>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch:AppDispatch) => {
    return bindActionCreators(actions, dispatch);
}

export default connect(null, mapDispatchToProps)(ConversationBlock);
