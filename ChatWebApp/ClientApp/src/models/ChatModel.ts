import {MessageModel} from "./MessageModel";
import {UserModel} from "./UserModel";
import {FileModel} from "./FileModel";

export interface ChatModel {
    id: string
    name: string
    imageFile?: FileModel
    messages: MessageModel[]
    users: UserModel[]
}
