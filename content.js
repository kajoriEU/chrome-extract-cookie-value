chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "copyToClipboard") {
    const input = document.createElement('input');
    input.value = request.text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    sendResponse({ status: "success" });
  }
});
