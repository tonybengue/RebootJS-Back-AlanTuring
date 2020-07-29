import { Document, Schema, model, Model } from "mongoose";

// export class User {
//   id: number;
//   firstname: string;
//   lastname: string;

//   static last_id = 0;

//   constructor(firstname: string, lastname: string){
//     User.last_id += 1;
//     this.id = User.last_id;
//     this.firstname = firstname;
//     this.lastname = lastname;
//   }

//   get name(): string{
//     return `${this.firstname} ${this.lastname}`
//   }

//   get description(): string{
//     return `My name is ${this.name}`
//   }

//   update(data: any): User{
//     this.firstname = data['firstname'] || this.firstname;
//     this.lastname = data['lastname'] || this.lastname;
//     return this
//   }
// }

export interface IProfile extends Document {
  email: string;
  lastname: string;
  firstname: string;
  status: string;
  updatedAt: string;
  conversationsSeen: { [conversationId: string]: string };
}

export type IUser = Pick<
  IProfile,
  "_id" | "lastname" | "firstname" | "status" | "updatedAt"
>;

const profileSchema = new Schema({
  email: { type: String, required: true, unique: true },
  lastname: { type: String, required: true },
  firstname: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, required: true, default: "Offline" },
  updatedAt: { type: Date },
  conversationsSeen: {},
});

profileSchema.pre("save", function () {
  this.set({ updatedAt: new Date() });
});

export const User = model<IProfile, Model<IProfile>>("Profile", profileSchema);
