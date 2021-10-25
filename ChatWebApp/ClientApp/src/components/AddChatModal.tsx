import React, {FC, SyntheticEvent, useState} from 'react';
import ReactModal from "react-modal";
import styles from "../css/AddChatModal.module.css";
import "../css/ReactModal.css";
import standardChatIcon from "../images/camera.png"
import {appSettings} from "../appsettings";
import {ChatsActionType} from "../store/reducers/chats/types";
import {authHeader} from "../helpers/authHeader";
import {ChatDTO} from "../DTOs/ChatDTO";
import {ChatModel} from "../models/ChatModel";
import {FileModel} from "../models/FileModel";
import {AppDispatch} from "../store/store";
import {bindActionCreators} from "@reduxjs/toolkit";
import {connect, DispatchProp} from "react-redux";
import {chatsActions} from "../store/action-creators/chatsActions";
import * as Url from "url";
import {useSignalRConnection} from "../contexts/SignalRContext";

type AddChatProps = {
    isOpen: boolean,
    setIsOpen: (isOpen:boolean) => void,
}
type DispatchProps = {
    postChat: typeof chatsActions.postChat
}

const AddChatModal = ({isOpen, setIsOpen, postChat}:AddChatProps & DispatchProps) => {
    const [chatName, setChatName] = useState<string>("");
    const [chatImage, setChatImage] = useState<File>();
    const connection = useSignalRConnection();

    const handleChatImageSelection = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        if (files) {
            setChatImage(files[0]);
        }
    }

    const handleChatCreation = async (e: SyntheticEvent) => {
        e.preventDefault();
        //const target = e.target as HTMLFormElement;
        //const files = target.files;
        const chatToAdd:ChatDTO = {
            name: chatName,
            imageFileId: ""
        }

        if (chatImage) {
            let query = appSettings.apiUrl + `/files`;
            const headersInit = new Headers(authHeader());
            const formData = new FormData();
            formData.append("file", chatImage);

            const response = await fetch(
                query,
                {
                    method: "POST",
                    headers: headersInit,
                    body: formData
                });

            if (response.ok) {
                const data = await response.json() as FileModel;
                chatToAdd.imageFileId = data.id;
            }
        }
        connection?.send("CreateChat", chatToAdd);
    }

    return (
        <ReactModal
            isOpen={isOpen}
            className={styles.modal}
            closeTimeoutMS={200}
            overlayClassName={styles.overlay}
            onAfterClose={() => {
                setChatImage(undefined);
                setChatName("");
            }}
            onRequestClose={() => {
                setIsOpen(false)
            }}
        >
            <div className={styles.header}>
                <div className={styles.title}>Создать новый чат</div>
                <div className={styles.close_button} onClick={() => setIsOpen(false)}>&#10006;</div>
            </div>
            <div className={styles.main}>
                <form className={styles.form} onSubmit={(e:SyntheticEvent)=>{handleChatCreation(e)}}>
                    <div className={styles.fields}>
                        <label htmlFor={"chat-image"} className={styles.image_label}>
                            <img className={styles.image}
                                 src={chatImage ? URL.createObjectURL(chatImage)
                                     : standardChatIcon}
                                 alt="Изображение чата"/>
                        </label>
                        <input id={"chat-image"} className={styles.image_input} type="file" name="chat-image"
                               accept={"image/*"}
                               onChange={(e) => handleChatImageSelection(e)}
                        />
                        <input className={styles.input} type="text" name="name" placeholder="Название чата"
                               value={chatName} required
                               onChange={(e)=>setChatName(e.target.value)}/>
                    </div>
                    <button className={styles.button} type={"submit"}>Создать</button>
                </form>
            </div>
        </ReactModal>
    );
};

const mapDispatchToProps = (dispatch:AppDispatch) => {
    return bindActionCreators({postChat: chatsActions.postChat}, dispatch);
}


export default connect(null, mapDispatchToProps)(AddChatModal);
