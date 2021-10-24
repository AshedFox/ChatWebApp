import {UserAction, UserActionType, UserState} from "./types";
import {AuthResultModel} from "../../../models/AuthResultModel";

const initialState:UserState =
{
    data: localStorage.getItem("user") ?
        JSON.parse(localStorage.getItem("user") as string) as AuthResultModel :
        {}
    ,
    loading: false,
    error: undefined
}

export const userReducer = (state = initialState, action: UserAction):UserState => {
    switch (action.type){
        case UserActionType.AuthRequest: {
            return { ...state,
                loading: true
            }
        }
        case UserActionType.AuthSuccess: {
            return { ...state,
                data: {
                    ...state.data,
                    user: action.payload.user,
                    accessToken: action.payload.accessToken,
                    validTo: action.payload.validTo,
                },
                loading: false, error: undefined
            }
        }
        case UserActionType.AuthError: {
            return { ...state,
                data: {},
                loading: false, error: action.error
            }
        }
        case UserActionType.RegRequest:{
            return { ...state,
                loading: true
            }
        }
        case UserActionType.RegSuccess:{
            return {...state,
                data: {
                    ...state.data,
                    user: action.payload.user,
                    accessToken: action.payload.accessToken,
                    validTo: action.payload.validTo,
                },
                loading: false, error: undefined
            }
        }
        case UserActionType.RegError:{
            return { ...state,
                data: {},
                loading: false,
                error: action.error
            }
        }
        case UserActionType.Logout:{
            return {
                data: {},
                loading: false,
                error: undefined
            };
        }
        case UserActionType.UpdateAccessToken:{
            return {...state,
                data: {
                    ...state.data,
                    accessToken: action.payload.accessToken,
                    validTo: action.payload.validTo
                }
            }
        }
        default:
            return state;
    }
}
