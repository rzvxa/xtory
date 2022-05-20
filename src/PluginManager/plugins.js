const glob = require('glob');
var Plugins = {};
glob('./plugins/*.js', {cwd: __dirname}, function(err, files)
{
    files.forEach(function(file){
        var plugin = require(file);
        Plugins[plugin.name] = plugin;
    });
});
