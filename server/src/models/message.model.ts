import { Schema, model, Document, Types } from "mongoose";
import { type IUserDocument } from "./user.model.js";
import { type IGroupDocument } from "./group.model.js";

interface IMessage {
  content: string;
  senderId: Types.ObjectId | IUserDocument;
  receiverId?: Types.ObjectId | IGroupDocument;
  groupId?: Types.ObjectId | String;
}

// Extend Document to access MongoDB methods
export interface IMessageDocument extends IMessage, Document {}

const messageSchema = new Schema<IMessageDocument>(
  {
    content: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    receiverId: { type: Schema.Types.ObjectId, ref: "User" },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
  },
  {
    timestamps: true,
  }
);

export const Message = model<IMessageDocument>("Message", messageSchema);
