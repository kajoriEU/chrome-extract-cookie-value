chrome.browserAction.onClicked.addListener(function(tab) {
  let url = prompt('Enter the URL to extract the cookie from:');
  let cookieName = prompt('Enter the cookie name:');

  if (url && cookieName) {
    chrome.tabs.create({ url: url }, function(newTab) {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
        if (tabId === newTab.id && changeInfo.status === 'complete') {
          setTimeout(function() {
            chrome.cookies.get({ url: url, name: cookieName }, function(cookie) {
              if (chrome.runtime.lastError) {
                console.error(`Error retrieving cookie: ${chrome.runtime.lastError.message}`);
                alert(`Error retrieving cookie: ${chrome.runtime.lastError.message}`);
              } else if (cookie) {
                console.log(`${cookieName} cookie value:`, cookie.value);
                alert(`${cookieName} value: ` + cookie.value);

                chrome.tabs.sendMessage(tabId, { action: "copyToClipboard", text: cookie.value }, function(response) {
                  if (response && response.status === "success") {
                    console.log(`${cookieName} value copied to clipboard.`);
                  } else {
                    console.error(`Failed to copy ${cookieName} value to clipboard.`);
                  }
                });
              } else {
                console.error(`${cookieName} cookie not found.`);
                alert(`${cookieName} cookie not found.`);
              }
            });
          }, 1000); // Increased delay to 1 seconds
        }
      });
    });
  }
});
