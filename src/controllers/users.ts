import { UserNotCreatedError, DatabaseError, UserNotFoundError } from '../errors';
import { User, IProfile } from '../models/users';
// let existingUsers : User[] = [new User('Thomas', 'Falcone'), new User('Philippa', 'Float')];

export function findUser(id : string, next: Function) {
  User.findById(id, (err, user) => { next(err, user); });
};

export function addNewUser(data: any, next: Function) : void{
  const newUser = new User(data);
  newUser.save((err, createdProfile) => { next(err, createdProfile); });
}

export function deleteUser(userToDelete: IProfile) {
  // existingUsers = existingUsers.filter(user => user != userToDelete);
  return;
}
