import RandExp from 'randexp';

function generate(regExStr) {
    try {
        return new RandExp(eval(regExStr)).gen();
    } catch{
        return regExStr;
    }
}

export default {
    generate
};