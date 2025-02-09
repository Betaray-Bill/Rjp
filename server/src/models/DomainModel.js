import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const domainSchema = new mongoose.Schema({
  domains: [
    {
      name: { type: String, required: true },
      subdomains: [{ type: String }],
    },
  ],
});

const Domains = mongoose.model("Domains", domainSchema);

export default Domains