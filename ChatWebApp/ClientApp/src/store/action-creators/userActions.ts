import {UserAction, UserActionType} from "../reducers/user/types";
import {Dispatch} from "@reduxjs/toolkit";
import {appSettings} from "../../appsettings";
import {AuthResultModel} from "../../models/AuthResultModel";
import {LoginDTO} from "../../DTOs/LoginDTO";
import {UserDTO} from "../../DTOs/UserDTO";
import {UserModel} from "../../models/UserModel";

const requestAuth = (loginData:LoginDTO) => {
    return async (dispatch: Dispatch<UserAction>) => {
        dispatch({type: UserActionType.AuthRequest})
        try {
            const response = await fetch(
                appSettings.apiUrl + '/account/authorize',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify(loginData),
                })

            const data:AuthResultModel = await response.json();

            dispatch({type: UserActionType.AuthSuccess, payload: data});
        }
        catch (error) {
            dispatch({type: UserActionType.AuthError, error: error.message})
        }

    }
}

const requestReg = (userData:UserDTO) => {
    return async (dispatch: Dispatch<UserAction>) => {
        dispatch({type: UserActionType.RegRequest})
        try {
            const response = await fetch(
                appSettings.apiUrl + '/account/register',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify(userData),
                })

            const data:UserModel = await response.json();
            dispatch({type: UserActionType.RegSuccess, payload: data});
        }
        catch (error){
            dispatch({type: UserActionType.RegError, error: error.message})
        }
    }
}

function logout():UserAction {
    return {type: UserActionType.Logout}
}


export const userActions = {
    authorize: requestAuth,
    register: requestReg,
    logout
}
