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
     JobName: {
        type: Schema.Types.ObjectId,
        ref: 'job',
        required: true,
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
            values: ["Pending", "Retired", "Hired"],
            message: "{VALUE} is not a valid status",
        },
        default: "Pending",

    },

    profilePicture: {
         type:Object,
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