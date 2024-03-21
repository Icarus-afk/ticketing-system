const logger = (req, res, next) => {
    console.log(`Received ${req.method} request to ${req.originalUrl}`);
    next();
  };
  
  export default logger;