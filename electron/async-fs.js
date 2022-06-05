const fs = require('fs');

function normalizePath(path) {
    path = path.replaceAll('\\', '/');
    // remove trailing / if there is one
    if (path.charAt(path.length - 1) === '/') {
        path = path.slice(0, -1);
    }
    return path;
}

function stat(path) {
    return new Promise(function (resolve, reject) {
        fs.stat(path, function (error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

function readdir(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
  });
}

async function readdirRecursive(path) {
    const content = await readdir(path);
    const result = {};
    path = normalizePath(path);
    for (let res of content) {
        const childPath = `${path}/${res}`;
        const isDir = (await stat(childPath)).isDirectory();
        if (isDir) {
            result[res] = await readdirRecursive(childPath);
        } else {
            result[res] = null;
        }
    }
    return result;
}

function readFile(path, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

function writeFile(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (error, result) => {
          if (error) {
              reject(error);
          } else {
              resolve(result);
          }
        });
    });
}

module.exports = { readdir, readdirRecursive, readFile, writeFile };
