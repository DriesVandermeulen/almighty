'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Subject Schema
 */
var SubjectSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a subject',
        unique:true
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