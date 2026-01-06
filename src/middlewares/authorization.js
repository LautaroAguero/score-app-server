/**
 * Authorization Middleware
 * Valida que el usuario tenga el rol requerido para acceder a una ruta
 */

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Token requerido" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `No tienes permiso. Se requieren uno de estos roles: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};
