/**
 * Envuelve una función de controlador asíncrona para capturar errores
 * y pasarlos al siguiente middleware (manejador de errores).
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
