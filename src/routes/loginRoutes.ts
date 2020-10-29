import { Request, Response, Router } from "express";
import passport from "passport";
import { UserNotFoundError } from "../controllers/errors/userNotFound";

const router = Router();

router.post('/', (req: Request, res: Response) => {
    const authenticationFunction = passport.authenticate('local', (err, user) => {
      if(err) {
        if(err instanceof UserNotFoundError) return res.status(404).send("User not found");

        return res.status(500).send()
      }

      // Login of the user by express once done with passport
      if(user) {
         return req.logIn(user, (err) => {
              if(err) return res.status(500).send();
              return res.send(user.getSafeUser());
          })
      }
      return res.status(404).send("User not found");
  });

  return authenticationFunction(req, res);
})

export default router;