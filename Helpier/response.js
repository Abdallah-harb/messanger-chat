global.jsonResponse = (res, data = null, message = 'success', code = 200) => {
    return res.status(code).json({ code, message, data });
};

global.errorResponse = (res, message = 'Bad Request', errors = null, code = 400) => {
    const response = {
        code,
        message,
        ...(errors ? { errors } : {})
    };
    return res.status(code).json(response);
};