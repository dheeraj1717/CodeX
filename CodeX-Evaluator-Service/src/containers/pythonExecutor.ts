import createContainer from "./containerFactory";
import { PYTHON_IMAGE } from "../utils/constants";
import { fetchDecodedStream } from "./dockerHelper";
import pullImage from "./pullImage";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";

class PythonExecutor implements CodeExecutorStrategy {
  async execute(code: string, inputTestCase: string, outputTestCase: string): Promise<ExecutionResponse> {
    const rawLogBuffer: Buffer[] = [];
    await pullImage(PYTHON_IMAGE);
    console.log("Initialising a new python docker container");
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
    console.log(runCommand);

    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
      "/bin/sh",
      "-c",
      runCommand,
    ]);
    await pythonDockerContainer.start();
    console.log("pythonDockerContainer", pythonDockerContainer);
    const loggerStream = await pythonDockerContainer.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: true,
    });

    loggerStream.on("data", (chunk) => rawLogBuffer.push(chunk));

    try {
      const codeResponse: string = await fetchDecodedStream(loggerStream, rawLogBuffer);
      if (codeResponse.trim() === outputTestCase.trim()) {
        return { output: codeResponse, status: "SUCCESS" };
      } else {
        return { output: codeResponse, status: "WA" };
      }
    } catch (error) {
      if (error === "TLE") {
        try {
          await pythonDockerContainer.kill();
        } catch (e) {
          // Container might already be stopped
        }
        return { output: error as string, status: "TLE" };
      }
      return { output: error as string, status: "ERROR" };
    } finally {
      try {
        await pythonDockerContainer.remove();
      } catch (e) {
        // Container might already be removed
      }
    }
  }
}

export default PythonExecutor;
