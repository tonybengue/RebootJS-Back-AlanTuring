// Sans mongoose
// class User {
//     id: Number;
//     firstName : string;
//     lastName : string;
//     email : string;
    
//     static last_id = 0;

//     // Mettre type any quand on ne sait pas, a eviter
//     constructor (firstName: string, lastName: string, email: any) {
//         User.last_id += 1;
//         this.id = User.last_id;
        
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.email = email;
//     }

//     status(): void {
//         console.log(`Je m'appelle ${this.firstName} ${this.lastName} et je suis joignable sur ${this.email}`);
//     }

//     changeFirstName(firstName: string): void {
//         this.firstName = firstName;
//     }

//     changeLastName(lastName: string): void {
//         this.lastName = lastName;
//     }
// }

// const existingUsers = [
//     new User('Thomas', 'Falcone', 'thomas.falcone@mail.com'),
//     new User('Philippa', 'Dupont', 'mail@mail.mail')
// ]

// export { User, existingUsers }
// const newUser = new User();
// newUser.status();

// With mongoose
import { Document, Schema, model, Model } from "mongoose";
import { SHA256 } from "crypto-js";

// Export the later verifications
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    conversationsSeen: {[convId: string]: Date};
    socket?: string;
    status: IUserStatus;

    // Evite de stocker le password
    verifyPassword: (password: string) => boolean; 
    setPassword: (password: string) => void;
    getSafeUser: () => ISafeUser;
}

type IUserStatus = 'online' | 'offline';
type ISafeUser = Pick<IUser, 'firstName' | 'lastName' | 'email' | '_id' | 'conversationsSeen' | 'status'>


// Definition of the schema
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    status: { type: String, required: true, default: 'offline' },
    email: { type: String, required: true, unique: true}, // as primary key
    password: { type: String, required: true },
    socket: { type: String },
    conversationsSeen : {}
});

userSchema.methods.getSafeUser = function() {
    const { _id, firstName, lastName, email, conversationsSeen, status } = this;
    return { _id, firstName, lastName, email, conversationsSeen, status };
}

/* Methods of the schema */
// userSchema.methods.status = function() {
//     return `User : ${this.firstName}`
// }

// Verify the password of the user
userSchema.methods.verifyPassword = function(password: string) {
    return this.password === SHA256(password).toString(); // hash password
}

// Set the password for the user
userSchema.methods.setPassword = function(password: string) {
    this.password = SHA256(password).toString();
}

// Link of the schema and the interface
export const User = model<IUser, Model<IUser>>("User", userSchema); // name of the collection, 

