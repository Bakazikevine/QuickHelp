//CREATE A JOB
const jobs = require("../models/jobsModel");
const asyncWrapper = require("../middlewares/async.js");
const { validationResult } = require("express-validator");
const BadRequestError = require("../error/BadRequestError.js");
const { NotFoundError } = require("../error/NotFoundError.js");
const cloudinary = require("../utils/cloudinary.js");

const createJobController = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestError(errors.array()[0].msg));
  }
  
  let Picture = {};
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      Picture = {
        public_id: result.public_id,
        asset_id: result.asset_id,
        url: result.secure_url,
      };
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return next(new Error("Failed to upload profile picture to Cloudinary"));
  }
  
  const { JobName, Description } = req.body;

  // Validation
  if (!JobName || !Description || !Picture.url) {  
    return res.status(400).send({
      success: false,
      message: "Please fill in all the fields",
    });
  }
  
  const existingJob = await jobs.findOne({ JobName: JobName });
  if (existingJob) {
    return res.status(400).send({
      success: false,
      message: "Job already exists",
    });
  }

  const newJob = new jobs({ JobName, Description, Picture });
  await newJob.save();
  res.status(201).send({
    success: true,
    message: "Job created successfully",
    data: newJob, 
  });
});
//GET A JOB BY IT'S NAME
const getJobByNameController = async (req, res) => {
  try {
    const { JobName } = req.params;
    const job = await jobs.findOne({ JobName: JobName });
    if (!job) {
      return res.status(404).send({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).send({
      message: "Jobs according to name",
      data:job,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in the Get Job by Name API",
      error,
    });
  }
};
// GET ALL JOBS
const getAllJobsController = async (req, res) => {
  try {
    const jober = await jobs.find({});
    if (!jober) {
      return res.status(404).send({
        success: false,
        message: "No Job Available",
      });
    }
    res.status(200).send({
      success: true,
      totalCount: jober.length,
      jober,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get ALL JOBS API",
      error,
    });
  }
};

// GET Job BY ID
const getJobByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await jobs.findById(id);
    if (!job) {
      return res.status(404).send({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).send({
      success: true,
      data: job,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in the Get Job by ID API",
      error,
    });
  }
};
//DELETE JOB
const deleteJobController = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(404).send({
        success: false,
        message: "Job Not Found OR Provide Job ID",
      });
    }
    await jobs.findByIdAndDelete(jobId);
    res.status(200).send({
      success: true,
      message: "Job Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror in delete Job API",
      error,
    });
  }
};
//UPDATE JOB
const updateJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const { JobName, Description } = req.body;
    let Picture = {};

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      Picture = {
        public_id: result.public_id,
        asset_id: result.asset_id,
        url: result.secure_url
      };
    }

    const job = await jobs.findById(id);
    if (!job) {
      return res.status(404).send({
        success: false,
        message: "Job not found",
      });
    }

    job.JobName = JobName || job.JobName;
    job.Description = Description || job.Description;
    if (Object.keys(Picture).length !== 0) { 
      job.Picture = Picture;
    }

    await job.save();

    res.status(200).send({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in the Update Job API",
      error,
    });
  }
};
module.exports = {
  createJobController,
  getJobByNameController,
  getJobByIdController,
  getAllJobsController,
  updateJobController,
  deleteJobController,
};
