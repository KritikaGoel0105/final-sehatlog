// Middleware to check if user has required role(s)
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: `This action requires one of the following roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

// Specific role middlewares
const requireAdmin = requireRole('admin');
const requireDoctor = requireRole('doctor');
const requirePatient = requireRole('patient');
const requireAdminOrDoctor = requireRole('admin', 'doctor');

module.exports = {
  requireRole,
  requireAdmin,
  requireDoctor,
  requirePatient,
  requireAdminOrDoctor
};
