import customRoutes from './customRoutes';
import methodListener from '../server/methodListener';
import responseManager from '../generator/responseManager';
import requestMethod from './requestMethod';
import logger from '../log/logger';

class RouteManager {

    routes = [];

    getRoutes() {
        return this.routes;
    }

    prepareRoutes(server) {
        this.addCustomRoutes();
        this.createMethods(server);
        this.preparePredefinedResponses();
    }

    addCustomRoutes() {
        if (customRoutes && Array.isArray(customRoutes)) {
            for (let i = 0; i < customRoutes.length; i++) {
                this.validateCustomRouteDefinition(customRoutes[i]);
                customRoutes[i].isCustomRoute = true;
            }
            this.routes = this.routes.filter(route =>
                customRoutes.some(customRoute =>
                    customRoute.basePath === route.basePath
                    && customRoute.path === route.path
                    && route.method === customRoute.method)
                === false);
            Array.prototype.push.apply(this.routes, customRoutes);
        }
    }

    validateCustomRouteDefinition(customRoute) {
        if (!customRoute.basePath) {
            logger.customRouteBasePathError(customRoute);
            process.exit(1);
        }
        if (!customRoute.path) {
            logger.customRoutePathError();
            process.exit(1);
        }
        if (!customRoute.method) {
            logger.customRouteMethodError(customRoute);
            process.exit(1);
        }
    }

    createMethods(server) {
        this.routes.reverse().forEach(route => {
            switch (route.method) {
                case requestMethod.GET:
                    methodListener.createGetMethod(server, route, route.isCustomRoute ? route.function : undefined);
                    break;
                case requestMethod.POST:
                    methodListener.createPostMethod(server, route, route.isCustomRoute ? route.function : undefined);
                    break;
                case requestMethod.DELETE:
                    methodListener.createDeleteMethod(server, route, route.isCustomRoute ? route.function : undefined);
                    break;
                case requestMethod.PUT:
                    methodListener.createPutMethod(server, route, route.isCustomRoute ? route.function : undefined);
                    break;
                case requestMethod.PATCH:
                    methodListener.createPatchMethod(server, route, route.isCustomRoute ? route.function : undefined);
                    break;
            }
        });
    }

    preparePredefinedResponses(){
        responseManager.preparePredefinedResponses();
    }
}

export default RouteManager;