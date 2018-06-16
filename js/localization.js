var fileHandlerCallback = null;
$('document').ready(function () {
    $('#file').on('change', function()
    {
        handleFiles(this.files);
    });

    $('#load-csv').on('click', function () {
        importCsv();
    });

    var params = getJsonFromUrl();
    // if this page is opened by xtory, load data
    if(params['xtc']){
        var xtcData = localStorage[params['xtc']];
        loadTableFromXTC(xtcData);
        localStorage.removeItem(params['xtc']);
    }

});

function clearTable(){
    $('#localization-table').jexcel({
        contextMenu: tableContextMenu,
        csvHeaders: true,
        allowInsertRow: false,
        allowDeleteRow: false
    });
}

function tableContextMenu(type, place){
    var contextMenuContent = '';
    var table = 'jQuery('+ "'#" + $.fn.jexcel.current + "')";
    var addNewLanguage = '<a onclick="addNewLanguage()">Add a new language<span></span></a>';
    var mergeCsv = '<a onclick="mergeCsv()">Merge with CSV<span></span></a>';
    var importCsv = '<a onclick="importCsv()">Import CSV<span></span></a>';
    var saveAs = "<hr><a onclick=\"" + table + ".jexcel('download')\">Save as...<span>Ctrl + S</span></a><hr>";
    if (type === 'col') {
        contextMenuContent += "<a onclick=\"" + table + ".jexcel('orderBy', " + place + ", 0)\">Order ascending <span></span></a>";
        contextMenuContent += "<a onclick=\"" + table + ".jexcel('orderBy', " + place + ", 1)\">Order descending <span></span></a><hr>";
        if(place != 0)
            contextMenuContent += '<a onclick="renameLanguage('+place+')">Rename<span></span></a><hr>';
        if ($.fn.jexcel.defaults[$.fn.jexcel.current].allowInsertColumn == true) {
            contextMenuContent += addNewLanguage;
        }
        if ($.fn.jexcel.defaults[$.fn.jexcel.current].allowDeleteColumn == true) {
            contextMenuContent += "<a onclick=\"" + table + ".jexcel('deleteColumn'," + place + ")\">Delete this language<span></span></a>";
        }
        contextMenuContent += saveAs;
        contextMenuContent += mergeCsv;
        contextMenuContent += importCsv;

    } else if (type === 'row') {
        if ($.fn.jexcel.defaults[$.fn.jexcel.current].allowInsertColumn == true) {
            contextMenuContent += addNewLanguage;
        }
        if ($.fn.jexcel.defaults[$.fn.jexcel.current].allowInsertRow == true) {
            contextMenuContent += "<a onclick=\"" + table + ".jexcel('insertRow', 1, " + place+1 + ")\">Insert a new row<span></span></a><hr>";
        }
        if ($.fn.jexcel.defaults[$.fn.jexcel.current].allowDeleteRow == true) {
            contextMenuContent += "<a onclick=\"" + table + ".jexcel('deleteRow'," + place + ")\">Delete this row<span></span></a>";
        }
        contextMenuContent += saveAs;
        contextMenuContent += mergeCsv;
        contextMenuContent += importCsv;

    }
    return contextMenuContent;
}

function addNewLanguage(){
    var newLanguageName = prompt('What is the name of language?');
    var table = jQuery('#localization-table');
    var newLangPlace = table.jexcel('getHeaders').length;
    table.jexcel('insertColumn', 1, null, newLangPlace);
    if(newLanguageName === '')return;
    table.jexcel('setHeader',newLangPlace, newLanguageName);
}

function renameLanguage(place){
    if(!place) return;
    var table = jQuery('#localization-table');
    var priviusName = table.jexcel('getHeader', place);
    if(priviusName.startsWith('Primary')){
        priviusName = priviusName.slice('Primary'.length);
        if(priviusName.startsWith('(')) {
            priviusName = priviusName.slice(0, -1);
            priviusName = priviusName.slice(1);
        }
    }
    var newName = prompt("What is the new name of language?", priviusName);
    if(newName === null)return;
    if(place == 1)
        newName = 'Primary(' + newName + ')';
    table.jexcel('setHeader', place, newName);
}

function importCsv(){
    fileHandlerCallback = loadTableFromCSV;
    $('#file').click();
}

function mergeCsv(){
    fileHandlerCallback = mergeWithCsv;
    $('#file').click();
}

