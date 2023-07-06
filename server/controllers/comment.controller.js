import Intent from "../models/intent.model.js";
import Prompt from "../models/prompt.model.js";
import Comment from "../models/comment.model.js"
import errorHandler from "../helpers/dbErrorHandler.js";


/**
 * Retrieve a comment by its ID and append it to the req
 * @param req
 * @param res
 * @param next
 * @param id
 * @returns {Promise<void>}
 */
const commentById = async (req, res, next, id) => {

    try {
        let comment = await Comment.findById(id).populate('comments')

        if (!comment)
            return res.status(400).json({
                error: "Intent not found",
            });

        req.comment = comment;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Could not retrieve intent'
        })
    }
}

/**
 * Create comment based on req information
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const create = async (req, res) => {

    let user = req.auth;

    if (!req.body.intent)
        return res.status(400).json({
            message: 'An intent is required in the request body'
        })

    const intent = req.body.intent;

    const owner = intent.owner;

    if (!owner.is_pro)
        return res.status(400).json({
            message: 'The Owner of the Project must be Pro for comments to be enabled'
        })

    let comment = new Comment({...req.body, user: user._id})

    try {
        await comment.save();
        return res.status(200).json({
            message: 'Successfully created a new Comment'
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }

}

/**
 * Read a comment
 * @param req
 * @param res
 */
const read = (req, res) => {
    return res.json(req.intent)
}

/**
 * List all comments associated with an intent
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const list = async (req, res) => {

    let intent = req.intent;

    try {
        let comments = await Comment.find({intent: intent._id})

        res.json({comments})
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default {
    commentById,
    create,
    list,
    read
}