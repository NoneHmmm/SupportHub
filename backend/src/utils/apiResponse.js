export const sendSuccess = (res, statusCode,  message = 'Success', data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data: data || null,
  });
};

export const sendPaginated = (res, data, pagination, message = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};
