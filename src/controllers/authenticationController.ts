import passport from 'passport';
import { Strategy } from 'passport-local';
import { IUser, User } from '../models/usersModel';
import { UserNotFoundError } from './errors/userNotFound';

// Strategy
passport.use(
    new Strategy((userName: string, password: string, done) => {
        User.findOne({ email: userName }, (err, user) => {
            if (err) return done(err);

            if (user) {
                const correctPassword = user.verifyPassword(password);
                if (correctPassword) return done(null, user);
            }

            return done(new UserNotFoundError(userName, 'User not found'))
        })
    })
);

// Serialise
passport.serializeUser((user: IUser, done) => {
    done(null, user._id); // injecté en bdd
});

// Id a user
passport.deserializeUser((id: string, done) => {
    User.findById(id, (err, user) => {
        if (err) done(err);
        return done(null, user); // injecté dans la requete
    })
});

// Liens entre passport et session
export const authenticationInitialize = () => passport.initialize();
export const authenticationSession = () => passport.session();