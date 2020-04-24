import openApiSpecification from './openApiSpecification';
import definitionResolver_2 from '../definition/resolver/definitionResolver_2.0';
import definitionResolver_3 from '../definition/resolver/definitionResolver_3.0';
import pathOrganizer_2 from '../path/organizer/pathOrganizer_2.0';
import pathOrganizer_3 from '../path/organizer/pathOrganizer_3.0';

function getOrganizer(swaggerVersion) {
    let pathOrganizer;
    switch (swaggerVersion) {
        case openApiSpecification.swagger_2_0:
            pathOrganizer = pathOrganizer_2;
            break;
        case openApiSpecification.swagger_3_0_0:
        case openApiSpecification.swagger_3_0_1:
            pathOrganizer = pathOrganizer_3;
            break;
        default:
            pathOrganizer = pathOrganizer_2;
            break;
    }
    return pathOrganizer;
}

function getResolver(swaggerVersion) {
    let resolver;
    switch (swaggerVersion) {
        case openApiSpecification.swagger_2_0:
            resolver = definitionResolver_2;
            break;
        case openApiSpecification.swagger_3_0_0:
        case openApiSpecification.swagger_3_0_1:
            resolver = definitionResolver_3;
            break;
        default:
            resolver = definitionResolver_2;
            break;
    }
    return resolver;
}

export default {
    getOrganizer,
    getResolver
};