
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
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours} ${minutes}`;
}

function open(application) {
}