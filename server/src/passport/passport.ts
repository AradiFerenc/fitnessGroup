import {PassportStatic} from "passport";
import {Strategy} from "passport-local";
import {User} from "../models/User";
import {logE, logI} from "../Utils/Log";

export const configurePassport = (passport: PassportStatic) => {

    passport.serializeUser((user: Express.User, done) => {
        done(null, user);
    })

    passport.deserializeUser((user: Express.User, done) => {
        done(null, user);
    })

    passport.use('local', new Strategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
        const query = User.findOne({email: email});
        query.then(user => {
            if (user) {
                user.comparePassword(password, (error, isMatch) => {
                    if (error || !isMatch) {
                        logE('Incorrect email or password!')
                        done('Incorrect email or password!');
                    } else {
                        logI("", user)
                        done(null, user);
                    }
                });
                return;
            }
            logI("", undefined);
            done(null, undefined);
        }).catch(error => {
            logE("", error)
            done(error);
        });
    }));
    return passport;
}