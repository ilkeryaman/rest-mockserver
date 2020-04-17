import configurationFilePaths from '../mocks/configurationFilePaths';

let predefinedResponseConfigurations = [];

function getPredefinedResponseConfigurations() {
    return predefinedResponseConfigurations;
}

function getMockFileDirectory() {
    return '../mocks';
}

function fixFolderStructure(filePath){
    if (filePath.startsWith('.')) {
        return filePath.slice(1, filePath.size);
    }
    return filePath;
}

function preparePredefinedResponses() {
    for (let i = 0; i < configurationFilePaths.length; i++) {
        let filePath = fixFolderStructure(configurationFilePaths[i]);
        let responseConfiguration = require(getMockFileDirectory() + filePath);
        Array.prototype.push.apply(predefinedResponseConfigurations, responseConfiguration);
    }
}

function getPredefinedConfiguration(req, route) {
    let method = req["method"].toLowerCase();
    let originalUrl = req["url"];
    let routePath = route.basePath + route.path;

    let exactMatchedConfiguration =
        getPredefinedResponseConfigurations().find(route => route.path === originalUrl && route.method === method);

    if (exactMatchedConfiguration) {
        return exactMatchedConfiguration;
    } else {
        let exactMatchedUrl =
            getPredefinedResponseConfigurations().find(route => route.path === routePath && route.method === method);
        if (exactMatchedUrl) {
            return exactMatchedUrl;
        }
    }
    return null;
}

function getPredefinedResponse(req, route) {
    let predefinedResponse = getPredefinedConfiguration(req, route);
    if (predefinedResponse) {
        let responseFile = fixFolderStructure(predefinedResponse["file"]);
        if (responseFile) {
            return {
                httpStatusCode: predefinedResponse["httpStatusCode"],
                responseObject: require(getMockFileDirectory() + responseFile)
            }
        }
    }
    return null;
}

export default {
    preparePredefinedResponses,
    getPredefinedResponse
}