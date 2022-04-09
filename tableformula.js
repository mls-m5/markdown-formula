


"use strict";

let tables = document.getElementsByTagName("table");
let currentRow = 0;

function getText(table, i, j) {
    let col = table.rows[i].cells[j];
    let text = col.innerText.trim();
    return text;
}

// Convert to number if number
function convert(text) {
    if (isNaN(text)) {
        return text;
    }
    else {
        return number(text);
    }
}

function processTable(table) {
    let rowNames = {};
    for (var i = 0; i < table.rows[0].cells.length; ++i) {
        let name = table.rows[0].cells[i].innerText;
        rowNames[name] = i;

        let j = i; // To not capture changing value
        window[name] = function(row) {
            if (typeof row === "undefined") {
                row = window.row;
            }

            return table.rows[row].cells[j].innerText;
        }
    }

    // Save previous text for autofill
    let prevText = {};
    let shouldAutoFill = {};

    for (let i = 0; i < table.rows.length; ++i) {
        let row = table.rows[i];
        currentRow = i;
        window.row = i;
        for (let j = 0, col; col = row.cells[j], j < row.cells.length; ++j) {
            let text = col.innerText.trim();
            if (text.length > 0 && text[0] === "=") {
                let result = run(text.substring(1));
                console.log("formula ", text.substring(1), " -> ", result);
                col.innerText = result;
                shouldAutoFill[j] = false;
            }
            else if (text === "...") {
                shouldAutoFill[j] = true;
            }

            if (text === "" || text === "...") {
                if (shouldAutoFill[j]) {
                    text = prevText[j];
                    if (text[0] === "=") {
                        col.innerText = run(text.substring(1));
                    }
                    else {
                        text = +text + 1;
                        col.innerText = text;
                    }
                }
            }
            prevText[j] = text;
        }
    }
}

function start() {
    for (let i = 0; i < tables.length; ++i) {
        processTable(tables[i]);
    }
}

document.addEventListener('readystatechange', event => {
    // When HTML/DOM elements are ready:
    if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
        start();
    }
});


