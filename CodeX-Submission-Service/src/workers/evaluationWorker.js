const { Worker } = require("bullmq");
const axios = require("axios");
const redisConnection = require("../config/redisConfig");
const SubmissionRepository = require("../repository/submissionRepository");

const submissionRepository = new SubmissionRepository();

const logger = require("../config/loggerConfig");

function evaluationWorker(queueName){
    logger.info(`Worker started for queue: ${queueName}`);
    const worker = new Worker(queueName, async (job) => {
        if(job.name === "EvaluationJob" || job.name === "EvaluationResultJob"){
            logger.info({ message: `Job received: ${job.id}`, data: job.data });
            try {
                // Update submission status in db
                // Compute overall status based on test case results
                let finalStatus = "AC";
                if (job.data.status && job.data.status !== "SUCCESS") {
                    finalStatus = job.data.status; // e.g. CE if the whole job failed
                } else if (job.data.testCaseResults) {
                    const failingCase = job.data.testCaseResults.find(r => r.status !== "SUCCESS");
                    if (failingCase) {
                        finalStatus = failingCase.status === "ERROR" ? "RE" : failingCase.status;
                    }
                }

                // Update submission in db
                const submission = await submissionRepository.updateSubmission(job.data.submissionId, { 
                    status: finalStatus,
                    testCaseResults: job.data.testCaseResults 
                });
                logger.debug(`Submission ${job.data.submissionId} updated successfully: ${finalStatus}`);

                // Notify frontend via socket service
                const response = await axios.post("http://socket-service:4005/sendPayload", {
                    userId: job.data.userId,
                    payload: {
                        ...job.data,
                        status: finalStatus // Send the aggregate status
                    }
                });
                logger.info(`Notification sent for submission ${job.data.submissionId}: ${response.data.message || 'success'}`);
            } catch (error) {
                logger.error(`Error processing job ${job.id}: ${error.message}`);
            }
        }
    },{
        connection: redisConnection,
        stalledInterval: 43200000, // 12 hours
        lockDuration: 600000,      // 10 minutes (plenty for code execution)
        drainDelay: 60,            // Poll once per minute when idle
        skipFillWatcher: true
    });
    return worker;
}

module.exports = evaluationWorker;