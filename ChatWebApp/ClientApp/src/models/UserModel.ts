import {ChatModel} from "./ChatModel";
import {FileModel} from "./FileModel";

export interface UserModel {
    id: string
    username: string
    email: string
    name: string
    createdAt: Date
    imageFile?: FileModel
    chats: ChatModel[]
}
