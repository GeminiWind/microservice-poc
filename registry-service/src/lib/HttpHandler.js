const HttpHandler = fn => async (req, res, next) => {
  try {
    const result = await fn(req);

    if (result) {
      res.status(result.statusCode).json(result.body);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default HttpHandler;
