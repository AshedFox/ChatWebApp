import React from 'react';
import ChatsBlock from "./ChatsBlock";
import ConversationBlock from "./ConversationBlock";
import styles from "../css/Main.module.css"
import {useAppSelector} from "../hooks/useAppSelector";
import SignalRProvider from "../contexts/SignalRContext";
import SideMenuProvider from "../contexts/SideMenuContext";
import SideMenu from "./SideMenu";

const Main = () => {
    const {data:{currentChat}} = useAppSelector(state => state.chats)

    return (
        <SignalRProvider>
            <SideMenuProvider>
                <SideMenu/>
                <div className={styles.container}>
                    <ChatsBlock/>
                    {currentChat && <ConversationBlock/>}
                </div>
            </SideMenuProvider>
        </SignalRProvider>
    );
};

export default Main;
