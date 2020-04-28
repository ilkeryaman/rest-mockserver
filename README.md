# rest-mockserver

rest-mockserver is a project that allows you to mock any REST service with a predefined data or business.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

* Any cli to run required commands,
* Latest stable version of [Node.js](https://nodejs.org/en/).

### Installing

Run following command to install dependencies:

```sh
npm install
```

### Running on your local computer

Run following command to start up rest-mockserver on your local:

```sh
npm start
```
## Creating Endpoints from Swagger File

Mock server accepts json-formatted swagger files in specification of OpenAPI_2.0, OpenAPI_3.0.0 and OpenAPI 3.0.1.

Put swagger file to folder **swaggers**.

After restarting mock server, it will automatically open endpoints specified in swagger specification file.

Endpoints and method types (GET, POST, PUT, PATCH, DELETE etc.) will be shown as output like:
```sh
 JSON Server is running on:
 ============================ CONFIGURATION ROUTES ===========================
 [GET]          https://localhost:3000/configurations
 [PUT]          https://localhost:3000/configurations
 [DELETE]       https://localhost:3000/configurations

 =============================== DEFAULT ROUTES ==============================
 [POST]         https://localhost:3000/v2/pet/{petId}/uploadImage
 [POST]         https://localhost:3000/v2/pet
 [PUT]          https://localhost:3000/v2/pet
 [GET]          https://localhost:3000/v2/pet/findByStatus
 [GET]          https://localhost:3000/v2/pet/findByTags
 [GET]          https://localhost:3000/v2/pet/{petId}
 [POST]         https://localhost:3000/v2/pet/{petId}
 [DELETE]       https://localhost:3000/v2/pet/{petId}
 [POST]         https://localhost:3000/v2/store/order
 [GET]          https://localhost:3000/v2/store/order/{orderId}
 [DELETE]       https://localhost:3000/v2/store/order/{orderId}
 [GET]          https://localhost:3000/v2/store/inventory
 [POST]         https://localhost:3000/v2/user/createWithArray
 [POST]         https://localhost:3000/v2/user/createWithList
 [GET]          https://localhost:3000/v2/user/{username}
 [PUT]          https://localhost:3000/v2/user/{username}
 [DELETE]       https://localhost:3000/v2/user/{username}
 [GET]          https://localhost:3000/v2/user/login
 [GET]          https://localhost:3000/v2/user/logout
 [POST]         https://localhost:3000/v2/user

 =============================== CUSTOM ROUTES ===============================
 [GET]          https://localhost:3000/v1/address/search/{addressId}
 [POST]         https://localhost:3000/v1/address/create
 [POST]         https://localhost:3000/v1/exampleConfiguration/arrayInRequest
 [POST]         https://localhost:3000/v1/exampleConfiguration/objectInRequest
```

## Customizing Response

When mock server started without any new configuration, it will generate an automatic, random response which fits with response definition in swagger file.

There are two ways to customize behaviour of an endpoint:

**1) Returning Predefined Response**

Predefined responses can be configured for separate method calls.

For example, lets assume that you are querying the following GET method https://localhost:3000/v2/pet/{petId}, and you need to return some predefined json object defined in file1.json for petId equals 1234, and file2.json for petId equals 9876.

* First create a folder under **mocks** folder for your own mocking business.
* Place json file(s) that contains your predefined response(s) in your own mock folder.
* Then, go under **mocks/{your own mock folder}** and create a json file for your configuration with any name.
* Then you need to add the following configuration to newly created configuration file:
```json
{
    "/v2/pet/1234": {
        "get": {
            "httpStatusCode": 200,
            "file": "./petstore/file1.json"
        }
    },
    "/v2/pet/9876": {
        "get": {
            "httpStatusCode": 200,
            "file": "./petstore/file2.json"
        }
    },
    ...
}
```

In above; 

* **"get"** is the method type,
* **"httpStatusCode"** is the http status code to return at response,
* **"file"** is json file path that contains predefined json object to return at response body.
 

* Make sure that you put json files, that contains predefined responses, to given path defined at file parameter.

* After that, you need to import your newly created configuration file to configurationFilePaths.json file (**mocks/configurationFilePaths.json**).
```json
[
    "./exampleConfiguration/configuration.json",
    "./address/configuration.json",
    "./{your own mock folder}/{your own configuration file}",
    ...
]
```
**2) Creating Your Custom Business**

If you need a custom response or business, you can get specific result by adding your own custom route definition file (which must be a javascript file) under **src/router/customRoutes** folder.

A custom route definition file consists of one or more custom route(s). 

A custom route must be added with **basePath**, **path**, **method** and **function** information. Don't forget to add your custom route to **export** part which is at footer of same file.

Sample custom route file is below:
```js
import requestMethod from '../requestMethod';

const getAddress = {
    basePath: '/v1/address',
    path: '/search/{addressId}',
    method: requestMethod.GET,
    function:
        (req, res, route) => {
            res.status(200).jsonp(
                {
                    "code": "ADR_200",
                    "message": "Custom route response is returned.",
                    "data": {
                        "street": "Cumhuriyet Street",
                        "postCode": 34360,
                        "city": "Istanbul",
                        "country": "Turkey"
                    }
                });
        }
}
...

const addressRoutes = [
    getAddress,
    ...
];

export default addressRoutes;
```
According to the code above:

* A new API will be available with path http:/localhost:4000/v1/address/search/{addressId} if it does not already exist in a swagger specification file. If it already exists, the behavior of API will be changed by the function given as parameter.
* The API will be reachable for GET methods, and will return success message with specified body.

After completing developments on your custom route definition file, you have to import your file to **src/router/customRoutes.js** file as shown below:
```js
import addressRoutes from './customRoutes/addressRoutes';
import exampleConfigurationRoutes from './customRoutes/exampleConfigurationRoutes';

const customRoutes = [
    ...addressRoutes,
    ...exampleConfigurationRoutes
]

export default customRoutes;
```


## Authors

* **Ilker Yaman** - *Initial work* - [rest-mockserver](https://github.com/ilkeryaman/rest-mockserver)