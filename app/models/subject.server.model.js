'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Validate lenght
 */
var validateSubjectName = function(name) {
    if(name){
        return (name.length > 2);
    } else{
        return true;
    }
};

/**
 * Subject Schema
 */
var SubjectSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a name',
        unique:true,
        validate: [
            { validator: validateSubjectName, msg: 'Name must be at least 3 characters long' }
        ]
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: 'User cannot be blank'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Subject', SubjectSchema);