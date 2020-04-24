import jsonHelper from '../../helper/jsonHelper';
import definitionObjectType from '../definitionObjectType';

function getReferenceObject(ref, originalJson) {
    let parts = ref.split('/');
    let referenceObj = originalJson;
    for (let i = 1; i < parts.length; i++) {
        referenceObj = referenceObj[parts[i]];
    }
    return { ...referenceObj };
}

function resolve(definitionObj, originalJson) {
    let definitionsObjType = definitionObj["type"];
    let definitionsObjAllOf = definitionObj["allOf"];
    if (definitionsObjType) {
        if (definitionsObjType === definitionObjectType.object) {
            let definitionsObjProperties = definitionObj["properties"];
            if (definitionsObjProperties) {
                for (const definitionObjProperty in definitionsObjProperties) {
                    let ref = definitionsObjProperties[definitionObjProperty]["$ref"];
                    if (ref) {
                        definitionsObjProperties[definitionObjProperty] = getReferenceObject(ref, originalJson);
                    }
                    resolve(definitionsObjProperties[definitionObjProperty], originalJson);
                }
            }
        } else if (definitionsObjType === definitionObjectType.array) {

            let definitionsObjItems = definitionObj["items"];
            let ref = definitionsObjItems["$ref"];
            if (ref) {
                definitionObj["items"] = getReferenceObject(ref, originalJson);
            }
            resolve(definitionObj["items"], originalJson);

        }
    } else if (definitionsObjAllOf) {
        for (let i = 0; i < definitionsObjAllOf.length; i++) {
            if (definitionsObjAllOf[i]["$ref"]) {
                definitionsObjAllOf[i] = getReferenceObject(definitionsObjAllOf[i]["$ref"], originalJson);
            }
        }
        resolve(definitionsObjAllOf, originalJson);
    }
    else if (Array.isArray(definitionObj)) {
        definitionObj.forEach(elm => { resolve(elm, originalJson) });
    }
}

function resolveDefinition(jsonObject, dbObject) {
    let originalJson = dbObject ? dbObject : jsonHelper.cloneJson(jsonObject);
    let definitions;
    if (jsonObject["components"]) {
        definitions = jsonObject["components"]["schemas"];
        for (const definition in definitions) {
            let definitionObj = definitions[definition];
            resolve(definitionObj, originalJson);
        }
    } else {
        resolve(jsonObject, originalJson);
        definitions = jsonObject;
    }
    return definitions;
}

export default {
    resolveDefinition
};