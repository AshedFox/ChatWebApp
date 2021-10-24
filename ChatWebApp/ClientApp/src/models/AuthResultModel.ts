import {UserModel} from "./UserModel";

export interface AuthResultModel {
    user?: UserModel
    accessToken?: string
    validTo?: Date
}
