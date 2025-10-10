import { Schema, model, Document, Types } from "mongoose";

import { type IUserDocument } from "./user.model.js";
import { type IGroupDocument } from "./group.model.js";

interface IConversation {
  userId: Types.ObjectId;
  singleUser?: Types.ObjectId | IUserDocument;
  group?: Types.ObjectId | IGroupDocument;
  lastMessage: string;
  unreadCount: number;
  isAccepted: boolean;
}

// Extend Document to access MongoDB methods
export interface IConversationDocument extends IConversation, Document {}

const conversationSchema = new Schema<IConversationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    singleUser: { type: Schema.Types.ObjectId, required: false, ref: "User" },
    group: { type: Schema.Types.ObjectId, required: false, ref: "Group" },
    lastMessage: { type: String, maxLength: 1000 },
    unreadCount: { type: Number, default: 0, min: 0 },
    isAccepted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Conversation = model<IConversationDocument>(
  "Conversation",
  conversationSchema
);
