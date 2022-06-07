var replace = require('replace-in-file');
const timeStamp = new Date().toISOString();
const options = {
    files: [
        'src/version.ts',
    ],
    from: /timeStamp: '(.*)'/g,
    to: "timeStamp: '" + timeStamp + "'",
    allowEmptyPaths: false,
};
try {
    let changedFiles = replace.sync(options);
    if (changedFiles == 0) {
        throw "Please make sure that the file '" + options.files + "' has \"timeStamp: ''\"";
    }
    console.log('Build timestamp is set to: ' + timeStamp);
} catch (error) {
    console.error('Error occurred:', error);
    throw error
}