import {TypedUseSelectorHook, useSelector} from "react-redux";
import {RootState} from "../store/reducers/root";

export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;
