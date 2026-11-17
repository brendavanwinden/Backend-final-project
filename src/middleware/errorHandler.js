export const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({
    message: "An error occurred on the server, please double-check your request!",
  });
};