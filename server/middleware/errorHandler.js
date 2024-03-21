const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ code: 500, success: false, message: "Something went wrong" });
  };
  
  export default errorHandler;