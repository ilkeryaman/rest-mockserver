import requestMethod from '../router/requestMethod';
import colorCode from './colorCode';

function info(msg) {
    console.log(colorCode.brightMagenta, '[INFO]: ' + msg, colorCode.reset);
}

function error(msg, route) {
    console.log(colorCode.red, '[ERROR]: ' + msg);
    if (route) {
        console.log(colorCode.cyan, route);
    }
    console.log(colorCode.reset, '');
}

function customRouteBasePathError(route) {
    error('All custom routes must have \'basePath\'. Please check custom route definitions in customRoutes.js file.', route);
}

function customRoutePathError() {
    error('All custom routes must have \'path\'. Please check custom route definitions in customRoutes.js file.');
}

function customRoutePathNotFoundError(route) {
    error('The given \'path\' in custom route definitions is not a valid path. Please check custom route definitions in customRoutes.js file.', route);
}

function customRouteMethodError(route) {
    error('All custom routes must have \'method\' with one of value: [' +
        requestMethod.GET.toUpperCase() + '], [' +
        requestMethod.POST.toUpperCase() + '], [' +
        requestMethod.DELETE.toUpperCase() + '], [' +
        requestMethod.PUT.toUpperCase() + '] or [' +
        requestMethod.PATCH.toUpperCase() + '].' +
        'Please check custom route definitions in customRoute.js file.', route);
}

function displayServerEndpoints(routes, port, sslEnabled) {
    console.log(colorCode.cyan, 'JSON Server is running on:');
    console.log(colorCode.cyan, '============================ CONFIGURATION ROUTES ===========================')
    routes.filter(route => route.isConfigurationRoute).reverse().forEach(route => {
        displayRouteInformation(route, port, sslEnabled);
    });
    console.log('');

    console.log(colorCode.cyan, '=============================== DEFAULT ROUTES ==============================')
    if (routes.some(route => !route.isCustomRoute && !route.isConfigurationRoute)) {
        routes.filter(route => !route.isCustomRoute && !route.isConfigurationRoute).reverse().forEach(route => {
            displayRouteInformation(route, port, sslEnabled);
        });
    } else {
        console.log(colorCode.cyan, 'No default route is defined.');
    }
    console.log('');

    console.log(colorCode.cyan, '=============================== CUSTOM ROUTES ===============================')
    if (routes.some(route => route.isCustomRoute)) {
        routes.filter(route => route.isCustomRoute).reverse().forEach(route => {
            displayRouteInformation(route, port, sslEnabled);
        });
    }
    else {
        console.log(colorCode.cyan, 'No custom route is defined.');
    }
    console.log(colorCode.reset, '');
}

function displayRouteInformation(route, port, sslEnabled) {
    console.log(colorCode.yellow,
        '[' + route.method.toUpperCase() + ']'
        + (route.method === requestMethod.DELETE || route.method === requestMethod.PATCH ? '\t' : '\t\t')
        + (sslEnabled ? 'https://' : 'http://') + 'localhost:' + port + route.basePath + route.path);
}

function displayRequestInformation(req, res) {
    console.log(
        colorCode.cyan,
        req.method,
        req.originalUrl,
        getColorCodeFromHttpStatusCode(res.statusCode.toString()),
        res.statusCode.toString(),
        colorCode.cyan,
        (res.responseTime.getTime() - req.requestTime.getTime()) + 'ms',
        colorCode.reset
    );
}

function getColorCodeFromHttpStatusCode(httpStatusCode) {
    let is2XXSeries = httpStatusCode.startsWith(2);
    let is3XXSeries = httpStatusCode.startsWith(3);
    let is4XXSeries = httpStatusCode.startsWith(4);
    let is5XXSeries = httpStatusCode.startsWith(5);
    if (is2XXSeries || is3XXSeries) {
        return colorCode.green;
    } else if (is4XXSeries) {
        return colorCode.yellow;
    } else if (is5XXSeries) {
        return colorCode.red;
    } else {
        return colorCode.yellow;
    }
}

export default {
    info,
    error,
    customRouteBasePathError,
    customRoutePathError,
    customRoutePathNotFoundError,
    customRouteMethodError,
    displayServerEndpoints,
    displayRequestInformation
}