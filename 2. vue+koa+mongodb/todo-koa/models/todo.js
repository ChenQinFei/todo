/**
 * @description todos collection
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TodoSchema = new Schema({
    todoId: {
        type: String,
        unique: true,
        required: true
    },
    userId:{
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    updateDate: {
        type: Date,
        default: Date.now()
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    CompletedDate: {
        type: Date,
    },
}, {collection: 'todo', versionKey: false});

TodoSchema.pre('save', function(){
    if (this.isNew) {
       this.updateDate = this.createdDate = Date.now(); 
    } else {
        this.updateDate = Date.now()
    }
});

module.exports = mongoose.model('todo', TodoSchema);
