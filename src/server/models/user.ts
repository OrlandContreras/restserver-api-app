import { Document, Schema, Model, model } from 'mongoose';

import uniqueValidator from 'mongoose-unique-validator';

// Roles valid list
let validRoles = {
    values: [
        'ADMIN_ROLE',
        'USER_ROLE'
    ],
    message: '{VALUE} is not valid role'
}

// Interface of the model
export interface IUserModel extends Document {
    name: string;
    email: string;
    password: string;
    img?: string;
    role?: string;
    state?: string;
    google?: boolean;
}

// Schema definition
export let UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Field name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Field email is required']
    },
    password: {
        type: String,
        required: [true, 'Fields user and password are required']
    },
    img: {
        type: String,
        required: false 
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true

    },
    google: {
        type: Boolean,
        default: false
    }    
});

// delete field password from json response
UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// Add a validator to the unique fields
UserSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
});

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema); 