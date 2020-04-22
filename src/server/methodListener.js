import responseManager from '../generator/responseManager';
import logger from '../log/logger';

function getFunction(req, res, route){
  logger.info("Default [GET] function is executed.");
  res.sendStatus(200);
}

function postFunction(req, res, route){
  logger.info("Default [POST] function is executed.");
  res.sendStatus(201);
}

function deleteFunction(req, res, route){
  logger.info("Default [DELETE] function is executed.");
  res.sendStatus(200);
}

function putFunction(req, res, route){
  logger.info("Default [PUT] function is executed.");
  res.sendStatus(202);
}

function patchFunction(req, res, route){
  logger.info("Default [PATCH] function is executed.");
  res.sendStatus(200);
}

function interceptorFunction(req, res, route, func){
  req.requestTime = new Date();
  lookForPredefinedResponse(req, res, route, func);
  res.responseTime = new Date();
  logger.displayRequestInformation(req, res);  
}

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
    function (req, res) { interceptorFunction(req, res, route, func) });
}

// [POST]
function createPostMethod(server, route, func = postFunction) {
  server.post(replaceParameterName(route.basePath + route.path),
    function (req, res) { interceptorFunction(req, res, route, func) });
}

// [DELETE]
function createDeleteMethod(server, route, func = deleteFunction) {
  server.delete(replaceParameterName(route.basePath + route.path),
    function (req, res) { interceptorFunction(req, res, route, func) });
}

// [PUT]
function createPutMethod(server, route, func = putFunction) {
  server.put(replaceParameterName(route.basePath + route.path),
    function (req, res) { interceptorFunction(req, res, route, func) });
}

// [PATCH]
function createPatchMethod(server, route, func = patchFunction) {
  server.patch(replaceParameterName(route.basePath + route.path),
    function (req, res) { interceptorFunction(req, res, route, func) });
}

export default {
  createGetMethod,
  createPostMethod,
  createDeleteMethod,
  createPutMethod,
  createPatchMethod
};