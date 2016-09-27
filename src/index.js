var lexer = require('./lib/lex');
var parser = require('./lib/parse');
    // buildDOM = parseHTML.parse(htmlString);

var fs = require('fs'),
    filename = './../test/test1.html',
    htmlString = '',
    result;

fs.readFile(filename, 'utf8', function(err, data) {
  if (err) {
      console.log(err);
  }
  console.log('OK: ' + filename);
  htmlString = data;
  console.log(htmlString);
  result = lexer.run(htmlString);
  console.log(result);
  console.log(parser.run(result));
});
