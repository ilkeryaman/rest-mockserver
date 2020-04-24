import parameterType from '../../../../router/parameterType';
import definitionManager from '../../definition/definitionManager';
import resolver from '../../definition/resolver/definitionResolver_2.0';


function getReferenceObject(definitionFileName, ref) {
    let parts = ref.split('/');
    let definitionObjectName = parts[parts.length - 1];
    return definitionManager.getExtendedDefinitions()[definitionFileName][definitionObjectName];
}

function mergeParameters(definitionFileName, pathMethodObj) {
    let parameters = pathMethodObj["parameters"] ? pathMethodObj["parameters"] : [];
    if (pathMethodObj["parameters"] ) {
        for(let j = 0; j < pathMethodObj["parameters"].length; j++){
            let parameter = pathMethodObj["parameters"][j];
            if(parameter["in"] === parameterType.body){
                if(parameter["schema"] && parameter["schema"]["$ref"])
                {
                    let ref = parameter["schema"]["$ref"];
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
            }
        }
    }
    return parameters;
}

function retrieveBasePath(jsonObject) {
    return jsonObject["basePath"];
}

function organizePath(definitionFileName, jsonObject, pathsParamName, path, method) {
    let pathMethodObj = jsonObject[pathsParamName][path][method];
    let parameters = mergeParameters(definitionFileName, pathMethodObj);
    let responses = pathMethodObj["responses"];
    let responseArr = [];
    for (const response in responses) {
        if (response === "x-code-samples") {
            continue;
        }
        let responseObj = responses[response];
        let responseParam;
        if (responseObj["schema"]) {
            if (responseObj["schema"]["$ref"]) {
                responseParam = getReferenceObject(definitionFileName, responseObj["schema"]["$ref"]);
            } else {
                responseParam = resolver.resolveDefinition(responseObj["schema"], jsonObject);
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