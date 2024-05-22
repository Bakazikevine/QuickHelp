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
         required:true
     },
    job: {
        type: String,
        enum: ["Housemaid", "Personal trainer","Gatekeeper", "BabySitter","Plumber","Gardener","Home chef","Caregiver","Home Tutor"],
        default: 'Housemaid',
    },
    experience: {
        type: String,
        required: true
    },
    min_salary: {
        type: String,
        required: true
    },
    status: {
        type: String, 
        enum: {
            values: ["In Progress", "Retired", "Hired"],
            message: "{VALUE} is not a valid status",
        },
        default: "In Progress",
    },

    profilePicture: {
         type: String,
         required:true

     },
     dateOfBirth: {
        type: Date,
        required: true,
      },
},
{
    timestamps: true,
});

const EmployeeModel = model('employee',EmployeeSchema);

module.exports=EmployeeModel;