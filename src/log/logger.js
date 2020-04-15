import requestMethod from '../router/requestMethod';

function info(msg) {
    let brightMagenta = '\u001b[35;1m';
    let reset = '\u001b[0m';
    console.log(brightMagenta, 'INFO: ' + msg, reset);
}

function error(msg, route) {
    let red = '\u001b[31m';
    let cyan = '\x1b[36m';
    let reset = '\u001b[0m';
    console.log(red, 'ERROR: ' + msg);
    if (route) {
        console.log(cyan, route);
    }
    console.log(reset, '');
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

function customRouteFunctionError(route) {
    displayError('All custom routes must have \'function\'. Please check custom route definitions in customRoutes.js file.', route);
}

function displayRouteInformation(routes, port, sslEnabled) {
    let yellow = '\x1b[33m';
    let cyan = '\x1b[36m';
    let reset = '\u001b[0m';
    console.log(cyan, 'JSON Server is running on:');
    console.log(cyan, '=============================== DEFAULT ROUTES ===============================')
    if (routes.some(route => !route.isCustomRoute)) {

        routes.filter(route => !route.isCustomRoute).reverse().forEach(route => {
            console.log(yellow,
                '[' + route.method.toUpperCase() + ']'
                + (route.method === requestMethod.DELETE || route.method === requestMethod.PATCH ? '\t' : '\t\t')
                + (sslEnabled ? 'https://' : 'http://') + 'localhost:' + port + route.basePath + route.path);
        });
    } else {
        console.log(cyan, 'No default route is defined.');
    }
    console.log('');

    console.log(cyan, '=============================== CUSTOM ROUTES ===============================')
    if (routes.some(route => route.isCustomRoute)) {
        routes.filter(route => route.isCustomRoute).reverse().forEach(route => {
            console.log(yellow,
                '[' + route.method.toUpperCase() + ']'
                + (route.method === requestMethod.DELETE || route.method === requestMethod.PATCH ? '\t' : '\t\t')
                + (sslEnabled ? 'https://' : 'http://') + 'localhost:' + port + route.basePath + route.path);
        });
    }
    else {
        console.log(cyan, 'No custom route is defined.');
    }
    console.log(reset, '');
}

export default {
    info,
    error,
    customRouteBasePathError,
    customRoutePathError,
    customRoutePathNotFoundError,
    customRouteMethodError,
    customRouteFunctionError,
    displayRouteInformation
}