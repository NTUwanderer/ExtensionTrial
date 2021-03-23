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
}
