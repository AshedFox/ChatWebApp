import {ChatsAction, ChatsActionType, ChatsState} from "./types";
import {MessagesActionType} from "../messages/types";

const initialState:ChatsState = {
    data: {
        chats: [],
        searchChats: [],
        currentChat: undefined,
        isSearch: false
    },
    loading: {
        chatsLoading: false,
        messagesLoading: false
    },
    error: undefined
}

export const chatsReducer = (state = initialState, action:ChatsAction):ChatsState => {
    switch (action.type) {
        case ChatsActionType.GetRequest:{
            return {...state,
                loading: {...state.loading,
                    chatsLoading: true
                },
                error: undefined
            }
        }
        case ChatsActionType.GetSuccess:{
            return {...state,
                data: {...state.data,
                    chats: action.payload
                },
                loading: {...state.loading,
                    chatsLoading: false
                },
            }
        }
        case ChatsActionType.GetError: {
            return {...state,
                loading: {...state.loading,
                    chatsLoading: false
                },
                error: action.error
            }
        }
        case ChatsActionType.PostRequest:{
            return {...state,
                error: undefined
            }
        }
        case ChatsActionType.PostSuccess:{
            return {...state,
                data:{...state.data,
                    chats: [...state.data.chats, action.payload]
                }
            }
        }
        case ChatsActionType.PostError:{
            return {...state,
                error: action.error
            }
        }
        case ChatsActionType.SearchRequest:{
            return {...state,
                loading: {...state.loading,
                    chatsLoading: true
                },
                error: undefined
            }
        }
        case ChatsActionType.SearchSuccess: {
            return {...state,
                data: {...state.data,
                    searchChats: action.payload
                },
                loading: {...state.loading,
                    chatsLoading: false
                },
            }
        }
        case ChatsActionType.SearchError:{
            return {...state,
                loading: {...state.loading,
                    chatsLoading: false
                },
                error: action.error
            }
        }
        case ChatsActionType.StartSearch:{
            return {...state,
                data: {...state.data,
                    isSearch: true,
                }
            }
        }
        case ChatsActionType.StopSearch:{
            return {...state,
                data: {...state.data,
                    searchChats: [],
                    isSearch: false
                }
            }
        }
        case ChatsActionType.SetCurrent: {
            return {...state,
                data: {...state.data,
                    currentChat: action.payload
                }
            }
        }
        case ChatsActionType.UnsetCurrent: {
            return {...state,
                data: {...state.data,
                    currentChat: undefined
                }
            }
        }
        case ChatsActionType.AddNew: {
            return {...state,
                data: {...state.data,
                    chats: [...state.data.chats, action.payload]
                },
            }
        }
        case ChatsActionType.Remove: {
            return {...state,
                data: {...state.data,
                    chats: state.data.chats.filter(chat => chat.id !== action.payload),
                }
            }
        }
        case ChatsActionType.AddNewUser: {
            return {...state,
                data: {...state.data,
                    chats: state.data.chats.map((chat) => {
                        if (chat.id === action.payload.chatId){
                            return {...chat, users: [...chat.users, action.payload.user]};
                        }
                        return chat;
                    })
                },
            }
        }
        case ChatsActionType.RemoveUser: {
            return {...state,
                data: {...state.data,
                    chats: state.data.chats.map((chat) => {
                        if (chat.id === action.payload.chatId) {
                            return {...chat, users: chat.users.filter(user => (user.id !== action.payload.userId))};
                        }
                        return chat;
                    })
                },
            }
        }
        case MessagesActionType.GetRequest: {
            return {...state,
                loading:{...state.loading,
                    messagesLoading: true
                }
            }
        }
        case MessagesActionType.GetSuccess: {
            if (action.payload.length === 0){
                return {...state};
            }

            if (state.data.isSearch) {
                return {...state,
                    data: {...state.data,
                        searchChats: state.data.searchChats.map((chat) => {
                            if (chat.id === action.payload[0].chat.id) {
                                chat.messages = [...action.payload];
                            }
                            return chat;
                        })
                    },
                    loading:{...state.loading,
                        messagesLoading: false
                    }
                }
            }
            else {
                return {...state,
                    data: {...state.data,
                        chats: state.data.chats.map((chat) => {
                            if (chat.id === action.payload[0].chat.id) {
                                chat.messages = [...action.payload];
                            }
                            return chat;
                        })
                    },
                    loading:{...state.loading,
                        messagesLoading: false
                    }
                }
            }
        }
        case MessagesActionType.GetError: {
            return {...state,
                loading:{...state.loading,
                    messagesLoading: false
                },
                error: action.error
            }
        }
        case MessagesActionType.GetSinceRequest: {
            return {...state,
                loading:{...state.loading,
                    messagesLoading: true
                }
            }
        }
        case MessagesActionType.GetSinceSuccess: {
            if (state.data.isSearch) {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        searchChats: state.data.searchChats.map((chat) => {
                            if (chat.id === action.payload.messages[0].chat.id) {
                                const insertId = chat.messages.findIndex(value => value.id === action.payload.lastMessageId);
                                chat.messages = [...action.payload.messages, ...chat.messages.slice(insertId)];
                            }
                            return chat;
                        })
                    },
                    loading: {
                        ...state.loading,
                        messagesLoading: false
                    }
                }
            }
            else {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        chats: state.data.chats.map((chat) => {
                            if (chat.id === action.payload.messages[0].chat.id) {
                                const insertId = chat.messages.findIndex(value => value.id === action.payload.lastMessageId);
                                chat.messages = [...action.payload.messages, ...chat.messages.slice(insertId)];
                            }
                            return chat;
                        })
                    },
                    loading: {
                        ...state.loading,
                        messagesLoading: false
                    }
                }
            }
        }
        case MessagesActionType.GetSinceError: {
            return {...state,
                loading:{...state.loading,
                    messagesLoading: false
                },
                error: action.error
            }
        }
        case MessagesActionType.ReceiveMessage: {
            return {...state,
                data: {...state.data,
                    chats: state.data.chats.map((chat) => {
                        if (chat.id === action.payload.chat.id){
                            chat.messages = [...chat.messages, action.payload];
                        }
                        return chat;
                    }),
                    searchChats: state.data.searchChats.map((chat) => {
                        if (chat.id === action.payload.chat.id){
                            chat.messages = [...chat.messages, action.payload];
                        }
                        return chat;
                    })
                }
            }
        }
        default:{
            return state;
        }
    }
}
