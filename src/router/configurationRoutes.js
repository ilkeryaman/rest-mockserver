import requestMethod from './requestMethod';
import responseManager from '../generator/responseManager';

const getConfigurations = {
    basePath: '/configurations',
    path: '',
    method: requestMethod.GET,
    isConfigurationRoute: true,
    function:
        (req, res, route) => {
            res.status(200).jsonp(responseManager.getPredefinedResponseConfigurations());
        }
}

const putConfiguration = {
    basePath: '/configurations',
    path: '',
    method: requestMethod.PUT,
    isConfigurationRoute: true,
    function:
        (req, res, route) => {
            let configs = req.body;
            if (!configs) {
                res.status(400).jsonp({
                    code: 'CON_401',
                    message: 'body is required to put configuration.'
                });
            } else {
                if (configs.some(config => !config.path)) {
                    res.status(400).jsonp({
                        code: 'CON_402',
                        message: 'path is required to put configuration.'
                    });
                } else if (configs.some(config => !config.method)) {
                    res.status(400).jsonp({
                        code: 'CON_403',
                        message: 'method is required to put configuration.'
                    });
                } else if (configs.some(config => !config.httpStatusCode)) {
                    res.status(400).jsonp({
                        code: 'CON_404',
                        message: 'httpStatusCode is required to put configuration.'
                    });
                } else if (configs.some(config => !config.responseData)) {
                    res.status(400).jsonp({
                        code: 'CON_405',
                        message: 'responseData is required to put configuration.'
                    });
                } else {
                    let newPredefinedResponseConfigurations =
                        responseManager.getPredefinedResponseConfigurations().filter(predefinedResponse =>
                            configs.some(config =>
                                predefinedResponse.path === config.path &&
                                predefinedResponse.method === config.method &&
                                (
                                    (config.paramValuePair && arraysAreSame(predefinedResponse.paramValuePair, config.paramValuePair)) ||
                                    !config.paramValuePair
                                )
                            ) === false
                        );

                    Array.prototype.push.apply(newPredefinedResponseConfigurations, configs);
                    responseManager.setPredefinedResponseConfigurations(newPredefinedResponseConfigurations);
                    res.sendStatus(200);
                }
            }

        }
}

const deleteConfiguration = {
    basePath: '/configurations',
    path: '',
    method: requestMethod.DELETE,
    isConfigurationRoute: true,
    function:
        (req, res, route) => {
            let configs = req.body;
            if (!configs) {
                res.status(400).jsonp({
                    code: 'CON_401',
                    message: 'body is required to delete configuration.'
                });
            } else {
                if (configs.some(config => !config.path)) {
                    res.status(400).jsonp({
                        code: 'CON_402',
                        message: 'path is required to delete configuration.'
                    });
                } else if (configs.some(config => !config.method)) {
                    res.status(400).jsonp({
                        code: 'CON_403',
                        message: 'method is required to delete configuration.'
                    });
                } else {
                    let newPredefinedResponseConfigurations =
                        responseManager.getPredefinedResponseConfigurations().filter(predefinedResponse =>
                            configs.some(config =>
                                predefinedResponse.path === config.path &&
                                predefinedResponse.method === config.method &&
                                (
                                    (config.paramValuePair && arraysAreSame(predefinedResponse.paramValuePair, config.paramValuePair)) ||
                                    !config.paramValuePair
                                )
                            ) === false
                        );
                    responseManager.setPredefinedResponseConfigurations(newPredefinedResponseConfigurations);
                    res.sendStatus(200);
                }
            }
        }
}

function arraysAreSame(x, y) {
    if (!x && !y) {
        return true;
    } else if ((!x && y) || (x && !y) || (Array.isArray(x) === false || Array.isArray(y) === false) || (x.length !== y.length)) {
        return false;
    } else {
        let arraysAreSame = true;
        
        for (let i = 0; i < x.length; i++) {
            if (objectsAreSame(x[i], y[i]) === false) {
                arraysAreSame = false;
                break;
            }
        }
        return arraysAreSame;
    }
}

function objectsAreSame(x, y) {
    var objectsAreSame = true;
    for (var propertyName in x) {
        if (x[propertyName] !== y[propertyName]) {
            objectsAreSame = false;
            break;
        }
    }
    return objectsAreSame;
}

const configurationRoutes = [
    getConfigurations,
    putConfiguration,
    deleteConfiguration
]

export default configurationRoutes;