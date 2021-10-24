import React from 'react';
import styles from "../css/Message.module.css";
import {MessageModel} from "../models/MessageModel";
import standardContactImage from "../images/user.png";
import fileImage from "../images/document.png";
import {useAppSelector} from "../hooks/useAppSelector";
import {Cloudinary} from "@cloudinary/url-gen";
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {AdvancedImage, AdvancedVideo} from "@cloudinary/react";
import CloudinaryConfig from "@cloudinary/url-gen/config/CloudinaryConfig";

export type MessageProps = {
    message: MessageModel
}

const Message = ({message}:MessageProps) => {
    const {user} = useAppSelector(state => state.user.data);

    const cloudConfig = new CloudinaryConfig({
        cloud:  {
            cloudName: "drtwnz3ni"
        }
    });

    const cloud = new Cloudinary(cloudConfig);

    const avatarImage = cloud.image(message.sender.imageFile?.path);
    avatarImage.resize(thumbnail(70, 70))

    return (
        <div className={styles.container}>
            <div className={styles.avatar}>
                {avatarImage.toURL() ?
                    <AdvancedImage cldImg={avatarImage}/> :
                    <img className={styles.image} src={standardContactImage}
                         alt="Изображение пользователя"
                    />
                }
            </div>
            <div className={styles.info}>
                <div className={styles.header}>
                    <div className={styles.sender}>{message.sender.name}</div>
                    <div className={styles.datetime}>{new Date(message.sentAt).toLocaleString()}</div>
                </div>
                <div className={styles.content_container + (message.sender.id === user?.id ? " yours" : "")}>
                    <div className={styles.text}>{message.content}</div>
                    {message.attachments.length > 0 &&
                        <div className={styles.attachments_container}>
                            {
                                message.attachments.map((file) => {
                                    if (file.contentType.startsWith("image")){
                                        const image = cloud.image(file.path);
                                        return (
                                            <AdvancedImage cldImg={image}/>
                                        )
                                    }
                                    else if (file.contentType.startsWith("video")){
                                        const video = cloud.video(file.path);
                                        return (
                                            <AdvancedVideo cldVid={video}/>
                                        )
                                    }
                                    else {
                                        return (
                                            <div className={styles.file}>
                                                <img className={styles.image} src={fileImage} alt={"Файл"}/>
                                                <a href={cloudConfig.url.cname + file.path} download={file.name}>
                                                    {file.name}
                                                </a>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Message;
