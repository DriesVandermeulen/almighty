'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Validate lenght
 */
var validateCommentLength = function(comment) {
    if(comment){
        return (comment.length < 250);
    } else{
        return true;
    }
};

/**
 * Rating Schema
 */
var RatingSchema = new Schema({
    type: {
        type: String,
        enum: ['worst', 'bad', 'good','best'],
        default: '',
        trim: true,
        required: 'Type cannot be blank'
    },
    comment:{
        type: String,
        trim: true,
        validate: [
            { validator: validateCommentLength, msg: 'Comment cannot be longer than 250 characters' }
        ]
    },
    subject: {
        type: Schema.ObjectId,
        ref: 'Subject',
        required: 'Subject cannot be blank'
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

mongoose.model('Rating', RatingSchema);