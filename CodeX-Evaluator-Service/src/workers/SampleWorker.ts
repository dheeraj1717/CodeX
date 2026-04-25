import { Job, Worker } from "bullmq";
import SampleJob from "../jobs/SampleJob";
import redisConnection from "../config/redisConfig";

export default function SampleWorker(queueName: string) {
  new Worker(queueName, async (job: Job) => {
    if (job.name === "SampleJob") {
      const sampleJobInstance = new SampleJob(job.data);
      sampleJobInstance.handler(job);
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
