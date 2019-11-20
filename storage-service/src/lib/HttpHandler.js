const HttpHandler = fn => async (req, res) => {
  try {
    const result = await fn(req);

    if (result) {
      res.status(result.statusCode).json(result.body);
    }
  } catch (error) {
    console.log(error);
  }
};

export default HttpHandler;
