function replaceParameterName(path) {
    return path.replace(/\{/g, ':').replace(/\}/g, '');
}

// [GET]
function createGetMethod(server, route, func = getFunction){
    server.get(replaceParameterName(route.basePath + route.path), func);
}

// [POST]
function createPostMethod(server, route, func = postFunction){
    server.post(replaceParameterName(route.basePath + route.path), func);
}

// [DELETE]
function createDeleteMethod(server, route, func = deleteFunction){
    server.delete(replaceParameterName(route.basePath + route.path), func);
}

// [PUT]
function createPutMethod(server, route, func = putFunction){
    server.put(replaceParameterName(route.basePath + route.path), func);
}

// [PATCH]
function createPatchMethod(server, route, func = patchFunction){
    server.patch(replaceParameterName(route.basePath + route.path), func);
}

export default {
    createGetMethod,
    createPostMethod,
    createDeleteMethod,
    createPutMethod,
    createPatchMethod
};