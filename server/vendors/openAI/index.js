import { Configuration, OpenAIApi } from "openai";
import config from "../../config.js";

const configuration = new Configuration({
  organization: config.openaiOrganization,
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
  context,
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

  //   let gradientPrompt =
  //     "Your task is to optimize a prompt template for GPT-3.5 based on user input, GPT-3.5's response, and the ideal response as provided by the user. Here is the original prompt template:" +
  //     prompt +
  //     ". This marks the end of the prompt template. In the prompt template, expressions enclosed in double braces are context parameters, which correspond with arguments provided by the user." +
  //     "\n Here is GPT-3.5's response to the prompt template given the following user arguments: ";
  //   Object.keys(context).map((v) => {
  //     gradientPrompt += `\n{{${v}}}: ${context[v]}`;
  //   });

  //   gradientPrompt += "\n GPT-3.5 Response:\n";
  //   airesponse +
  //     "\nThis marks the end of GPT-3.5's response. Finally, here is the ideal response to the prompt template given the user arguments: \n" +
  //     useresponse +
  //     "\nThis marks the end of the ideal response. Given the original prompt template, the user arguments, GPT-3.5's response, and the ideal response, provide an optimized version of the original prompt template that will make GPT-3.5's response more like the ideal response. In your response, make sure to include only the optimized prompt template without any examples. Furthermore, make sure that the optimized prompt template has the same context variables as the original prompt template.";

  let gradientPrompt =
    `I'm trying to write a language model prompt. \nMy current prompt is: \n \"${prompt}\"\n` +
    "But the prompt got this example wrong:\n";
  Object.keys(context).map((v) => {
    gradientPrompt += `${v}: \"${context[v]}\"\n`;
  });
  gradientPrompt += `Prompt's Response: \"${airesponse}\"\n`;
  gradientPrompt += `Correct Response: \"${useresponse}\"\n`;

  gradientPrompt += `Give one reason why the prompt could have gotten this examples wrong.
  Wrap the reason with <START> and <END>.\n`;

  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: config.openaiModel,
    messages: [{ role: "system", content: gradientPrompt }],
    temperature: 1,
    max_tokens: 1000,
  });
  //   return response.data.choices[0].message.content;

  const feedback = await applyFeedback(
    response.data.choices[0].message.content,
    prompt,
    airesponse,
    useresponse,
    context
  );

  const feedbackText = feedback.data.choices[0].message.content;
  return feedbackText;
  //   const newPrompt = await checkForPrompt(feedbackText);

  //   const newPromptText = newPrompt.data.choices[0].message.content;

  //   if (newPromptText.includes("No prompt found")) {
  //     return generatePrompt(
  //       prompt,
  //       airesponse,
  //       useresponse,
  //       (iterations = ++iterations),
  //       (feedbackVar = feedbackText)
  //     );
  //   } else {
  //     return newPromptText;
  //   }
};

export const applyFeedback = async (
  feedback,
  prompt,
  airesponse,
  useresponse,
  context,
  iterations = 0,
  feedbackVar = null
) => {
  //   const getFeedback =
  //     "Here is an original prompt for this LLM model: " +
  //     originalPrompt +
  //     " This marks" +
  //     " the end of the original prompt. Here is the feedback I received for this prompt: " +
  //     feedback +
  //     " This " +
  //     "marks the end of the feedback. Please apply the feedback to the prompt and give me a new prompt that lies within " +
  //     "100 tokens. DO NOT fabricate any information or change the intent of the prompt. DO NOT execute the prompt, just" +
  //     "give me the new prompt" +
  //     "";

  let feedbackPrompt =
    `I'm trying to write a language model prompt. \nMy current prompt is: \n \"${prompt}\"\n` +
    "But the prompt got this example wrong:\n";
  Object.keys(context).map((v) => {
    feedbackPrompt += `${v}: \"${context[v]}\"\n`;
  });
  feedbackPrompt += `Prompt's Response: \"${airesponse}\"\n`;
  feedbackPrompt += `Correct Response: \"${useresponse}\"\n`;

  feedbackPrompt += `Based on these examples the problem with this
  prompt is that ${feedback}\n`;

  feedbackPrompt += `Based on the above information, I wrote 3 different improved prompts. Each prompt is wrapped with <START> and <END>\n`;
  feedbackPrompt += `The 3 new prompts are: \n`;

  const openai = new OpenAIApi(configuration);
  return await openai.createChatCompletion({
    model: config.openaiModel,
    messages: [{ role: "user", content: feedbackPrompt }],
    temperature: 1,
    max_tokens: 1000,
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
