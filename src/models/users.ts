import { Document, Schema, model, Model } from "mongoose";
import { SHA256 } from 'crypto-js';
export interface IProfile extends Document {
  email: string;
  lastname: string;
  firstname: string;
  status: string;
  updatedAt: string;
  conversationsSeen: { [conversationId: string]: string };
  getSafeProfile(): ISafeProfile;
  setPassword(password: string): void;
  validatePassword(password: string): boolean;
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
  status: { type: String, required: true, default: "Offline" },
  updatedAt: { type: Date },
  conversationsSeen: {},
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

profileSchema.pre("save", function () {
  this.set({ updatedAt: new Date() });
});

export const User = model<IProfile, Model<IProfile>>("Profile", profileSchema);
