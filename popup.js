// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");
let outputButton = document.getElementById("outputButton");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("content: ", request.content);

    fetch('http://localhost:8080', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        title: request.title,
        content: request.content
      }),
    });

    outputButton.click();
  }
);

outputButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: nextPage,
  });
});

setInterval(function() { changeColor.click(); }, 4000);

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: parseElements,
  });
});

function nextPage() {
  let chapterNext = document.getElementById("j_chapterNext");
  console.log('chapterNext: ', chapterNext);
  if (chapterNext) {
    chapterNext.click();
    console.log("clicked");
  }
}

// The body of this function will be execuetd as a content script inside the
// current page
function parseElements() {
  function getFirstElement(element, className) {
    childs = element.getElementsByClassName(className);
    if (!childs)
      return false;
    return childs[0];
  }

  // let wraps = document.getElementsByClassName("main-text-wrap");
  let mainTextWrap = getFirstElement(document, "main-text-wrap");
  let title = "";
  let contentText = "";
  if (!mainTextWrap) {
    console.log("no wraps");
  } else {
    let h3 = getFirstElement(mainTextWrap, "j_chapterName");
    if (!h3) {
      console.log("no chapterName");
    } else {
      title = h3.firstElementChild.textContent;
      console.log("title: ", title);
    }

    let content = getFirstElement(mainTextWrap, "j_readContent");
    if (!content) {
      console.log("no content");
    } else {
      childs = content.getElementsByClassName("content-wrap");
      console.log("length: ", childs.length);
      if (childs.length < 5)
        return;

      for (let i = 0; i < childs.length; ++i) {
        let child = childs[i];
        console.log(child.textContent);
        contentText += child.textContent + "\n\n";
      }
    }
  }

  if (contentText) {
    chrome.runtime.sendMessage({title: title, content: contentText});
  }
}

