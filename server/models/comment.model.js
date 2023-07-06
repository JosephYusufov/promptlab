import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: false,
        required: "A comment is required"
    },
    intent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "intent",
        required: "An intent is required"
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
        required: false,
    },
    children: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'comment',
        required:false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
    created: {
        type: Date,
        default: Date.now,
    }
})

export default mongoose.model("Comment", CommentSchema);