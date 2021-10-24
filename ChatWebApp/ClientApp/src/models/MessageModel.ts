import {UserModel} from "./UserModel";
import {ChatModel} from "./ChatModel";
import {FileModel} from "./FileModel";

export interface MessageModel {
    id: string,
    sender: UserModel,
    chat: ChatModel,
    content: string,
    sentAt: Date,
    attachments: FileModel[]
}
