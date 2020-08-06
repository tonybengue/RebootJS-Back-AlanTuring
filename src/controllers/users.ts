import { User, IProfile } from "../models/users";
import { UserNotFoundError } from "../errors";

export function allUsers(next: (err: Error | null, users: IProfile[] | null) => any) {
  User.find({}, '_id lastname firstname status updatedAt', (err, res) => {
    if(err) { next(err, null) }
    else { next(null, res) }
  })
}

export function findUser(
  id: string,
  next: (err: Error, user: IProfile | null) => any
) {
  User.findById(id, (err, user) => {
    next(err, user);
  });
}

export function addNewUser(
  data: any,
  next: (err: Error, prof: IProfile) => any
): void {
  const newUser = new User(data);
  newUser.save((err, createdProfile) => {
    next(err, createdProfile);
  });
}

export function deleteUser(user: IProfile, next: (err: Error | null, deleted: boolean) => any): void {
  user.deleteOne((err, _deletedUser) => {
    if (err) {
      next(err, false)
    } else {
      next(null, true)
    }
  })
  return;
}

export function updateUser(user: IProfile, data: any, next: (err: Error | null, updated: boolean) => any): void {
  const { firstname, lastname, password } = data;
  user.firstname = firstname;
  user.lastname = lastname;
  if (password) user.setPassword(password);
  user.save((err, _user) => {
    if (err) { next(err, false) }
    else { next(null, true) }
  })
}
