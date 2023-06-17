import Intent from "../models/intent.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import {generateResponse, generatePrompt} from "../vendors/openAI/index.js";


const intentById = async (req, res, next, id) => {
    try {
        let intent = await Intent.findById(id).populate("prompts");
        if (!intent)
            return res.status(400).json({
                error: "Intent not found",
            });
        // console.log(intent);
        req.intent = intent;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Could not retrieve intent",
        });
    }
};

const create = async (req, res) => {
    let user = req.profile;
    let intent = new Intent({...req.body, user: user._id});
    try {
        await intent.save();
        return res.status(200).json({
            message: "Succesfully created a new Intent.",
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const read = (req, res) => {
    // console.log(req.intent);
    return res.json(req.intent);
};

const list = async (req, res) => {
    let user = req.profile;
    // console.log(user);
    try {
        let intents = await Intent.find({user: user._id});
        // console.log(intents);
        res.json(intents);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const hasAuthorization = async (req, res, next) => {
    const authorized = req.intent && req.auth && req.auth._id == req.intent.user;
    // TODO: Authorize users who are members or admins as well.
    //   || req.auth._id
    if (!authorized) {
        return res.status(403).json({
            error: "User is not authorized",
        });
    }
    next();
};

// const update = async (req, res) => {
//   try {
//     let user = req.profile
//     user = extend(user, req.body)
//     user.updated = Date.now()
//     await user.save()
//     user.hashed_password = undefined
//     user.salt = undefined
//     res.json(user)
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err)
//     })
//   }
// }

// const remove = async (req, res) => {
//   try {
//     let user = req.profile
//     let deletedUser = await user.remove()
//     deletedUser.hashed_password = undefined
//     deletedUser.salt = undefined
//     res.json(deletedUser)
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err)
//     })
//   }
// }

const getCompletion = async (req, res) => {

    if (!req.body.context) {
        return res.status(400).json({
            error: "No Context Provided"
        })
    }

    const context = req.body.context;
    const intent = req.intent;
    const promptText = intent.prompts.slice(-1)[0].text;


    const exp = /{{.+?}}/mg

    const matches = promptText.match(exp);

    let editedPrompt = promptText;

    const len = Object.keys(context).length

    if (len !== matches.length) {
        return res.status(400).json({
            error: 'Mismatch between context length and variable length in prompt.'
        })
    }

    if (len !== 0) {

        for (let i = 0; i < len; i++) {

            const cont_braces = '{{' + Object.keys(context)[i] + '}}'
            const cur_match = matches[i]

            if (cont_braces !== cur_match) {
                return res.status(400).json({
                    error: 'Variable in context does not match variable in prompt!'
                })
            } else {
                editedPrompt = editedPrompt.replace(editedPrompt.match(cur_match), context[Object.keys(context)[i]])
            }
        }
    }

    const resp = await generateResponse(editedPrompt)

    res.json(resp.data)


};


const getPrompt = async (req, res) => {

    if (!req.intent || !req.body.context || !req.body.uresponse || !req.body.airesponse) {
        res.status(400).json({
            error: 'Key variable missing! Must include prompt, context, userresponse (uresponse), and airesponse  in body'
        })
    }

    const intent = req.intent;
    const promptText = intent.prompts.slice(-1)[0].text;

    const context = req.body.context;
    const uresponse = req.body.uresponse;
    const airesponse = req.body.airesponse;


    const exp = /{{.+?}}/mg

    const matches = promptText.match(exp);

    let editedPrompt = promptText;

    const len = Object.keys(context).length

    if (len !== matches.length) {
        return res.status(400).json({
            error: 'Mismatch between context length and variable length in prompt.'
        })
    }

    if (len !== 0) {

        for (let i = 0; i < len; i++) {

            const cont_braces = '{{' + Object.keys(context)[i] + '}}'
            const cur_match = matches[i]

            if (cont_braces !== cur_match) {
                return res.status(400).json({
                    error: 'Variable in context does not match variable in prompt!'
                })
            } else {
                editedPrompt = editedPrompt.replace(editedPrompt.match(cur_match), '{{' + context[Object.keys(context)[i]] + '}}')
            }
        }
    }


    const resp = await generatePrompt(editedPrompt, airesponse, uresponse)


    res.json(resp);

}
export default {
    create,
    read,
    list,
    // remove,
    // update,
    intentById,
    getCompletion,
    hasAuthorization,
    getPrompt
};
