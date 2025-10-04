import { Schema, model, Document } from 'mongoose';

interface IUser {
  username: string,
  email: string,
  password: string,
  avatar: string,
};

// Extend Document to access MongoDB methods
export interface IUserDocument extends IUser, Document {};

const userSchema = new Schema<IUserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' }
}, {
  timestamps: true,
});

export const User = model<IUserDocument>('User', userSchema);