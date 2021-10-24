import {applyMiddleware, createStore} from "@reduxjs/toolkit";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import {rootReducer} from "./reducers/root";
import userMiddleware from "./middlewares/userMiddleware";

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk, userMiddleware))
)

export type AppDispatch = typeof store.dispatch;
