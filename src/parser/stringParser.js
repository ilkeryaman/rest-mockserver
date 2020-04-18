function getIndexFromString(str){
    let indexOfLeftBracket = str.indexOf('[');
    let indexOfRightBracket = str.indexOf(']');
    return str.substring(indexOfLeftBracket + 1, indexOfRightBracket);
}

function getParameterName(str){
    if(str.includes('[')){
        let indexOfLeftBracket = str.indexOf('[');
        return str.substring(0, indexOfLeftBracket);
    } else {
        return str;
    }
}

export default {
    getIndexFromString,
    getParameterName
}