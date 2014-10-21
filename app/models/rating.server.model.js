'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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