import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import promptRoutes from "./routes/prompt.routes.js";
import intentRoutes from "./routes/intent.routes.js";
import projectRoutes from "./routes/project.routes.js";

//comment out before building for production
// import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd();
const app = express();

//comment out before building for production
// devBundle.compile(app)

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://getpromptlab.io",
      "https://www.getpromptlab.io",
      "https://getpromptlab.io",
      "https://www.getpromptlab.io",
    ],
    credentials: true,
  })
);

app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));

// mount routes
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", promptRoutes);
app.use("/", intentRoutes);
app.use("/", projectRoutes);

// app.get('*', (req, res) => {
//   // const sheets = new ServerStyleSheets()
//   const context = {}
//   const markup = ReactDOMServer.renderToString(
//     <StaticRouter location={req.url} context={context}>
//       {/* <ThemeProvider theme={theme}> */}
//         <MainRouter />
//       {/* </ThemeProvider> */}
//     </StaticRouter>
//   )
//     if (context.url) {
//       return res.redirect(303, context.url)
//     }
//     // const css = sheets.toString()
//     res.status(200).send(Template({
//       markup: markup,
//       css: style
//     }))
// })

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default app;
