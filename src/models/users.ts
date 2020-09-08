import { Document, Schema, model, Model } from "mongoose";
import { SHA256 } from 'crypto-js';
export interface IProfile extends Document {
  email: string;
  lastname: string;
  firstname: string;
  status: string;
  socket: string;
  updatedAt: string;
  conversationsSeen: { [conversationId: string]: string };
  getSafeProfile(): ISafeProfile;
  setPassword(password: string): void;
  validatePassword(password: string): boolean;
  updateSeen(conversationId: string, seenDate: string): void;
}

export type IUser = Pick<
  IProfile,
  "_id" | "lastname" | "firstname" | "status" | "updatedAt"
>;

export type ISafeProfile = IUser & Pick<IProfile, 'email' | 'conversationsSeen'>;

const profileSchema = new Schema({
  email: { type: String, required: true, unique: true },
  lastname: { type: String, required: true },
  firstname: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, required: true, default: "offline" },
  updatedAt: { type: Date },
  conversationsSeen: {},
  socket: { type: String },
});

profileSchema.methods.setPassword = function (password: string): void {
  this.password = SHA256(password).toString();
};
profileSchema.methods.validatePassword = function (password: string): boolean {
  return this.password === SHA256(password).toString();
};

profileSchema.methods.getSafeProfile = function (): ISafeProfile {
  const { _id, email, lastname, firstname, status, updatedAt, conversationsSeen } = this;
  return { _id, email, lastname, firstname, status, updatedAt, conversationsSeen };
};

profileSchema.methods.updateSeen = function (conversationId: string, seenDate: string): void {
  this.conversationsSeen = { ...this.conversationsSeen, [conversationId]: seenDate };
  this.markModified('conversationsSeen');
}

profileSchema.pre("save", function () {
  this.set({ updatedAt: new Date() });
});

export const User = model<IProfile, Model<IProfile>>("Profile", profileSchema);
