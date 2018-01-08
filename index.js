const _ = require('highland'),
  JSONStream = require('JSONStream'),
  fs = require('fs');

function modifier(stream) {
  return stream.map(data => addBody(data));
}

function addBody(data) {
  data.body = 'some body text';

  return data;
}

const readFile = _.wrapCallback(fs.readFile);

function getFiles() {
  return fs.readdirSync('./data').map(file => `./data/${file}`);
}

function getFilesData() {
  return _(getFiles())
    .map(_.wrapCallback(fs.readFile))
    .parallel(1)
    .tap(x => console.log('=>', x))
    .through(JSONStream.parse())
    .through(modifier)
    .tap(x => console.log('--->', x))
    .each(_.log);
}

getFilesData();
