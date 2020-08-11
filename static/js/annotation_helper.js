//var highlighter;
//
//rangy.init();
//highlighter = rangy.createHighlighter();
//highlighter.addClassApplier(rangy.createClassApplier('highlight'));
//
//function highlight() {
//  highlighter.highlightSelection('highlight');
//  var selTxt = rangy.getSelection();
//  console.log('selTxt: '+selTxt);
//  rangy.getSelection().removeAllRanges();
//}
//
//function removeHighlights() {
//  highlighter.removeAllHighlights();
//}
//
//function showStyle() {
//  alert(document.querySelector('style').innerHTML);
//}
//
//document.getElementById('highlight').addEventListener('click', highlight);
//document.getElementById('remove-highlights').addEventListener('click', removeHighlights);

var serializedHighlights = decodeURIComponent(window.location.search.slice(window.location.search.indexOf("=") + 1));
var highlighter;

var initialDoc;

window.onload = function() {
    rangy.init();

    highlighter = rangy.createHighlighter();

    highlighter.addClassApplier(rangy.createClassApplier("highlight", {
        ignoreWhiteSpace: true,
        tagNames: ["span", "a"]
    }));

    highlighter.addClassApplier(rangy.createClassApplier("name-tag", {
        ignoreWhiteSpace: true,
        elementTagName: "a",
        elementProperties: {
            href: "#",
            onclick: function() {
                var highlight = highlighter.getHighlightForElement(this);
                if (window.confirm("Delete this note (ID " + highlight.id + ")?")) {
                    highlighter.removeHighlights( [highlight] );
                }
                return false;
            }
        }
    }));

    highlighter.addClassApplier(rangy.createClassApplier("place-tag", {
        ignoreWhiteSpace: true,
        elementTagName: "a",
        elementProperties: {
            href: "#",
            onclick: function() {
                var highlight = highlighter.getHighlightForElement(this);
                if (window.confirm("Delete this note (ID " + highlight.id + ")?")) {
                    highlighter.removeHighlights( [highlight] );
                }
                return false;
            }
        }
    }));

    highlighter.addClassApplier(rangy.createClassApplier("time-tag", {
        ignoreWhiteSpace: true,
        elementTagName: "a",
        elementProperties: {
            href: "#",
            onclick: function() {
                var highlight = highlighter.getHighlightForElement(this);
                if (window.confirm("Delete this note (ID " + highlight.id + ")?")) {
                    highlighter.removeHighlights( [highlight] );
                }
                return false;
            }
        }
    }));


    if (serializedHighlights) {
        highlighter.deserialize(serializedHighlights);
    }
};

function saveTagSelectedText() {
    let selectedTag = document.getElementById('selected-tag').value + "-tag"
    highlighter.highlightSelection(selectedTag);
}
function highlightSelectedText() {
    highlighter.highlightSelection("highlight");
}

function noteSelectedText() {
    highlighter.highlightSelection("note");
}

function removeTagSelectedText() {
    highlighter.unhighlightSelection();
}


function reloadPage(button) {
    button.form.elements["serializedHighlights"].value = highlighter.serialize();
    button.form.submit();
}