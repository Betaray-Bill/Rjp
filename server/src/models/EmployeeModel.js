import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['ADMIN', 'Manager', 'Trainer Sourcer', 'KeyAccount'],
        required: true
    },
    permissions: [{ type: String }] // ['manage_employees', 'access_deals', 'register_trainers']
});

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    employeeId: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'Role'
    },
    authorizations: [{
        type: String
    }],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'Employee'
    }
}, {
    timestamps: true
})

// Pre-save hook to hash password
employeeSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});


const Role = mongoose.model('Role', roleSchema);
const Employee = mongoose.model('Employee', employeeSchema);

export { Employee, Role };