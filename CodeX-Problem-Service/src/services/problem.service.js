const sanitizeMarkdown = require("../utils/markdownSanitizer");
const NotFoundError = require("../errors/notFound.error");
const logger = require("../config/logger.config").child({ label: 'Service', source: 'ProblemService' });

class ProblemService {
  // as we might use the service for different repositories like one might be using mongodb and other might be using mysql, so we are making the constructor to accept the repository
  constructor(problemRepository) {
    this.problemRepository = problemRepository;
  }

  async createProblem(problemData) {
    try {
      // 1. Sanitize the markdown content
      if (problemData.description){
        problemData.description = sanitizeMarkdown(problemData.description);
      }
      if (problemData.editorial){
        problemData.editorial = sanitizeMarkdown(problemData.editorial);
      }
      // 2. Create the problem
      const problem = await this.problemRepository.createProblem(problemData);
      return problem;
    } catch (error) {
      throw error;
    }
  }

  async getAllProblems() {
    try {
      const problems = await this.problemRepository.getAllProblems();
      return problems;
    } catch (error) {
      throw error;
    }
  }

  async getProblemByID(problemId) {
    try {
      console.log("Problem ID: ", problemId);
      const problem = await this.problemRepository.getProblemByID(problemId);
      if(!problem){
        logger.error(`Problem with id: ${problemId} not found`);
        throw new NotFoundError("Problem", problemId);
      }
      return problem;
    } catch (error) {
      throw error;
    }
  }

  async deleteProblem(problemId){
    try {
      const problem = await this.problemRepository.deleteProblem(problemId);
      if(!problem){
        throw new NotFoundError("Problem", problemId);
      }
      return problem;
    } catch (error) {
      throw error;
    }
  }

  async updateProblem(problemId,problemData){
    try {
      if(problemData.description){
        problemData.description = sanitizeMarkdown(problemData.description);
      }
      if(problemData.editorial){
        problemData.editorial = sanitizeMarkdown(problemData.editorial);
      }
      const problem = await this.problemRepository.updateProblem(problemId,problemData);
      if(!problem){
        throw new NotFoundError("Problem", problemId);
      }
      return problem;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProblemService;
