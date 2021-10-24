import {Action} from "@reduxjs/toolkit";
import {AuthResultModel} from "../../../models/AuthResultModel";
import {State} from "../root";

export enum UserActionType {
    AuthRequest = "AUTH_USER_REQUEST",
    AuthSuccess = "AUTH_USER_SUCCESS",
    AuthError = "AUTH_USER_ERROR",
    RegRequest = "REG_USER_REQUEST",
    RegSuccess = "REG_USER_SUCCESS",
    RegError = "REG_USER_ERROR",
    Logout = "LOGOUT_USER",
    UpdateAccessToken = "UPDATE_ACCESS_TOKEN",
}

type AuthRequestAction = Action<UserActionType.AuthRequest>
type AuthSuccessAction = Action<UserActionType.AuthSuccess> & {
    payload: AuthResultModel
}
type AuthErrorAction = Action<UserActionType.AuthError> & {
    error: string
}
type RegRequestAction = Action<UserActionType.RegRequest>
type RegSuccessAction = Action<UserActionType.RegSuccess> & {
    payload: AuthResultModel
}
type RegErrorAction = Action<UserActionType.RegError> & {
    error: string
}
type Logout = Action<UserActionType.Logout>
type UpdateAccessToken = Action<UserActionType.UpdateAccessToken> & {
    payload: AuthResultModel
}

export type UserAction =
    AuthRequestAction | AuthSuccessAction | AuthErrorAction |
    RegRequestAction | RegSuccessAction | RegErrorAction |
    Logout | UpdateAccessToken;


export type UserData = AuthResultModel;
export type UserLoading = boolean;

export type UserState = State<UserData, UserLoading>;
