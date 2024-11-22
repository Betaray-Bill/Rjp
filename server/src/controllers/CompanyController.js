import { CompanyContact, Company } from "../models/CompanyAndDealModels/CompanyModel.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a Company - new Company for a deal
const createCompany = asyncHandler(async(req, res) => {
    const { companyName, contact_name, c, contact_phone_number } = req.body

    // check if the company exists
    const existingCompany = await Company.findOne({ companyName: companyName })
    if (existingCompany) {
        return res
            .status(400)
            .json({ message: 'Company already exists' });
    }

    try {

        const companyContact = new CompanyContact({
            contactName: contact_name,
            contactEmail: contact_name,
            contactPhoneNumber: contact_phone_number
        })

        await companyContact.save();

        const company = new Company({
            companyName,
            contact_details: [companyContact._id]
        });

        await company.save();
        res
            .status(201)
            .json({ message: 'Company created successfully', company, Created_By: req.user_id });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Error creating company', error: err.message });
    }

})

// Get Company Details By Id
const getCompanyDetails = asyncHandler(async(req, res) => {
    const { companyId } = req.params;

    const company = await Company.findById(companyId).populate('contact_details');
    // .populate('Deals')
    if (!company) {
        return res
            .status(404)
            .json({ message: 'Company not found' });
    }

    res.json(company);
})

// Create a New Contact for a Company
const createContact = asyncHandler(async(req, res) => {
    const { companyId } = req.params;
    console.log("Com Is", companyId)
    const { contact_name, contact_email, contact_phone_number } = req.body;
    let details = {
        contact_name,
        contact_email,
        contact_phone_number
    }
    try {
        const companyContact = new CompanyContact({
            contactName: contact_name,
            contactEmail: contact_email,
            contactPhoneNumber: contact_phone_number
        })

        await companyContact.save();

        await Company.findByIdAndUpdate(companyId, {
            $push: {
                contact_details: companyContact._id
            }
        }, { new: true });

        res
            .status(201)
            .json({ message: 'Contact created successfully' });

    } catch (err) {
        console.error("Error creating contact:", err);
        res
            .status(500)
            .json({ error: "Internal server error" });
    }

})

// Get All Company Name and Id
const getAllCompanyNamesAndIds = asyncHandler(async(req, res) => {
    // console.log(object)
    console.log("----------------------------------------------------------------")
    try {
        // Find all companies and project only name and _id fields
        const companies = await Company
            .find()
            .select('companyName')
            .populate('contact_details');
        console.log(companies)
        if (!companies || companies.length === 0) {
            return res
                .status(404)
                .json({ message: "No companies found" });
        }

        res
            .status(200)
            .json({ message: "Companies retrieved successfully", companies });
    } catch (error) {
        console.error("Error retrieving companies:", error);
        res
            .status(500)
            .json({ error: "Internal server error" });
    }
})

export { createCompany, getCompanyDetails, getAllCompanyNamesAndIds, createContact }