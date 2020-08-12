const pdf_name = document.querySelector('#file_name').textContent
const url = '../static/uploads/' + pdf_name

var serializedHighlights;
var highlighter;
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
function isEmpty(str) {
    return (!str || 0 === str.length);
}

function addNewTagType() {
    let new_tag_name = $('new-tag-type').value;
    let new_tag_color = $('new-tag-color').value;
    if(isEmpty(new_tag_name)||isEmpty(new_tag_color)){
        $('new-tag-error').css({visibility : visible});
        console.log("Empty values");
    } else {
        $('#tagModal').modal('hide');
    }
}











let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 1.5,
  canvas = document.querySelector('#the-canvas'),
  ctx = canvas.getContext('2d');

// Render the page
const renderPage = num => {
  pageIsRendering = true;

  // Get page
  pdfDoc.getPage(num).then(page => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
      // Returns a promise, on resolving it will return text contents of the page
      return page.getTextContent();
    }).then(function(textContent){
         document.getElementById('text-layer').innerHTML = "";
         // PDF canvas
         var pdf_canvas = $("#the-canvas");
         // Canvas offset
         var canvas_offset = pdf_canvas.offset();
         // Canvas height
         var canvas_height = pdf_canvas.get(0).height;
         // Canvas width
         var canvas_width = pdf_canvas.get(0).width;
         // Assign CSS to the text-layer element
         $("#text-layer").css({ left: canvas_offset.left + 'px', top: canvas_offset.top + 'px', height: canvas_height + 'px', width: canvas_width + 'px' });
         // Pass the data to the method for rendering of text over the pdf canvas.
         pdfjsLib.renderTextLayer({
            textContent: textContent,
            container: $("#text-layer").get(0),
            viewport: viewport,
         });
         highlighter.removeAllHighlights();
         renderPageTagInfo();
    });
    // Output current page
    document.querySelector('#page-num').textContent = num;
  });
};

// Check for pages rendering
const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

const renderPageTagInfo = () => {
let page_info = {
    pdf_name : pdf_name,
    page_num: pageNum,
  };
  fetch(`/get_tag_info/`+pdf_name+'/'+pageNum, {
    method: "GET",
    headers: new Headers({
      "content-type": "application/json"
    })
  }).then(function(response) {
    if (response.status !== 200) {
      console.log(`Looks like there was a problem. Status code: ${response.status}`);
      return;
    }
    response.json().then(function(data) {
    console.log("Get Res");
      console.log(data);
      if (data['value']=='valid'){
        highlighter.deserialize(data['serialized_val']);
      }
    });
  })
  .catch(function(error) {
    console.log("Fetch error: " + error);
    });
};


const savePageTagInfo = () => {
let page_tag = {
    pdf_name : pdf_name,
    page_num: pageNum,
    serialized_val : highlighter.serialize()
  };
  fetch(`/save_tag_info`, {
    method: "POST",
    body: JSON.stringify(page_tag),
    headers: new Headers({
      "content-type": "application/json"
    })
  }).then(function(response) {
    if (response.status !== 200) {
      console.log(`Looks like there was a problem. Status code: ${response.status}`);
      return;
    }
    response.json().then(function(data) {
       console.log("Save Res");
      console.log(data);
    });
  })
  .catch(function(error) {
    console.log("Fetch error: " + error);
    });
}


// Show Prev Page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  savePageTagInfo();
  pageNum--;
  queueRenderPage(pageNum);
};

// Show Next Page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  savePageTagInfo();

  pageNum++;
  queueRenderPage(pageNum);
};

// Get Document
pdfjsLib
  .getDocument(url)
  .promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.querySelector('#page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
  })
  .catch(err => {
    // Display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('#view-area').insertBefore(div, canvas);
    // Remove top bar
    document.querySelector('.top-bar').style.display = 'none';
  });

// Button Events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);