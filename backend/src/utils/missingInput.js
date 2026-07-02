import { ApiError } from "./apiError.js";

const missingInput = (input, requiredFields) => {
    const missingFields = [];
    for (const field of requiredFields) {
        if (!input[field]) {
            missingFields.push(field);
        }
    }
    return missingFields;
};

const validateInput = (input, requiredFields) => {
    const missingFields = missingInput(input, requiredFields);
    if (missingFields.length > 0) {
        throw new ApiError(400, `Thiếu các trường bắt buộc: ${missingFields.join(", ")}`);
    }
};

export { missingInput, validateInput };