import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: [{
        roleId: {
            type: mongoose.Schema.Types.Mixed,
            required: true, // Reference the respective role schema based on role 
            refPath: 'role.name'
        },
        name: {
            type: String,
            enum: ['ADMIN', 'Manager', 'Trainer Sourcer', 'KeyAccounts'],
            required: true
        }
    }],
    roleId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role' // Assuming Role is a Mongoose model
    }]
}, {
    timestamps: true
})

// Match user entered password to hashed password in database
employeeSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};


// Pre-save hook to hash password
employeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// const Role = mongoose.model('Role', roleSchema);
const Employee = mongoose.model('Employee', employeeSchema);

export default Employee