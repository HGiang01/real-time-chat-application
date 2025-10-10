import { Schema, model, Document, Types } from "mongoose";
import { type IUserDocument } from "./user.model.js";

interface IGroup {
  admin: Types.ObjectId | IUserDocument;
  members: Array<Types.ObjectId> | Array<IUserDocument>;
  avatar: string;
}

// Extend Document to access MongoDB methods
export interface IGroupDocument extends IGroup, Document {}

const groupSchema = new Schema<IGroupDocument>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    members: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
    avatar: { type: String, default: "/public/img/avatar/user/default.png" },
  },
  {
    timestamps: true,
  }
);

export const Group = model<IGroupDocument>("Group", groupSchema);
