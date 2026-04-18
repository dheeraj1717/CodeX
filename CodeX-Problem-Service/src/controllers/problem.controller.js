const { ProblemService } = require("../services");
const { ProblemRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");

const problemService = new ProblemService(new ProblemRepository());

const pingProblemController = (req, res) => {
  return res.json({ message: "Problem controller is alive" });
};

const addProblem = async (req, res, next) => {
  try {
    const newProblem = await problemService.createProblem(req.body);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Problem created successfully",
      data: newProblem,
    });
  } catch (error) {
    next(error);
  }
};
const getProblemByID = async (req, res, next) => {
  try {
    const problem = await problemService.getProblemByID(req.params.id);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Problem fetched successfully",
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};
const getProblems = async (req, res, next) => {
  try {
    const problems = await problemService.getAllProblems();
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Problems fetched successfully",
      data: problems,
    });
  } catch (error) {
    next(error);
  }
};
const deleteProblem = async (req, res, next) => {
  try {
    const deletedProblem = await problemService.deleteProblem(req.params.id);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Problem deleted successfully",
      data: deletedProblem,
    });
  } catch (error) {
    next(error);
  }
};
const updateProblem = async (req, res, next) => {
  try {
    const updatedProblem = await problemService.updateProblem(req.params.id,req.body);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Problem updated successfully",
      data: updatedProblem,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  pingProblemController,
  addProblem,
  getProblemByID,
  getProblems,
  deleteProblem,
  updateProblem,
};
