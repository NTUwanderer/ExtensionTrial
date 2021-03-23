// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

let blob = new Blob(['dummy content'], {type: 'text/plain'})
let url = window.URL.createObjectURL(blob);
chrome.downloads.download({url, saveAs: true}, function(id) {
  console.log('iddd: ', id);
    chrome.downloads.search({id: id}, function(results) {
        console.log('results: ', results);
    })
});

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });

  function getFirstElement(element, className) {
    childs = element.getElementsByClassName(className);
    if (!childs)
      return false;
    return childs[0];
  }

  // let wraps = document.getElementsByClassName("main-text-wrap");
  let mainTextWrap = getFirstElement(document, "main-text-wrap");
  if (!mainTextWrap) {
    console.log("no wraps");
  } else {
    let h3 = getFirstElement(mainTextWrap, "j_chapterName");
    if (!h3) {
      console.log("no chapterName");
    } else {
      console.log("text: ", h3.firstElementChild.textContent);
    }

    let content = getFirstElement(mainTextWrap, "j_readContent");
    if (!content) {
      console.log("no content");
    } else {
      childs = content.getElementsByClassName("content-wrap");
      console.log("childs: ", childs);
      for (let i = 0; i < childs.length; ++i) {
        let child = childs[i];
        console.log(child.textContent);
      }
    }
  }
  let chapterNext = document.getElementById("j_chapterNext");
  console.log('chapterNext: ', chapterNext);
  // if (chapterNext) {
  //   chapterNext.click();
  // }
}
