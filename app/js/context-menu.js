document.addEventListener('click', contextMenuHideMenu);
document.addEventListener('contextmenu', contextMenuRightClick);
document.addEventListener('keyup', contextMenuKeyupListener);

var contextMenuNumberOfItems = undefined;
var contextMenuLastItemSelected = 0;

function setContextMenuItems(items) {
    var table, i, builder, tr, text, action;
    contextMenuNumberOfItems = items.length;
    table = document.getElementById('contextMenu').getElementsByTagName('table')[0];
    table.innerHTML = '';
    builder = '';
    for (i = 0; i < items.length; ++i) {
        text = items[i].text;
        builder += `<tr><td>${text}</td></tr>`;
    }
    table.innerHTML = builder;
    tr = table.getElementsByTagName('tr');
    for (i = 0; i < tr.length; ++i) {
        action = items[i].action;
        let ii = i;
        tr[i].addEventListener('mouseover', function(e) {
            setContextMenuSelected(ii);
        });
        tr[i].onclick = action;
    }
}

function setContextMenuSelected(i) {
    var table, tr, item;
    table = document.getElementById('contextMenu').getElementsByTagName('table')[0];
    tr = table.getElementsByTagName('tr');
    item = tr[contextMenuLastItemSelected];
    item.classList.remove('selected');
    item = tr[i];
    if (item.style['display'] === 'none') {
        for (i = 0; i < contextMenuNumberOfItems; ++i) {
            if (tr[i].style['display'] !== 'none') {
                item = tr[i];
                break;
            }
                
        }
    }
    if (item.style['display'] !== 'none') {
        item.classList.add('selected');
        contextMenuLastItemSelected = i;
    }
}

function contextMenuHideMenu() {
    document.getElementById(
        "contextMenu").style.display = "none"
}

function contextMenuKeyupListener(e) {
    if (e.code === 'Space') {
        contextMenuRightClick(e);
    } else if (e.code == 'Escape') {
        contextMenuHideMenu();
    }
}

function contextMenuRightClick(e) {
    e.preventDefault();

    if (document.getElementById(
            "contextMenu").style.display == "block")
        contextMenuHideMenu();
    else {
        var menu = document
            .getElementById("contextMenu")

        menu.style.display = 'block';
        menu.style.left = e.pageX + "px";
        menu.style.top = e.pageY + "px";
        menu.getElementsByTagName("input")[0].focus();
    }
}

function contextMenuKeyup(e) {
    var sel, table, tr;
    sel = contextMenuLastItemSelected;
    contextMenuSearch();
    if (e.code === 'ArrowDown') {
        if (sel === contextMenuNumberOfItems - 1)
            sel = 0;
        else
            ++sel;
    } else if (e.code === 'ArrowUp') {
        if (sel > 0)
            --sel;
        else
            sel = contextMenuNumberOfItems - 1;
    } else if (e.code === 'Enter') {
        table = document.getElementById('contextMenu').getElementsByTagName('table')[0];
        tr = table.getElementsByTagName("tr");
        tr[sel].click();
    }
    setContextMenuSelected(sel);
}

function contextMenuSearch() {
    var contextMenu, input, filter, table, tr, td, i, txtValue;
    contextMenu = document.getElementById('contextMenu');
    table = contextMenu.getElementsByTagName("table")[0];
    input = contextMenu.getElementsByTagName("input")[0];
    filter = input.value.toUpperCase();
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
