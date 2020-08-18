import { Request, Response, Router, request } from "express";
import * as usersController from "../controllers/users";
import { IProfile, User } from "../models/users";
import { authenticationRequired } from "../middlewares/authenticationRequired"

export const router = Router();

router.get("/", authenticationRequired, (request: Request, response: Response) => {
  usersController.allUsers((err, users) => {
    if (err) { response.status(500).send("Something went wrong went fetching for all users") }
    else {
      response.status(200).json({ users: users })
    }
  })

});

router.get("/me", authenticationRequired, async (request: Request, response: Response) => {
  const user = await User.findById((request.user as any)._id)
  if (!user) throw Error('User not found');
  response.json(user.getSafeProfile());
});

router.get("/:userId", authenticationRequired, (request: Request, response: Response) => {
  const id = request.params["userId"];
  if (id === undefined) {
    response.status(400).send("Please provide an ID");
    return;
  }
  usersController.findUser(id, (err: Error, user: IProfile | null) => {
    if (err) {
      response.status(500).send("Error while searching for a User");
    } else if (user == null) {
      response.status(404).send("User not found");
    } else {
      response.json({ user: user });
    }
  });
});

router.post("/", (request: Request, response: Response) => {
  const data = request.body;
  if (
    data["firstname"] == undefined ||
    data["lastname"] == undefined ||
    data["password"] == undefined ||
    data["email"] == undefined
  ) {
    response
      .status(400)
      .send(
        "To create a profile you need to provide a firstname, a lastname, a password and an email"
      );
    return;
  }
  usersController.addNewUser(data, (err: Error, newUser: IProfile) => {
    if (err) {
      response.status(500).send("User not created");
    } else {
      response.redirect(`/user/${newUser.id}`);
    }
  });
});

router.delete("/", authenticationRequired, async (request: Request, response: Response) => {
  const user = await User.findById((request.user as any)._id)
  if (!user) throw Error('User not found');
  usersController.deleteUser(user, (err: Error | null, deleted: boolean) => {
    if (err || !deleted) {
      response.status(500).send("Something went wrong during deletion");
    } else {
      response.status(200).send("User deleted");
    }
  });
});

router.patch("/conversations-seen", authenticationRequired, async (request: Request, response: Response) => {
  const user = await User.findById((request.user as any)._id);
  if (!user) throw Error('User not found');
  const { conversationId, seenDate } = request.body;
  if (!conversationId || !seenDate) response.sendStatus(400);
  await usersController.updateConversationsSeen(user, conversationId, seenDate);
  response.json(user.getSafeProfile());
});

router.patch("/", authenticationRequired, async (request: Request, response: Response) => {
  const user = await User.findById((request.user as any)._id)
  if (!user) throw Error('User not found');
  const data = request.body;
  if (data["firstname"] == undefined && data["lastname"] == undefined) {
    response.status(400).send("Please provide a lastname or a firstname");
    return;
  }
  usersController.updateUser(user, data, (err, updatedUser) => {
    if (err || !updatedUser) {
      response.status(500).send("Something went wrong during update");
    } else {
      response.status(200).json(updatedUser.getSafeProfile());
    }
  })
});

export default router;
