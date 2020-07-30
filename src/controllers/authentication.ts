import { Handler } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { User, IProfile } from '../models/users';

passport.use(
  new Strategy((email, password, done) => {
    try {
      User.findOne({email: email}, null, (err: Error, user: IProfile | null) => {
        if(err) { return done(err) };
        if(user){
          const isValid = user.validatePassword(password);
          if(isValid) { return done(null, user._id); };
        }
        return done(null, false)
      });
    } catch(error) {
      done(error)
    }
  })
)

passport.serializeUser(({ _id }: { _id: string }, done) => {
  done(null, _id);
});

passport.deserializeUser((_id, done) => {
  done(undefined, { _id });
});

export const authenticationInitialize = (): Handler => passport.initialize();

export const authenticationSession = (): Handler => passport.session();
