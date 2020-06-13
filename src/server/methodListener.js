import responseManager from '../generator/responseManager';
import parameterType from '../router/parameterType';
import responseGenerator from '../generator/responseGenerator';
import logger from '../log/logger';

function getFunction(req, res, route) {
  logger.info("Default [GET] function is executed.");
  operationDefault(req, res, route, 200);
}

function postFunction(req, res, route) {
  logger.info("Default [POST] function is executed.");
  operationDefault(req, res, route, 201);
}

function deleteFunction(req, res, route) {
  logger.info("Default [DELETE] function is executed.");
  operationDefault(req, res, route, 200);
}

function putFunction(req, res, route) {
  logger.info("Default [PUT] function is executed.");
  operationDefault(req, res, route, 202);
}

function patchFunction(req, res, route) {
  logger.info("Default [PATCH] function is executed.");
  operationDefault(req, res, route, 200);
}

function operationDefault(req, res, route, httpStatusCode) {
  let isValidRequest = validateRequiredParameters(route, req);
  if (isValidRequest === false) {
    returnHttpStatusWithCode(res, route, 400);
  }
  else {
    returnHttpStatusWithCode(res, route, httpStatusCode);
  }
}

function validateRequiredParameters(route, req) {
  let isValid = true;
  let parameters = route.parameters;
  if (parameters && Array.isArray(parameters) && parameters.length > 0) {
    for (let i = 0; i < parameters.length; i++) {
      if (parameters[i]["required"]) {
        if (!getParameterWithName(req, parameters[i]["in"], parameters[i]["name"])) {
          if (parameters[i]["in"] === parameterType.formData) {
            continue;
          }
          isValid = false;
          break;
        }
      }
    }
  }
  return isValid;
}

function getParameterWithName(req, paramType, parameterName) {
  let parameterValue;
  if (paramType === parameterType.header) {
    if (req.headers[parameterName]) {
      parameterValue = req.headers[parameterName];
    } else {
      parameterValue = req.headers[parameterName.toLowerCase()];
    }
  } else if (paramType === parameterType.query) {
    parameterValue = req.query[parameterName];
  } else if (paramType === parameterType.path) {
    parameterValue = req.params[parameterName]
  } else if (paramType === parameterType.body) {
    if (req.body) {
      if (parameterName === "body") {
        let firstParameterKey = Object.keys(req.body)[0];
        parameterValue = req.body[firstParameterKey];
      } else {
        parameterValue = req.body[parameterName];
      }
    }
  }
  return parameterValue;
}

function returnHttpStatusWithCode(res, route, statusCode) {
  if (route.responses) {
    let responseOfStatusCode = route.responses.find(response => response.code == statusCode);
    if (responseOfStatusCode) {
      if (responseOfStatusCode["responseParam"]) {
        let responseObj = responseGenerator.generate(responseOfStatusCode["responseParam"]);
        res.status(statusCode).jsonp(responseObj);
      } else if (responseOfStatusCode["description"]) {
        res.status(statusCode).send(responseOfStatusCode["description"]);
      } else {
        res.sendStatus(statusCode);
      }
    } else {
      res.sendStatus(statusCode);
    }
  } else {
    res.sendStatus(statusCode);
  }
}

function interceptorFunction(req, res, route, func) {
  try {
    req.requestTime = new Date();
    lookForPredefinedResponse(req, res, route, func);
    res.responseTime = new Date();
    logger.displayRequestInformation(req, res);
  } catch{
    res.sendStatus(500);
  }
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