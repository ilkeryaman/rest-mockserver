import configurationFilePaths from '../mocks/configurationFilePaths';
import stringParser from '../parser/stringParser';

let predefinedResponseConfigurations = [];

function getPredefinedResponseConfigurations() {
    return predefinedResponseConfigurations;
}

function getMockFileDirectory() {
    return '../mocks';
}

function fixFolderStructure(filePath) {
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

    let exactMatchedConfigurations =
        getPredefinedResponseConfigurations().filter(route => route.path === originalUrl && route.method === method);

    if (exactMatchedConfigurations && exactMatchedConfigurations.length > 0) {
        return exactMatchedConfigurations;
    } else {
        let matchedUrls =
            getPredefinedResponseConfigurations().filter(route => route.path === routePath && route.method === method);
        if (matchedUrls && matchedUrls.length > 0) {
            return matchedUrls;
        }
    }
    return null;
}

function getPredefinedResponse(req, route) {
    let predefinedResponses = getPredefinedConfiguration(req, route);
    if (predefinedResponses) {
        for (let indexOfPredefinedResponse = 0; indexOfPredefinedResponse < predefinedResponses.length; indexOfPredefinedResponse++) {
            let allValuesMatched = false;
            let predefinedResponse = predefinedResponses[indexOfPredefinedResponse];
            let paramValuePair = predefinedResponse["paramValuePair"];
            if (paramValuePair && Array.isArray(paramValuePair) && paramValuePair.length > 0) {
                for (let i = 0; i < paramValuePair.length; i++) {
                    let paramValue = paramValuePair[i];
                    let param = paramValue["param"];
                    let valueInConfig = paramValue["value"];
                    let valueInRequest = getParamValueFromRequest(req.body, param);
                    if (valueInRequest && valueInRequest == valueInConfig) {
                        if(i === paramValuePair.length - 1){
                            allValuesMatched = true;
                        }
                    } else {
                        break;
                    }
                }
                if(allValuesMatched){
                    return getResponseFromConfigFile(predefinedResponse);
                }
            } else {
                return getResponseFromConfigFile(predefinedResponse);
            }
        }
    }
    return null;
}

function getResponseFromConfigFile(predefinedResponse) {
    let responseFile = fixFolderStructure(predefinedResponse["file"]);
    if (responseFile) {
        return {
            httpStatusCode: predefinedResponse["httpStatusCode"],
            responseObject: require(getMockFileDirectory() + responseFile)
        }
    }
    return null;
}

function getParamValueFromRequest(body, param) {
    if (body && param) {
        let paramValueExists = false;
        let params = param.split('.');
        let currentParamValue = body;
        
        try {
            if (Array.isArray(body) && param[0].startsWith('[') === false) {
                return null;
            } else if (Array.isArray(body) === false && param[0].startsWith('[')) {
                return null;
            } else {
                let i = 0;
                if (Array.isArray(body) && params[0].startsWith('[')) {
                    let index = stringParser.getIndexFromString(params[0]);
                    currentParamValue = currentParamValue[index];
                    if(params.length === 1){
                        paramValueExists = true;
                    }
                    i++;
                }
                for (; i < params.length; i++) {
                    let currentParam = params[i];
                    if (currentParam.includes('[')) {
                        let parameterNameOfCurrentParam = stringParser.getParameterName(currentParam);
                        let indexValueOfCurrentParam = stringParser.getIndexFromString(currentParam);
                        currentParamValue = currentParamValue[parameterNameOfCurrentParam][indexValueOfCurrentParam];
                    } else {
                        currentParamValue = currentParamValue[currentParam];
                    }

                    if (i === params.length - 1) {
                        paramValueExists = true;
                    }
                }
                if (paramValueExists) {
                    return currentParamValue;
                }
            }
        } catch{ }
    }
    return null;
}



export default {
    preparePredefinedResponses,
    getPredefinedResponse
}