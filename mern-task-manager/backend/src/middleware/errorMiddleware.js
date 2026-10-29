export function notFound(req, res, _next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: status === 500 ? "Something went wrong on the server." : err.message });
}
