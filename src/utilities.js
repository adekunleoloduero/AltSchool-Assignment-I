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
    fs.writeFile(filePath, content, (error) => {
        if (error) {
            console.log(error);
        }
    });
}


function getPath(directoryName, toDisjoin, toJoin) {
    let fullPath = directoryName;

    if (toDisjoin) {
        for (const val of toDisjoin) {
            fullPath = fullPath.replace(`${path.sep}${val}`, '');
        }
    }

    for (const val of toJoin) {
        fullPath = path.join(fullPath, val);
    }
    return fullPath;
}




module.exports = {
    getPath,
    writeToFile,
    returnAllRecords,
}