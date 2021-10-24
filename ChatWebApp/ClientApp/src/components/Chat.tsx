import React from 'react';
import styles from "../css/Chat.module.css";
import {ChatModel} from "../models/ChatModel";
import {useAppSelector} from "../hooks/useAppSelector";
import {chatsActions} from "../store/action-creators/chatsActions";
import {AppDispatch} from "../store/store";
import {bindActionCreators} from "@reduxjs/toolkit";
import {connect} from "react-redux";
import standardContactImage from "../images/user.png"
import {appSettings} from "../appsettings";
import {AdvancedImage} from "@cloudinary/react";
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {Cloudinary} from "@cloudinary/url-gen";

export type ChatProps = {
    chat: ChatModel
}

type DispatchProps = {
    setCurrentChat: typeof chatsActions.setCurrentChat
}

const Chat = ({chat, setCurrentChat}: ChatProps & DispatchProps) => {
    const {data:{currentChat}} = useAppSelector(state => state.chats)

    const handleChatClick = () => {
        setCurrentChat(chat);
    }

    const cloud = new Cloudinary({
        cloud: {
            cloudName: "drtwnz3ni"
        }
    })

    const avatarImage = cloud.image(chat.imageFile?.path);
    avatarImage.resize(thumbnail(70, 70))

    return (
        <div className={`${styles.container} ${currentChat?.id === chat.id ? " selected" : ""}`}
             onClick={handleChatClick}
        >
            <div className={styles.avatar}>
                {avatarImage.toURL() ?
                    <AdvancedImage cldImg={avatarImage}/> :
                    <img className={styles.image} src={standardContactImage}
                         alt="Изображение чата"
                    />
                }
            </div>
            <div className={styles.info}>
                <div className={styles.header}>
                    <div className={styles.sender}>{chat.name}</div>
                    <div className={styles.datetime}>
                        {chat.messages[chat.messages.length - 1] ?
                            new Date(chat.messages[chat.messages.length - 1].sentAt).toLocaleString() : ""}
                    </div>
                </div>
                <div className={styles.text_container}>
                    <div className={styles.text}>{chat.messages[chat.messages.length - 1] ?
                        chat.messages[chat.messages.length - 1].content : ""}
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch:AppDispatch) => {
    return bindActionCreators({setCurrentChat: chatsActions.setCurrentChat}, dispatch);
}

export default connect(null, mapDispatchToProps)(Chat);
