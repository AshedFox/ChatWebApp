import {store} from "../store/store";

export function authHeader() {
    const {user} = store.getState();
    if (user.data?.accessToken) {
        return {"Authorization": `Bearer ${user.data?.accessToken}`}
    }
    return {"Authorization": ""};
}
