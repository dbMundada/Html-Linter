var TOKEN = require('./tokens'),
    tokens = [],
    pos = 0,
    start = 0,
    input = '';

var lexer = {
    run: function (htmlString) {
        var lex = this;

        input = htmlString;
        lex.lexString();
        return tokens;
    },

    lexString: function () {
        var lex = this,
            len = input.length;

        while (pos < len) {
            var char = lex.next();
            switch (char) {
                case '<':
                    var peek1 = lex.peek(0);
                    console.log('Peek1: ', peek1);
                    if (peek1 === '!') {
                        if (lex.peek(1) === '-') {
                            if (lex.peek(2) === '-') {
                                console.log("Peek 3");
                                lex.lexComment();
                                console.log("Done with comment");
                            }
                        } else {
                            lex.lexTag();
                        }
                    } else if (peek1 === '/') {
                        console.log('Inside </');
                        lex.emit('OBRAC');
                        lex.next();
                        lex.emit('BACKSLASH');
                        lex.lexTag();
                    } else {
                        console.log('Inside <dbvj');
                        lex.emit('OBRAC');
                        lex.lexTag();
                    }
                    break;
                case '/':
                    lex.emit('BACKSLASH');
                    break;
                case '>':
                    lex.emit('CBRAC');
                    char = lex.next();
                    if (char.match(/([a-z]|[A-Z]|-| )/)) {
                        lex.lexText();
                    }
                    break;
                case ' ':
                    lex.emit('SPACE');
                    break;
                case '\n':
                    lex.emit('NEWLINE');
                    break;
                case '=':
                    lex.emit('EQUAL');
                    break;
                default:
                    if (char.match(/([a-z]|[A-Z]|-)/)) {
                        lex.lexAttrAndProp();
                    }
            }
        }
    },

    lexText: function () {
        var lex = this;
        console.log('Inside LEx Text');
        while (lex.next() !== '<');
        lex.back();
        lex.emit('TEXT');
    },

    lexTag: function () {
        var lex = this;
        console.log('Inside Lex Tag');
        while (lex.next().match(/([a-z]|[A-Z]|[0-9]|-)/));
        lex.back();
        lex.emit('TAG');
    },

    lexComment: function () {
        var lex = this;
        console.log("Inside COMMENT");
        while(1) {
            lex.next();
            if (lex.peek(0) === '-' && lex.peek(1) === '-' && lex.peek(2) === '>') {
                break;
            }
        }
        lex.next();lex.next();lex.next();
        lex.emit('COMMENT');
    },

    lexAttrAndProp: function () {
        var lex = this;
        while (lex.next() !== '=');
        lex.back();
        lex.emit('ATTR');
        lex.next();
        lex.emit('EQUAL');
        if (lex.next() === '"') {
            while (lex.next() !== '"');
            lex.emit('PROP');
        }
    },

    next: function () {
        if (pos > input.length) {
            return;
        }
        pos++;
        console.log("Next: ", pos);
        return input.charAt(pos - 1);
    },
    back: function () {
        pos--;
        console.log("Back: ", pos);
        return input.charAt(pos);
    },
    peek: function (n) {
        console.log("Peek: ", pos + n, "Char: ", input.charAt(pos + n));
        return input.charAt(pos + n);
    },
    emit: function (tokenType) {
        var tmp = start;
        start = pos;
        console.log('Start: ', tmp, " POS: ", pos, " value: ", input.substring(tmp, pos));
        if (tokenType === 'COMMENT') {
            tokens.push({ type: tokenType, value: input.substring(tmp+4, pos-3) });
        } else {
            tokens.push({ type: tokenType, value: input.substring(tmp, pos) });
        }
    }
};

module.exports = lexer;
