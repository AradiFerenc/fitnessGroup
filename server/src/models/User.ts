import mongoose, {Document, Schema} from "mongoose";
import bcrypt from 'bcrypt'
import {logE} from "../Utils/Log";

const SALT_FACTOR = 10;

interface IUser extends Document {
    email: string;
    password: string;
    role: string;

    comparePassword: (candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void) => void;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "user"
    }
});

UserSchema.pre<IUser>('save', function(next) {
    const user = this;
    bcrypt.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            logE("", error);
            return next(error);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                logE("", err);
                return next(err);
            }
            user.password = hash;
            next();
        })
    });
});

UserSchema.methods.comparePassword = function(candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void) : void {
    const user = this;
    bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
        if (error) {
            logE("", error);
            callback(error, false);
        }
        callback(null, isMatch);
    });
};


export const User = mongoose.model<IUser>('User', UserSchema);
