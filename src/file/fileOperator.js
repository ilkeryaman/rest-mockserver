import fs from 'fs';

function getOutputDirectoryPath(){
    return 'output';
}

function writeToFile(fileName, jsonObj) {
    let filePath = getOutputDirectoryPath() + "/" + fileName;
    if (!fs.existsSync(getOutputDirectoryPath())){
        fs.mkdirSync(getOutputDirectoryPath());
    }
    fs.writeFile(filePath, JSON.stringify(jsonObj), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function readSwaggerFileContent(fileName){
    let content = fs.readFileSync(getSwaggerDirectoryPath() + '/' + fileName);
    return JSON.parse(content);
}

function readSwaggerDirectory(){
    return readDirectory(getSwaggerDirectoryPath());
}

function readDirectory(directory){
    return fs.readdirSync(directory);
}

function getSwaggerDirectoryPath(){
    return 'swaggers';
}

export default {
    writeToFile,
    readSwaggerDirectory,
    readSwaggerFileContent
};