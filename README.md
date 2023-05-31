# PromptLab

## Development

### Requirements

- NodeJS

### Instructions

1. Setup environment variables

   1. create a `.env` file in `PromptLab/server` with the following structure:

      ```
      MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.5stj2s0.mongodb.net/?retryWrites=true&w=majority"
      ```

2. To run the backend:
   1. Open a new terminal window and navigate to `PromptLab`
   2. run `$ cd server`
   3. run `$ npm i`
   4. run `$ npx nodemon` to run the server in development mode with auto-reload any time a file is changed.
3. To run the frontend:
   1. Open a new terminal window and navigate to `PromptLab`
   2. run `$ cd client`
   3. run `$ npm i`
   4. run `$ npm start` to run the client in development mode with auto-reload any time a file is changed.
4. Open your browser and navigate to `http://localhost:3000`, and start developing!
