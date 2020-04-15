import requestMethod from '../requestMethod';

const getAddress = {
    basePath: '/v1/address',
    path: '/search/{addressId}',
    method: requestMethod.GET,
    function:
        (req, res, route) => {
            res.status(200).jsonp({});
        }
}

const addressRoutes = [
    getAddress
];

export default addressRoutes;