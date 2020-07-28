import { Request, Response, Router } from 'express';
import * as usersController from '../controllers/users';
import { IProfile } from '../models/users';

export const router = Router();

router.get('/:userId', (request: Request, response: Response) => {
  const id = request.params["userId"];
  if (id === undefined) {
    response.status(400).send("Please provide an ID");
    return;
  }
  usersController.findUser(id, (err: Error, user: IProfile) => {
    if(err) {
      response.status(500).send('Error while searching for a User');
    } else if(user == null) {
      response.status(404).send('User not found');
    } else {
      response.json({ user: user });
    }
  });
});

router.post('/', (request: Request, response: Response) => {
  const data = request.body;
  if (data['firstname'] == undefined || data['lastname'] == undefined || data['password'] == undefined || data['email'] == undefined) {
    response.status(400).send('To create a profile you need to provide a firstname, a lastname, a password and an email');
    return;
  }
  usersController.addNewUser(data, (err: Error, newUser: IProfile) => {
    if (err) {
      response.status(500).send('User not created');
    } else {
      response.redirect(`/user/${newUser.id}`)
    }
  });
});

router.delete('/:userId', (request: Request, response: Response) => {
  const id = request.params["userId"];
  if (id == undefined) {
    response.status(400).send("Please provide an ID");
    return;
  }
  // const user = usersController.findExistingUser(parseInt(id));
  // if (user == undefined) { response.status(404).send('User not found'); return; }
  // usersController.deleteUser(user);
  response.status(200).send('User deleted');
})

router.patch('/:userId', (request, response) => {
  const id = request.params["userId"];
  const data = request.body;
  if (data['firstname'] == undefined && data['lastname'] == undefined) {
    response.status(400).send('Please provide a lastname or a firstname');
    return;
  }
  // const user = usersController.findExistingUser(parseInt(id));
  // if (user == undefined) { response.status(404).send('User not found'); return; }
  // user.update(data);
  response.status(200).send('User updated');
});

export default router;