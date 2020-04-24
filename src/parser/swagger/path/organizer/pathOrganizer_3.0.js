import definitionManager from '../../definition/definitionManager';
import resolver from '../../definition/resolver/definitionResolver_3.0';

function getReferenceObject(definitionFileName, ref) {
    let parts = ref.split('/');
    let definitionObjectName = parts[parts.length - 1];
    return definitionManager.getExtendedDefinitions()[definitionFileName][definitionObjectName];
}

function mergeParameters(definitionFileName, pathMethodObj) {
    let parameters = pathMethodObj["parameters"] ? pathMethodObj["parameters"] : [];
    if (pathMethodObj["requestBody"] && pathMethodObj["requestBody"]["content"]
        && pathMethodObj["requestBody"]["content"]["application/json"]
        && pathMethodObj["requestBody"]["content"]["application/json"]["schema"]
        && pathMethodObj["requestBody"]["content"]["application/json"]["schema"]["$ref"]) {
            
        let ref = pathMethodObj["requestBody"]["content"]["application/json"]["schema"]["$ref"];
        let referenceObject = getReferenceObject(definitionFileName, ref);
        let requiredParams = referenceObject["required"];
        if (requiredParams) {
            for (let i = 0; i < requiredParams.length; i++) {
                parameters.push({
                    "name": requiredParams[i],
                    "in": "body",
                    "required": true
                })
            }
        }
    }
    return parameters;
}

function retrieveBasePath(jsonObject) {
    let url = jsonObject["servers"][0]["url"].replace('//', '');
    let parts = url.split('/');
    parts.splice(0, 1);
    return '/' + parts.join('/');
}

function organizePath(definitionFileName, jsonObject, pathsParamName, path, method) {
    let pathMethodObj = jsonObject[pathsParamName][path][method];
    let parameters = mergeParameters(definitionFileName, pathMethodObj);
    let responses = pathMethodObj["responses"];
    let responseArr = [];
    for (const response in responses) {
        let responseObj = responses[response];
        let responseParam;
        if (responseObj["content"] && responseObj["content"]["application/json"] && responseObj["content"]["application/json"]["schema"]) {
            let schemaObj = responseObj["content"]["application/json"]["schema"];
            if (schemaObj["$ref"]) {
                responseParam = getReferenceObject(definitionFileName, schemaObj["$ref"]);
            } else {
                responseParam = resolver.resolveDefinition(schemaObj, jsonObject);
            }
        }

        responseArr.push({
            ...responseObj,
            code: response,
            responseParam: responseParam
        });
    }

    return {
        path,
        method,
        parameters,
        responses: responseArr
    };
}

export default {
    retrieveBasePath,
    organizePath
};