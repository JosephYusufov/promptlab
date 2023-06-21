import { Configuration, OpenAIApi } from "openai";
import config from "../../config.js";

const configuration = new Configuration({
  organization: "org-jTR9YCQ7JXiBkTx0gV5pVL13",
  apiKey: config.openaiKey,
});

export const generateResponse = async (prompt) => {
  const openai = new OpenAIApi(configuration);

  return await openai.createChatCompletion({
    model: config.openaiModel,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 1000,
  });
};

export const generatePrompt = async (
  prompt,
  airesponse,
  useresponse,
  iterations = 0,
  feedbackVar = null
) => {
  if (iterations >= 5) {
    return "Max Iterations (5) reached";
  }

  const feedbackPrompt =
    "I gave this prompt to chatgpt-3.5: " +
    prompt +
    ". After I fed this prompt to the" +
    " model, this is what I got: " +
    airesponse +
    " This marks the end of the model output. However, I was hoping" +
    " for an output more like the text below: " +
    useresponse +
    " This marks the end of the ideal output. How can I " +
    "improve the original prompt to ensure I get a model output with the correct tone and style? Please give me suggestions " +
    "to improve the original prompt within a 100 token limit";

  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: config.openaiModel,
    messages: [{ role: "system", content: feedbackPrompt }],
    temperature: 1,
    max_tokens: 100,
  });
  const feedback = await applyFeedback(
    prompt,
    response.data.choices[0].message.content
  );

  const feedbackText = feedback.data.choices[0].message.content;

  const newPrompt = await checkForPrompt(feedbackText);

  const newPromptText = newPrompt.data.choices[0].message.content;

  if (newPromptText.includes("No prompt found")) {
    return generatePrompt(
      prompt,
      airesponse,
      useresponse,
      (iterations = ++iterations),
      (feedbackVar = feedbackText)
    );
  } else {
    return newPromptText;
  }
};

export const applyFeedback = async (originalPrompt, feedback) => {
  const getFeedback =
    "Here is an original prompt for this LLM model: " +
    originalPrompt +
    " This marks" +
    " the end of the original prompt. Here is the feedback I received for this prompt: " +
    feedback +
    " This " +
    "marks the end of the feedback. Please apply the feedback to the prompt and give me a new prompt that lies within " +
    "100 tokens. DO NOT fabricate any information or change the intent of the prompt. DO NOT execute the prompt, just" +
    "give me the new prompt" +
    "";

  const openai = new OpenAIApi(configuration);
  return await openai.createChatCompletion({
    model: config.openaiModel,
    messages: [{ role: "user", content: getFeedback }],
    temperature: 1,
    max_tokens: 100,
  });
};

export const checkForPrompt = async (potPrompt) => {
  const modelText =
    "A valid prompt is defined as any request that could be interpreted " +
    "by a language learning model and used to generate some sort of output. " +
    "Please check if there is a valid prompt in the below text. If there is a valid prompt" +
    ", please extract and return ONLY the prompt in plain text. " +
    'If there is no prompt, return "No prompt found". \n' +
    potPrompt;

  const openai = new OpenAIApi(configuration);
  return await openai.createChatCompletion({
    model: config.openaiModel,
    messages: [{ role: "system", content: modelText }],
    temperature: 0.5,
    max_tokens: 100,
  });
};
