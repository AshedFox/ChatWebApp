import {combineReducers} from "@reduxjs/toolkit";
import {userReducer} from "./user/userReducer";
import {chatsReducer} from "./chats/chatsReducer";
import {UserAction, UserState} from "./user/types";
import {ChatsAction, ChatsState} from "./chats/types";

export const rootReducer = combineReducers({
    user: userReducer,
    chats: chatsReducer,
});

export interface State<T, R>{
    data: T,
    loading: R,
    error?: string
}

export interface RootState {
    user: UserState,
    chats: ChatsState,
}

export type RootAction = UserAction | ChatsAction;
