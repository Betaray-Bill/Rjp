import { Employee } from "../models/EmployeeModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";





// Finance Controller

const sendPurchaseOrder = asyncHandler(async(req, res) => {
    const empId = req.params.empId;
    const employee = await Employee.findById(empId);
    if (!employee) {
        return res.status(404).json(new ApiResponse(false, "Employee not found"));
    }

    try {
        // Logic to send PO
    } catch (err) {
        return res.status(500).json(new ApiResponse(false, "Error occurred while sending purchase order"));
    }

})



export {
    sendPurchaseOrder,
    // getEmployee
}