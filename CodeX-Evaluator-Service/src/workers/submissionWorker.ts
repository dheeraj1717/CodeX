import { Job, Worker } from "bullmq";
import redisConnection from "../config/redisConfig";
import SubmissionJob from "../jobs/SubmissionJob";

export default function SubmissionWorker(queueName: string) {
  new Worker(queueName, async (job: Job) => {
    if (job.name === "SubmissionJob") {
      const submissionJobInstance = new SubmissionJob(job.data);
      submissionJobInstance.handler(job);
    }
    return true;
  },{
    connection: redisConnection,
    stalledInterval: 43200000,
    lockDuration: 600000,
    drainDelay: 3600,
    stalledCheckInterval: 86400000,
    skipFillWatcher: true
  } as any);
}
