import RouteManager from './router/routeManager'
import ServerInitializer from './server/serverInitializer'

const serverInitializer = new ServerInitializer();
const server = serverInitializer.getServer();
const routeManager = new RouteManager();
routeManager.prepareRoutes(server);
const routes = routeManager.getRoutes();
serverInitializer.startListening(routes);
