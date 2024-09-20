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


const Role = mongoose.model('Role', roleSchema);
const Employee = mongoose.model('Employee', employeeSchema);

export { Employee, Role };