function getJsonFromUrl(hashBased) {
    var query;
    if(hashBased) {
        var pos = location.href.indexOf("?");
        if(pos==-1) return [];
        query = location.href.substr(pos+1);
    } else {
        query = location.search.substr(1);
    }
    var result = {};
    query.split("&").forEach(function(part) {
        if(!part) return;
        part = part.split("+").join(" "); // replace every + with space, regexp-free version
        var eq = part.indexOf("=");
        var key = eq>-1 ? part.substr(0,eq) : part;
        var val = eq>-1 ? decodeURIComponent(part.substr(eq+1)) : "";
        var from = key.indexOf("[");
        if(from==-1) result[decodeURIComponent(key)] = val;
        else {
            var to = key.indexOf("]",from);
            var index = decodeURIComponent(key.substring(from+1,to));
            key = decodeURIComponent(key.substring(0,from));
            if(!result[key]) result[key] = [];
            if(!index) result[key].push(val);
            else result[key][index] = val;
        }
    });
    return result;
}

function loadTableFromCSV(data){
    var table = $('#localization-table');
    data = table.jexcel('parseCSV', data);
    if(data[0][0] !== 'key') {
        alert('csv file is not valid!'); // maybe it's edited outside of this tool, anyway we can't load it because we relay heavily on keys for merging.
        return;
    }
    drawTable(data);
}

function loadTableFromXTC(data){
    data = JSON.parse(data);
    var result = [
        ['key', 'Primary'] // it's from XTC so we only have these headers, no additional languages.
    ];
    var map = new Map();
    var push = function (text) {
      map.set(md5(text), text);
    };
    var i;
    for(i = 0; i < data.length; i++){
        if(data[i].type == 'Text' || data[i].type == 'Choice')
            push(data[i].name);
    }
    var it = map.entries();
    var pair;
    while(!(pair = it.next()).done){
        result.push(pair.value)
    }
    drawTable(result);
}

function mergeWithCsv(data){
    var table = $('#localization-table');
    data = table.jexcel('parseCSV', data);
    if(data[0][0] !== 'key') {
        alert('csv file is not valid!'); // maybe it's edited outside of this tool, anyway we can't load it because we relay heavily on keys for merging.
        return;
    }
    var csvHeaders = data.shift(); // exclude headers from data and keep it separated for now
    var tableData = table.jexcel('getData');
    var i;
    var tMap = new Map();
    // first map the current table by keys.
    for(i = 0; i < tableData.length; i++){
        tMap.set(tableData[i][0], tableData[i][1]);
    }
    var cMap = new Map();
    var key;
    // now map the csv file by keys.
    for(i = 0; i < data.length; i++){
        var temp = data[i];
        key = temp.shift();
        cMap.set(key, temp);
    }
    var result = [];
    var it = tMap.entries();
    var pair;
    while(!(pair = it.next()).done){
        key = pair.value.shift();
        var cValue = cMap.get(key); // if the key is defined in csv use that value.
        if(typeof cValue === 'undefined') // otherwise just use the current data.
            cValue = pair.value;
        result.push([key].concat(cValue)); // push to the final result.
    }
    result.unshift(csvHeaders); // add headers back.
    drawTable(result);
}

function drawTable(data){
    clearTable(); // clear table so we start fresh.
    var table = $('#localization-table');
    // add headers first
    var properties = [];
    properties.columns = [];
    properties.colWidths = [];
    properties.colHeaders = [];
    var headersLen = data[0].length;
    // first create headers properties.
    for(var i = 0; i < headersLen; i++){
        properties.columns[i] = (!i? {type: 'text', readOnly:true } : {type:'text'});
        properties.colWidths[i] = (!i?70:250);
        properties.colHeaders[i] = data[0][i];
    }
    data.shift(); // remove headers from data we dont need it anymore
    // insert headers
    table.jexcel('insertColumn', headersLen, properties);
    table.jexcel('createTable'); // initialize the table from headers.
    // now set data
    table.jexcel('setData', data);
    $('#load-csv').hide();
}

function handleFiles(files){
    filename = files[0].name;
    var fileReader = new FileReader();
    var cb = fileHandlerCallback;
    fileReader.onload = function(e)
    {
        cb(e.target.result);
    };
    fileReader.readAsText(files[0]);
}
