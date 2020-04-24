import definitionObjectType from '../parser/swagger/definition/definitionObjectType';
import definitionObjectFormat from '../parser/swagger/definition/definitionObjectFormat';
import regExGenerator from './regExGenerator';

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateInteger() {
    const min = 1, max = 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNumber() {
    return Math.random().toFixed(2);
}

function getDateTime() {
    return new Date().toISOString();
}

function getDate() {
    return getDateTime().split("T")[0];
}

function generateString(prop, format, pattern) {
    let generatedString;

    if (format) {
        switch (format) {
            case definitionObjectFormat.dateTime:
            case definitionObjectFormat.dateTime2:
                generatedString = getDateTime();
                break;
            case definitionObjectFormat.date:
                generatedString = getDate();
                break;
            case definitionObjectFormat.binary:
                generatedString = generateBinary(prop);
                break;
            case definitionObjectFormat.byte:
                generatedString = generateBase64(prop);
                break;
            case definitionObjectFormat.password:
                generatedString = generatePassword(prop);
                break;
        }
    } else if(pattern){
        generatedString = regExGenerator.generate(pattern);
    } else if (prop && (prop.toLowerCase().endsWith("date") || prop.toLowerCase().endsWith("datetime"))) {
        generatedString = prop.toLowerCase().endsWith("date") ? getDate() : getDateTime();
    } else if (prop && (prop === "id" || prop.endsWith("Id"))) {
        generatedString = uuidv4();
    } else {
        let arr = [
            'Lorem ipsum dolor sit amet',
            'Donec finibus dapibus lacus in molestie',
            'Proin sagittis erat nec dignissim dictum',
            'Aliquam pretium nibh eros',
            'In viverra turpis eget gravida vulputate'
        ];
        generatedString = arr[Math.floor(Math.random() * arr.length)];
    }
    return generatedString;
}

function generateBoolean() {
    return Math.random() > 0.5;
}

function generatePassword(prop) {
    return prop ? prop.replace(/./g, '*') : '******';
}

function generateArray(prop) {
    let arr = [];
    let generatedObj = generate(prop["items"]);
    let generatedObj2 = generate(prop["items"]);
    arr.push(generatedObj);
    arr.push(generatedObj2);
    return arr;
}

function generateBinary(prop) {
    let text = generateString(prop).split(" ")[0];
    return text.split('').map(function (char) {
        return char.charCodeAt(0).toString(2);
    }).join(' ');
}

function generateBase64(prop) {
    let text = generateString(prop);
    var buff = Buffer.from(text);
    return buff.toString('base64');
}

function generateIfAllOf(jsonObject, generatedObj, prop) {
    let obj = prop ? jsonObject[prop] : jsonObject;
    if (obj["allOf"]) {
        let allOfObj = {};
        for (let i = 0; i < obj["allOf"].length; i++) {
            let newObj = generate(obj["allOf"][i]);
            allOfObj = {
                ...allOfObj,
                ...newObj
            }
        }
        if (prop) {
            generatedObj[prop] = allOfObj;
            return generatedObj[prop];
        } else {
            generatedObj = allOfObj;
            return generatedObj;
        }
    }
}

function generateByType(obj, generatedObj, prop){
    switch (obj["type"]) {
        case definitionObjectType.string:
            generatedObj = generateString(prop, obj["format"], obj["pattern"]);
            break;
        case definitionObjectType.integer:
            generatedObj = generateInteger();
            break;
        case definitionObjectType.number:
            generatedObj = generateNumber();
            break;
        case definitionObjectType.boolean:
            generatedObj = generateBoolean();
            break;
        case definitionObjectType.object:
            generatedObj = generate(obj);
            break;
        case definitionObjectType.array:
            generatedObj = generateArray(obj);
            break;
    }
    return generatedObj;
}

function generate(jsonObject) {
    let generatedObj = {};
    if (jsonObject["type"] === definitionObjectType.object) {
        jsonObject = jsonObject["properties"];
        for (const prop in jsonObject) {
            if (jsonObject[prop]["type"]) {
                generatedObj[prop] = generateByType(jsonObject[prop], generatedObj[prop], prop);
            } else {
                generatedObj[prop] = generateIfAllOf(jsonObject, generatedObj, prop);
            }
        }
    } else if(jsonObject["type"] ){
        generatedObj = generateByType(jsonObject, generatedObj);
    } 
    else if (!jsonObject["type"]) {
        generatedObj = generateIfAllOf(jsonObject, generatedObj);
    }
    return generatedObj;
}

export default {
    generate
};