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

const createAddress = {
    basePath: '/v1/address',
    path: '/create',
    method: requestMethod.POST,
    function:
        (req, res, route) => {
            let body = req.body;

            if (!body.street) {
                res.status(400).jsonp({
                    code: 'ADR_401',
                    message: 'street is required to create address.'
                });
            } else if (!body.city) {
                res.status(400).jsonp({
                    code: 'ADR_402',
                    message: 'city is required to create address.'
                });
            } else if (!body.country) {
                res.status(400).jsonp({
                    code: 'ADR_403',
                    message: 'country is required to create address.'
                });
            } else {
                res.status(201).jsonp({
                    code: 'ADR_201',
                    message: 'Address is created successfully.'
                });
            }
        }
}

const addressRoutes = [
    getAddress,
    createAddress
];

export default addressRoutes;