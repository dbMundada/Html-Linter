var htmlNode = {
    "name": '',
    "lineNum": 0,
    "startSpaces": 0,
    "level": 0,
    "childNodes": [],
    "typeOfTag" : -1
};

const LINTFACT = 4;

var typeOfTag = {
    'OPEN': 0,
    'CLOSE': 1,
    'SELF-CLOSING': 2,
    'COMMENT': 3
};

var parseHTML = {
    parse:  function (htmlString) {
        var oThis = this,
            lines = htmlString.split(/\r?\n/);

        return oThis.parseRecursively(lines, 1, 0);
    },

    parseRecursively: function (htmlString, lineNum, level) {
        var oThis = this,
            node = htmlString.length > 0 ? oThis.parseLine(htmlString[0], lineNum, level) : null;

        if (node.typeOfTag === typeOfTag.OPEN) {
            // Add this node to Stack by increasing level
            // Also decide whether this is sibling or child node of current Node
            node.childNode.push(oThis.parseRecursively(htmlString.slice(1), lineNum++, level++));
        } else if (node.typeOfTag === typeOfTag.CLOSE) {
            // IF Matches with top node in stack then remove else throw error
        } else if (node.typeOfTag === typeOfTag.SELF-CLOSING) {
            //  Add this as childNode to its parent Node
        } else {
            // This node will be the comment and added in comment DOM
        }

        return node;
    }

    parseLine: function (htmlString, lineNum, level) {
        var oThis = this,
            spaces = oThis.calculateStartSpaces(htmlString) || 0,
            remString = htmlString.trim();

        if (remString === '') {
            return null;
        }
        console.log(oThis.getTypeOfTag(remString));
        if (spaces !== (level * LINTFACT)) {
            console.log("Error: at line Number ", lineNum, " expected spaces: ", (level * LINTFACT), " found: ", spaces);
        }

        return  {
            "name": remString.split(' ')[0],
            "lineNum": lineNum,
            "startSpaces": spaces,
            "level": level,
            "childNodes": [],
            "typeOfTag" : oThis.getTypeOfTag(remString) || -1
        }
    },

    calculateStartSpaces: function (htmlString) {
        for (var i = 0; i < htmlString.length; i++) {
            if (htmlString.charAt(i) !== ' ') {
                console.log(i);
                return i;
            }
        }
        return -1;
    },

    getTypeOfTag: function (htmlString) {
        var oThis = this,
            prevChar = '',
            tagType = -1;

        for (var i = 0; i < htmlString.length; i++ ) {
            switch (htmlString.charAt(i)) {
                case '<':
                    prevChar = '<';
                    break;
                case '/':
                    if (prevChar === '<') {
                        tagType = typeOfTag.CLOSE;
                    } else {
                        prevChar = '/';
                    }
                    break;
                case '>':
                    if (prevChar === '/') {
                        tagType = typeOfTag.SELF-CLOSING;
                    } else {
                        tagType = typeOfTag.OPEN;
                    }
                    break;
                default:
            }
        }

        return tagType;
    }
};
