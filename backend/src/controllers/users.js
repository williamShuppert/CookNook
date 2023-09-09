import User from "../models/user.js"
import { catchAsync } from "../utils/catch-async.js"
import { ApiError } from "../utils/api-error.js"
import httpStatus from 'http-status'

export default {
    getUser: catchAsync(async (req, res) => {
        const user = await User.findByPk(req.params.userId, { attributes: ['id', 'displayname']})
        if (!user)
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        res.send(user);
    })
} 