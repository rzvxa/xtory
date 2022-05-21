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
  return new Promise(function (resolve, reject) {
    fs.readdir(path, function (error, result) {
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

module.exports = { readdir, readdirRecursive };
