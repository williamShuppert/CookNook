import httpStatus from "http-status";

export const getDuplicateEntryKey = (err) => {
    if (err.errno == 1062)
        return err.message.split("key '")[1].split('.')[1].slice(0, -1)
    return null
}

// Convert SQL query errors to a HTTP status code
export const mysqlErrorToHttpStatus = (err) => {
    switch (err.errno) {
        case 1062:
            return httpStatus.CONFLICT // Duplicate entry
        case 1048:
            return httpStatus.BAD_REQUEST // Missing required field
        case 1451:
        case 1452:
            return httpStatus.CONFLICT // Foreign key constraint violation
        default:
            return httpStatus.INTERNAL_SERVER_ERROR
    }
}