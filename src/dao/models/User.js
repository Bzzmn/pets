// src/dao/models/User.js

import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
        index: true
    },
    pets: {
        type: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'pets'
            }
        ],
        default: []
    }
}, {
    timestamps: true,
    strict: true,
    collection: userCollection,
    versionKey: false,
    autoIndex: true
});

userSchema.index({ email: 1 }, { 
    unique: true,
    background: true,
    name: 'email_index'
});
userSchema.index({ role: 1 });

userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Email already exists'));
    } else {
        next(error);
    }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;