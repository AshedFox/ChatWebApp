import {Middleware} from "@reduxjs/toolkit";
import {RootAction, RootState} from "../reducers/root";
import {UserActionType} from "../reducers/user/types";

const userMiddleware:Middleware<{}, RootState> = (store) =>
        (next) => (action:RootAction) =>
{
    const result = next(action);
    if(Object.values(UserActionType).some((type) => type === action.type)) {
        localStorage.setItem("user", JSON.stringify(store.getState().user.data));
    }

    return result;
}

export default userMiddleware;
