'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Profile Schema
 */
var ProfileSchema = new Schema({
    credits: {
        best: {
            type: Number,
            default: 0
        },
        good: {
            type: Number,
            default: 0
        },
        bad: {
            type: Number,
            default: 0
        },
        worst: {
            type: Number,
            default: 0
        }
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Profile', ProfileSchema);