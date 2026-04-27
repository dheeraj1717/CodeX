import express from "express";
import { PORT } from "./config/serverConfig";
import apiRouter from "./routes";
import errorHandler from "./utils/errorHandler";
import runCPP from "./containers/cppExecutor";
import SubmissionWorker from "./workers/submissionWorker";
import { SUBMISSION_QUEUE, CPP_IMAGE, JAVA_IMAGE, PYTHON_IMAGE } from "./utils/constants";
import submissionQueueProducer from "./producers/submissionQueueProducer";
import { prewarmImages } from "./containers/pullImage";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Evaluator service is running on port ${PORT}`);

  // Pull all executor images once at startup — prevents stalls on first submission
  await prewarmImages([CPP_IMAGE, JAVA_IMAGE, PYTHON_IMAGE]);

  SubmissionWorker(SUBMISSION_QUEUE);
});

