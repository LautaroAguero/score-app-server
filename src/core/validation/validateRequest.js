// Middleware para validar requests usando Joi
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      // Recopilar todos los errores
      const errors = {};
      error.details.forEach((detail) => {
        const field = detail.context.label || detail.path.join(".");
        errors[field] = detail.message;
      });

      return res.status(400).json({
        message: "Error de validación",
        errors,
      });
    }

    // Reemplazar req.body con los datos validados (sanitizados)
    req.body = value;
    next();
  };
};
