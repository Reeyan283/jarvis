
module.exports = {
    parseString
}

function parseString(string) {
    if (!(/{.*}/.test(string))) {
        return string;
    }

    let regex = /{([^}]+)}/g;
    
    string = string.replace(regex, (_, match) => {
        let command = match.substring(0, match.indexOf("("));
        if (!(command in functionMap)) {
            return "";
        }

        let args = match.substring(match.indexOf("(") + 1, match.indexOf(")")).split(",");
        console.log(args);
        return functionMap[command](...args);
    });

    return string;
}

/* Commands */

const functionMap = {
    getTime,
    open
}

function getTime() {
    let date = new Date();
    return date.toLocaleTimeString();
}

function open(application) {
}