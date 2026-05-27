exports.success = (res, data, status = 200) => res.status(status).json(data);
exports.error = (res, message, status = 400) => res.status(status).json({ message });
