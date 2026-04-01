export function RoleMiddleware(requiredRole){
    return (req, res, next) => {
        if (!req.user || req.user.role != requiredRole) {
            return res.status(403).json({ error: 'Acesso Negado: Você não tem permissão de ' + requiredRole, })
        }
        next();
    }
}