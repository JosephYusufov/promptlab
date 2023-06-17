import {Configuration, OpenAIApi} from "openai";
import config from '../../config.js'

const configuration = new Configuration({
    organization: 'org-jTR9YCQ7JXiBkTx0gV5pVL13',
    apiKey: config.openaiKey
})


export const generateResponse = async (prompt) => {
    const openai = new OpenAIApi(configuration)
    return await openai.createCompletion({
        model: config.openaiModel,
        prompt: prompt,
        temperature: 0.2
    })
}

export const generatePrompt = async (prompt, airesponse, useresponse) => {

    const feedbackPrompt = 'The following prompt was fed to ' + config.openaiModel + ':' +
        prompt + ' This is the response the model generated: \n' + airesponse + ' However, the response' +
        ' the user was looking for was this: \n' + useresponse + '\n Your Task is the following: ' +
        'Enhance the prompt ' + prompt + 'to provide a response with the desired tone and style' +
        'of the user response above. Make sure to provide only the enhanced prompt. DO NOT PROVIDE AN EXAMPLE RESPONSE. ' +
        'Any text in the prompt in double curly braces should be preserved.'

    const openai = new OpenAIApi(configuration)
    const response = await openai.createCompletion({
        model: config.openaiModel,
        prompt: feedbackPrompt,
        temperature: 0.2,

    })

    return String.split(response, '\n')[0].replace('Enhanced Prompt: ', '')

}

