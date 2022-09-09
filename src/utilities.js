const path = require('path');
const fs = require('fs');




function returnAllRecords(recordsPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(recordsPath, 'utf8', (error, data) => {
            if (error) {
                console.log(error);
            }
            resolve(data);
        });
    });
}



function writeToFile(filePath, content) {
    fs.writeFile(filePath, content, () => {
        if (err) {
            console.log(err);
        }
    });
}


function getPath(directoryName, toRemove, ...pathValues) {
    let fullPath = directoryName;
    if (toRemove) {
        fullPath = fullPath.replace(`${path.sep}${toRemove}`, '');
    }

    for (const val of pathValues) {
        fullPath = path.join(fullPath, val);
    }
    return fullPath;
}




module.exports = {
    getPath,
    writeToFile,
    returnAllRecords,
}