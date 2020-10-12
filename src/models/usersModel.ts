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

// With mongoose
import { Document, Schema, model, Model } from "mongoose";

// Export the later verifications
export interface IUser extends Document {
    id: number;
    firstName: string;
    lastName: string;
    email: string;

    // methods
    status(): () => string; 
}
// const a: IUser = {
//     id: 0,
//     firstName: "coucou"
// }

// Definition of the schema
const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true}, // as primary key
});
// Methods of the schema
userSchema.methods.status = function() {
    return `User : ${this.firstName}`
}

// Link of the schema and the interface
export const User = model<IUser, Model<IUser>>("User", userSchema); // name of the collection, 
// const newUser = new User();
// newUser.status();
