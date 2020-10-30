import { IUser, User } from "../models/usersModel"; //existingUsers
import { DatabaseError } from "../controllers/errors/databaseError";
import { UserNotFoundError } from "../controllers/errors/userNotFound";

// Create an User
export function createUser(firstName: string, lastName: string, email: string, password: string) : IUser {
    const user = new User({ firstName, lastName, email });
    user.setPassword(password);
    user.save();
    
    return user;
}

// Get all users
export function getUsers(callback: (users: IUser[]) => void): void {
    User.find({}, (err, users) => {
        if (err) { throw new DatabaseError(err); }
        // tableau de hash
        callback(users)
    });
}
// export function getUsers() : Promise<IUser[]>{
//     return User.find({}, '_id firstName lastName').then(res => {return res});
// }

// Get an user by Id
export function getUser(id: string, callback: (user: IUser | null) => void): void {
    User.findById(id, (err, res) => {
        if(err) throw new DatabaseError(err) // Errors
        console.log("USER FOUND", id)
        callback(res); // Response
    });
}

// Modify an user by it's id
export function updateUser(id: string, firstName?: string, lastName?: string, email?: string, callback?: (user: IUser | null) => void) {

    User.findById(id, (err, user) => {
        if(err) throw new DatabaseError(err);
        if(!user) throw new UserNotFoundError(id, "User not found");

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;

        // user.save();
        user.save();

        if (callback) callback(user);
    });
}

// TODO Delete an user
export function deleteUser(id: string, callback: (user: IUser | null) => void ):void {
    User.findByIdAndDelete(id, (err, user) => {
        if(err) throw new DatabaseError(err);
        if(!user) throw new UserNotFoundError(id, "User not found");
    //     if(err) throw new DatabaseError(err) // Errors
    //     // if(!res) { return }
        callback(user);
    });

    // const id = parseInt(req.params["userId"]);
    // const filteredUser = users.find(user => user.id === id);
    // res.send(`User ${filteredUser.firstName} ${filteredUser.lastName} at ${filteredUser.id} is deleted`)

    // users.splice( id - 1, 1); // delete the user
}

export function updateConversationSeen(user: IUser, conversationId: string): Promise<IUser> {
    user.conversationsSeen = {
      ...user.conversationsSeen,
      [conversationId]: new Date()
    }
    return user.save()
}