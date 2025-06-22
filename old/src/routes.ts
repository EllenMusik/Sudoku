const routes = [
    { path: '/', module: () => import('./app/root') },
    { path: '/login', module: () => import('./app/login') },
    { path: '/register', module: () => import('./app/register') }, // Ensure the file './app/register.ts' exists
    { path: '/profile', module: () => import('./app/profile') },
    { path: "404", module: () => import('./app/404') }
];

export default routes;