// wraps given function into trycatch block and return a new function
function asyncHandler(fn){
    return async (req, res, next) => {
        try {
            await Promise.resolve(fn(req, res, next))
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const errorMessage = error.message || "Internal server error";

            res.status(statusCode).json({
                success: false,
                message: errorMessage,
            })
        }
    }
}

module.exports = asyncHandler