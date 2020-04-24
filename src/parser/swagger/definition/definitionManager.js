import configuration from '../../../configuration';
import swaggerHelper from '../helper/swaggerHelper';
import openApiSpecificationFactory from '../factory/openApiSpecificationFactory';
import fileOperator from '../../../file/fileOperator';

let extendedDefinitions = {};

function getExtendedDefinitions() {
    return extendedDefinitions;
}

function extendDefinitions(definitionFileName, jsonObject) {
    extendedDefinitions[definitionFileName] = resolveDefinitions(jsonObject);
    if (configuration.createDefinitionsFile) {
        fileOperator.writeToFile("extendedDefinitions.json", extendedDefinitions);
    }
}

function resolveDefinitions(jsonObject) {
    let swaggerVersion = swaggerHelper.getVersion(jsonObject);
    let resolver = openApiSpecificationFactory.getResolver(swaggerVersion);
    return resolver.resolveDefinition(jsonObject);
}

export default {
    getExtendedDefinitions,
    extendDefinitions
};