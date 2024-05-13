const { Schema, model } = require ('mongoose');

const EmployeeSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    idCard: {
        type: String,
        required: true
    },
    cv: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    min_salary: {
        type: String,
        required: true
    },
  
    timestamps: true,
});

const EmployeeModel = model('employee',EmployeeSchema);

module.exports=EmployeeModel;