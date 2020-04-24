function getVersion(jsonObject) {
    return jsonObject["openapi"] ? jsonObject["openapi"] : jsonObject["swagger"]
}

export default {
    getVersion
};