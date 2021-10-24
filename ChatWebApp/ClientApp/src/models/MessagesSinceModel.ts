import {MessageModel} from "./MessageModel";

export interface MessagesSinceModel {
    messages: MessageModel[],
    lastMessageId: string
}
