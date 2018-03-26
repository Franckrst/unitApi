'use strict';

module.exports = class Capture {

    constructor(){
        this.captured = {};
    }

    parse (options,response) {
        for(let i = 0; i < options.length; i++){
            const parseString = options[i].json.split('.');
            this.captured[options[i].as] = this.getValue(response, parseString);
        }
    }

    injectObj (obj) {
        for (let property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] === "object") {
                    obj[property]= this.injectObj(obj[property]);
                }
                else {
                    obj[property] = this.inject(obj[property]);
                }
            }
        }
        return obj;
    }

    inject (str) {
        if(typeof str !== 'string'){return str;}
        let keys = Object.keys(this.captured);
        for(let i = 0; i < keys.length; i++) {
            str = str.replace(new RegExp(`\\\${${keys[i]}}`, 'g'),this.captured[keys[i]]);
        }
        return str;
    }

    getValue(json, parseString, index = 0) {
        if(typeof json !== 'object') {
            return json;
        }
        if(parseString.length < index) {
            throw `Capture ${parseString.join('.')} is impossible`;
        }
        const newIndex = index + 1;
        return this.getValue(json[parseString[index]],parseString,newIndex);
    }
};
