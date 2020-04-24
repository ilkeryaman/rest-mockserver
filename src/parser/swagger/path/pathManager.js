import configuration from '../../../configuration';
import swaggerHelper from '../helper/swaggerHelper';
import openApiSpecificationFactory from '../factory/openApiSpecificationFactory';
import fileOperator from '../../../file/fileOperator';

let paths = {};
let pathsParamName = "paths";

function getPaths(){
    return paths;
}

function preparePaths(definitionFileName, jsonObject) {
    let pathArr = [];
    let swaggerVersion = swaggerHelper.getVersion(jsonObject);
    let pathOrganizer = openApiSpecificationFactory.getOrganizer(swaggerVersion);
    let basePath = pathOrganizer.retrieveBasePath(jsonObject);
    let pathList = jsonObject[pathsParamName];
    for (const path in pathList) {
        let pathObj = jsonObject[pathsParamName][path];
        for (const method in pathObj) {
            let organizedPath = pathOrganizer.organizePath(definitionFileName, jsonObject, pathsParamName, path, method);
            pathArr.push({
                ...organizedPath,
                basePath
            });
        }
    }
    return pathArr;
}

function addPaths(definitionFileName, jsonObject) {
    paths[definitionFileName] = preparePaths(definitionFileName, jsonObject);
    if (configuration.createPathsFile) {
        fileOperator.writeToFile("paths.json", paths);
    }
}

export default {
    addPaths,
    getPaths
};