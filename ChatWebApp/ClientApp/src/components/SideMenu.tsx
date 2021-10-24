import React, {useState} from 'react';
import {useAppSelector} from "../hooks/useAppSelector";
import styles from "../css/SideMenu.module.css"
import {useSideMenu} from "../contexts/SideMenuContext";
import AddChatModal from "./AddChatModal";
import {AdvancedImage} from "@cloudinary/react";
import {Cloudinary} from "@cloudinary/url-gen";
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {AppDispatch} from "../store/store";
import {bindActionCreators} from "@reduxjs/toolkit";
import {userActions} from "../store/action-creators/userActions";
import {connect} from "react-redux";
import standardContactImage from "../images/user.png"

type DispatchProps = {
    logout: typeof userActions.logout
}

const SideMenu = ({logout}:DispatchProps) => {
    const {user} = useAppSelector(state => state.user.data);
    const [isAddChatModalOpen, setIsAddChatModalOpen] = useState(false);
    const {isOpen, handleIsOpenChange} = useSideMenu();

    const cloud = new Cloudinary({
        cloud: {
            cloudName: "drtwnz3ni"
        }
    })

    const avatarImage = cloud.image(user?.imageFile?.path);
    avatarImage.resize(thumbnail(70, 70))

    return (
        <>
            <AddChatModal isOpen={isAddChatModalOpen} setIsOpen={setIsAddChatModalOpen}/>
            <div className={`${styles.overlay} ${isOpen ? "open" : ""}`}
                 onClick={() => {
                     handleIsOpenChange(false)
                 }}
            >
                <div className={styles.container} onClick={(event)=>event.stopPropagation()}>
                    <div className={styles.header}>
                        <div className={styles.avatar}>
                            {avatarImage.toURL() ?
                                <AdvancedImage cldImg={avatarImage}/> :
                                <img className={styles.image} src={standardContactImage}
                                     alt="Изображение пользователя"
                                />
                            }
                        </div>
                        <div className={styles.name}>{user?.name}</div>
                    </div>
                    <div className={styles.functions}>
                        <div className={styles.function} onClick={() => setIsAddChatModalOpen(true)}>
                            <div className={styles.icon + " icon-add-user"}/>
                            <div className={styles.name}>Создать чат</div>
                        </div>
                        <div className={styles.function}>
                            <div className={styles.icon + " icon-settings"}/>
                            <div className={styles.name}>Настройки</div>
                        </div>
                        <div className={styles.function} onClick={()=>logout()}>
                            <div className={styles.icon + " icon-logout"}/>
                            <div className={styles.name}>Выйти из аккаунта</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapDispatchToProps = (dispatch:AppDispatch) => {
    return bindActionCreators({logout: userActions.logout}, dispatch);
}

export default connect(null, mapDispatchToProps)(SideMenu);
