var htmlNode = {
    "name": '',
    "attrAndProps": [],
    "lineNum": 0,
    "startPos": 0,
    "level": 0,
    "childNodes": [],
    "typeOfTag" : -1,
    "text": ''
};

var commentNode = [{
    "text": '',
    "lineNum": '',
    "startPos": ''
}];


var tokens = [],
    commentNodes = [],
    tagNodes = [],
    stackOfTokens = [];

var parser = {
    run: function (tokenArray) {
        var parse = this;
        tokens = tokenArray;

        while (tokens.length) {
            var token = parse.nextToken(),
                pos = token.pos;
            switch (token.type) {
                case 'COMMENT':
                    parse.buildCommentNode(token);
                    break;
                case 'OBRAC':
                    console.log("Inside Obrac");
                    token = parse.nextToken();
                    if (token.type === 'BACKSLASH') {
                        token = parse.nextToken();
                        tagNodes.push(parse.parseTag(1, pos, token.lineNum, token.value, 'CLOSING'));
                    } else {
                        tagNodes.push(parse.parseTag(1, pos, token.lineNum, token.value, 'OPENING'));
                    }
                    break;
                // case 'TEXT':
                //     parse.
                default:
                    if (token.type === 'NEWLINE' || token.type === 'SPACE') {
                        break;
                    } else {
                        console.log('Error in parsing at line number: ', token.lineNum, ' ColNumber: ', token.pos);
                        break;
                    }
            }
        }
        return [commentNodes, tagNodes];
    },

    parseTag: function (level, startPos, lineNum, value, type) {
        var parse = this,
            tokenType = {},
            pos = startPos,
            name = value,
            level = level,
            lineNum = lineNum,
            attrAndProps = [],
            text = '',
            type = type;

        console.log("Inside parse TAG");
        while (tokens.length) {
            tokenType = parse.nextToken();
            switch (tokenType.type) {
                case 'ATTR':
                    attrAndProps = parse.getAttrAndProp(tokenType);
                    console.log(attrAndProps);
                    break;
                case 'TEXT':
                    text = tokenType.value;
                    break;
                case 'BACKSLASH':
                    if (parse.peekToken().type === 'CBRAC') {
                        tokenType = parse.nextToken();
                        return {
                            "name": name,
                            "attrAndProps": attrAndProps,
                            "lineNum": lineNum,
                            "startPos": pos,
                            "level": level,
                            "childNodes": [],
                            "typeOfTag" : 'SELF-CLOSING',
                            "text": text
                        };
                    } else {
                        console.log('Error in parsing at line number: ', token.lineNum, ' ColNumber: ', token.pos);
                        break;
                    }
                case 'CBRAC':
                    console.log("Inside closing bracket");
                    return {
                        "name": name,
                        "attrAndProps": attrAndProps,
                        "lineNum": lineNum,
                        "startPos": pos,
                        "level": level,
                        "childNodes": [],
                        "typeOfTag" : type,
                        "text": text
                    };
                default:
                    if (tokenType.type === 'NEWLINE' || tokenType.type === 'SPACE') {
                        break;
                    } else {
                        console.log('Error in parsing at line number: ', tokenType.lineNum, ' ColNumber: ', tokenType.pos);
                        break;
                    }
            }
        }
    },

    getAttrAndProp: function (token) {
        var parse = this,
            attrAndProps =[],
            tokenType = token;
        while (true) {
            var attr = '',
                prop = '';
            if (tokenType.type === 'ATTR') {
                attr = tokenType.value;
                tokenType = parse.nextToken();
                if (tokenType.type === 'EQUAL') {
                    tokenType = parse.nextToken();
                    if (tokenType.type === 'PROP') {
                        prop = tokenType.value;
                        attrAndProps.push({
                            "prop": prop,
                            "attr": attr
                        });
                    }
                }
            } else if (tokenType.type === 'BACKSLASH') {
                var cbracToken = parse.peekToken();
                if (cbracToken.type === 'CBRAC') {
                    parse.recoverToken(tokenType);
                    return attrAndProps;
                }
            } else if (tokenType.type === 'CBRAC') {
                parse.recoverToken(tokenType);
                return attrAndProps;
            } else if (tokenType.type === 'SPACE') {
                console.log('Inside SPACE');
            } else {
                console.log('Error in parsing at line number: ', tokenType.lineNum, ' ColNumber: ', tokenType.pos);
                return [];
            }
            tokenType = parse.nextToken();
        }
    },

    buildCommentNode: function (token) {
        var parse = this;
        commentNodes.push({
            "text": token.value,
            "lineNum": token.lineNum,
            "startPos": token.pos
        });
    },



    // parseRecursively: function (level, lineNum) {
    //     var parse = this;
    //
    //     switch (tokenType.type) {
    //         case 'COMMENT':
    //             parse.buildCommentNode(token, level);
    //             break;
    //         case 'SPACE':
    //             parse.nextToken();
    //             break;
    //         case 'OBRAC':
    //             parse.parseTag(startPos, tokenType.lineNum);
    //             break;
    //         case 'NEWLINE':
    //             parse.nextToken();
    //             break;
    //         case 'TEXT':
    //         default:
    //             console.log('Error in parsing at line number: ', tokenType.lineNum, ' ColNumber: ', tokenType.pos);
    //             break;
    //     }
    // },
    //
    // buildTagNode: function (level, startPos, lineNum, attrAndProps) {
    //     var parse = this;
    //
    //     tokens.push({
    //         "name": '',
    //         "attrAndProps": [],
    //         "lineNum": 0,
    //         "startPos": 0,
    //         "level": 0,
    //         "childNodes": [],
    //         "typeOfTag" : -1,
    //         "text": ''
    //     });
    // },

    recoverToken: function (token) {
        tokens.unshift(token);
    },

    nextToken: function () {
        return tokens.shift();
    },

    peekToken: function () {
        return tokens[0];
    },

    peekNthToken: function (n) {
        return tokens[n-1];
    }
};

module.exports = parser;
