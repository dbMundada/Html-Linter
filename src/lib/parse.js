var htmlNode = {
    "name": '',
    "attrAndProps": {},
    "lineNum": 0,
    "startPos": 0,
    "level": 0,
    "childNodes": [],
    "typeOfTag" : -1
};

var tokens = [],
    stackOfTokens = [];

var parser = {
    run: function (tokenArray) {
        var parse = this;
        tokens = tokenArray;

        while (tokens.length) {
            var token = parse.nextToken();
            switch (token.type) {
                case 'COMMENT':
                case 'SPACE':
                case 'OBRAC':
                    parse.parseTag();
                    break;
                case 'NEWLINE':
                case 'TEXT':
                default:

            }
        }
    },

    parseRecursively: function (level, lineNum) {
        var parse = this;

        switch (tokenType.type) {
            case 'COMMENT':
            case 'SPACE':
            case 'OBRAC':
                parse.parseTag();
                break;
            case 'NEWLINE':
            case 'TEXT':
            default:

        }
    },

    parseTag: function () {
        var parse = this;

    },

    buildCommentNode: function () {
        var parse = this;
    },

    buildTagNode: function () {
        var parse = this;
    },

    calculateStartSpaces: function () {
        for (var i = 0; i < tokens.length; i++) {
            if (parse.nextToken().type !== 'SPACE') {
                console.log('Start Spaces', i);
                return i;
            }
        }
        return -1;
    },

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
    },

};

module.exports = parser;
