import responseManager from '../generator/responseManager';


function lookForPredefinedResponse(req, res, route, func) {
  let predefinedResponse = responseManager.getPredefinedResponse(req, route);

  if (predefinedResponse) {
    res.status(predefinedResponse["httpStatusCode"]).jsonp(predefinedResponse["responseObject"]);
  } else {
    func(req, res, route);
  }
}

function replaceParameterName(path) {
  return path.replace(/\{/g, ':').replace(/\}/g, '');
}

// [GET]
function createGetMethod(server, route, func = getFunction) {
  server.get(replaceParameterName(route.basePath + route.path),
    function (req, res) { lookForPredefinedResponse(req, res, route, func) });
}

// [POST]
function createPostMethod(server, route, func = postFunction) {
  server.post(replaceParameterName(route.basePath + route.path),
    function (req, res) { lookForPredefinedResponse(req, res, route, func) });
}

// [DELETE]
function createDeleteMethod(server, route, func = deleteFunction) {
  server.delete(replaceParameterName(route.basePath + route.path),
    function (req, res) { lookForPredefinedResponse(req, res, route, func) });
}

// [PUT]
function createPutMethod(server, route, func = putFunction) {
  server.put(replaceParameterName(route.basePath + route.path),
    function (req, res) { lookForPredefinedResponse(req, res, route, func) });
}

// [PATCH]
function createPatchMethod(server, route, func = patchFunction) {
  server.patch(replaceParameterName(route.basePath + route.path),
    function (req, res) { lookForPredefinedResponse(req, res, route, func) });
}

export default {
  createGetMethod,
  createPostMethod,
  createDeleteMethod,
  createPutMethod,
  createPatchMethod
};