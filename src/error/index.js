const BadRequestError = require("./BadRequestError");

module.exports={
    ...require('./BadRequestError.js'),
    ...require('./NotFoundError.js')
}