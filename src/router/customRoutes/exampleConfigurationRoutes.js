import requestMethod from '../requestMethod';

const arrayInRequest = {
    basePath: '/v1/exampleConfiguration',
    path: '/arrayInRequest',
    method: requestMethod.POST
}

const objectInRequest = {
    basePath: '/v1/exampleConfiguration',
    path: '/objectInRequest',
    method: requestMethod.POST
}

const exampleConfigurationRoutes = [
    arrayInRequest,
    objectInRequest
];

export default exampleConfigurationRoutes;