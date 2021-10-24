import React, {SyntheticEvent, useEffect, useState} from 'react';
import Chat from "./Chat";
import styles from "../css/ChatsBlock.module.css";
import {useAppSelector} from "../hooks/useAppSelector";
import {chatsActions} from "../store/action-creators/chatsActions";
import {AppDispatch} from "../store/store";
import {bindActionCreators} from "@reduxjs/toolkit";
import {connect} from "react-redux";
import AddChatModal from "./AddChatModal";
import {useSideMenu} from "../contexts/SideMenuContext";

const actions = {
    getChats: chatsActions.getChats,
    startSearch: chatsActions.startSearchChat,
    stopSearch: chatsActions.stopSearchChat,
    searchChats: chatsActions.searchChats
}

type DispatchProps = typeof actions;

const ChatsBlock = ({searchChats, startSearch, stopSearch, getChats}:DispatchProps) => {
    const [searchPattern, setSearchPattern] = useState<string>("");
    //const [isAddChatModalOpen, setIsAddChatModalOpen] = useState(false);
    const sideMenu = useSideMenu();

    const {
        user: {data: userData},
        chats: {data: chatsData}
    } = useAppSelector(state => state);

    useEffect(() => {
        getChats(userData.user!.id);
    }, [getChats, userData.user]);

    const handleSearch = async (e:SyntheticEvent) => {
        e.preventDefault();
        if (searchPattern.trim() !== "") {
            startSearch();
            searchChats(searchPattern);
        }
    }

    const handleStopSearch = async (e:SyntheticEvent) => {
        e.preventDefault();
        stopSearch();
    }

    return (
        <div className={styles.container}>
{/*
            <AddChatModal isOpen={isAddChatModalOpen} setIsOpen={setIsAddChatModalOpen}/>
*/}
            <div className={styles.header}>
                <div className={styles.options + " icon-list"}
                     onClick={() => sideMenu.handleIsOpenChange(true)}
                />
                <form className={styles.search}
                      onReset={(e:SyntheticEvent) => handleStopSearch(e)}
                      onSubmit={(e:SyntheticEvent) => handleSearch(e)}>
                    <input className={styles.text}
                           value={searchPattern}
                           placeholder={"Поиск"}
                           onChange={(e) => setSearchPattern(e.target.value)}
                    />
                    {chatsData.isSearch && <button className={styles.button} type={"reset"}>&#10006;</button>}
                    <button className={styles.button + " icon-search"}/>
                </form>
            </div>
            <div className={styles.chats_container}>
                {
                    chatsData.isSearch ?
                        chatsData.searchChats.map((chat) =>
                            <Chat key={chat.id} chat={chat}/>
                        ) :
                        chatsData.chats.sort((a, b) => {
                            if (a.messages[a.messages.length - 1] && b.messages[b.messages.length - 1]) {
                                if (a.messages[a.messages.length - 1].sentAt > b.messages[b.messages.length - 1].sentAt){
                                    return -1;
                                }
                                else if (a.messages[a.messages.length - 1].sentAt < b.messages[b.messages.length - 1].sentAt){
                                    return 1;
                                }
                            }
                            return 0;
                        }).map((chat) =>
                            <Chat key={chat.id} chat={chat}/>
                        )
                }
            </div>
{/*            <div className={styles.footer}>
                <div className={styles.add_button + " icon-add"} onClick={() => setIsAddChatModalOpen(true)}/>
            </div>*/}
        </div>
    );
};

const mapDispatchToProps = (dispatch:AppDispatch) => {
    return bindActionCreators(actions, dispatch);
}

export default connect(null, mapDispatchToProps)(ChatsBlock);
