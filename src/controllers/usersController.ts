import { IUser, User } from "../models/usersModel"; //existingUsers
import { DatabaseError } from "../controllers/errors/databaseError";
import { UserNotFoundError } from "../controllers/errors/userNotFound";

// Create an User
export function createUser(firstName: string, lastName: string, email: string): IUser {
    const user = new User({firstName, lastName, email});
    // existingUsers.push(user); // old way for test
    user.save();
    return user;
}

// Get all users
export function getUsers() {
    // User.find();

    // return existingUsers;
}

// Get an user by Id
// Use IUser instead of user with mongoose
// callback : function in a function (next / done)
export function getUser(id: number, callback: (user: IUser | null) => void): void{
    // return existingUsers.find(user => user.id === id); // old way 

    // Mongoose by Id
    User.findById(id, (err, res) => {
        if(err) throw new DatabaseError(err) // Errors
        // if(!res) { return }
        callback(res); // Response
    });
}

// Modify an user by it's id
export function updateUser(id: number, firstName?: string, lastName?: string, email?: string,  callback?: {user: IUser}) {
    // const filteredUser = getUser(id);
    // Il faut s'arreter (guard) => angostique
    // if(!filteredUser) {
    //     throw new UserNotFoundError(id, "The user is not found"); //arrete la fonction
    //     // response.status(404).send('user not found');
    //     // return
    // }

    // // return existingUsers.find(user => user.id === id);
    // // const updateUsers: User = {
    // const updateUsers = {
    //     ...filteredUser,
    //     firstName: firstName || filteredUser.firstName,
    //     lastName: lastName || filteredUser.lastName,
    //     email: email || filteredUser.email
    // }

  // const updatedUser = {
  //   ...filteredUser,
  //   firstname: firstname || filteredUser.firstname,
  //   lastname: lastname || filteredUser.lastname,
  //   email: email || filteredUser.email
  // }

  // TODO
//   const user = User.findById(id)
//   if(!user ){
//       //404
//   }
// //   user.updateOne(firstName: firstName,lastName: lastName)
//   user.firstName = firstName; || user.firstName;
//   user.save()

//   return user;

    User.findById(id, (err, user) => {
        if(err) throw new DatabaseError(err);
        if(!user) throw new UserNotFoundError(id, "User not found");

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;

        user.save();
        // if(callback) callback(user);
    })
}

export function deleteUser(id: number) {
    // return existingUsers.find(user => user.id === id);
}

