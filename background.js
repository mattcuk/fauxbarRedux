console.log('background.js loaded');

// Useful resources;
// Icons - https://www.svgrepo.com/svg/449050/document-time
// Resizing SVGs - https://boxy-svg.com/
// Omnibox API - https://developer.chrome.com/docs/extensions/reference/api/omnibox
// Unicode icons that can be baked into code - https://symbl.cc/en/unicode/blocks/dingbats/

chrome.runtime.onInstalled.addListener(() => {
    // default state goes here
    // this runs ONE TIME ONLY (unless the user reinstalls your extension)
});

chrome.omnibox.onInputStarted.addListener(function () {
    chrome.omnibox.setDefaultSuggestion({
        description:
            "🚀 Search through all your browse history ... "
    });
});

chrome.omnibox.onInputChanged.addListener(function (searchText, suggest) {
    if (searchText.length>1) {
        chrome.history.search({ text: searchText, startTime: 0 }, function (results) {
            var suggestions = [];

            var limit = 20; // Limits the total number of results in the omnibox to this.. should help with performance when dealing with long lists
            if(results.length<limit) limit = results.length;

            var titleLimit = 80; // Limits the page titles to this number of characters when displayed in the omnibox

            // Loop over history results & format them into suggestions for the omnibox to display
            for(var i=0; i<results.length; i++) {
                results.forEach(function (result) {
                    if(result.title.length>1) {
                        suggestions.push({
                            content: result.url, 
                            description: xmlEncode(limitText(result.title, titleLimit)) + ' - <url>' +xmlEncode(tidyUrl(result.url))+'</url>', 
                            deletable: false });
                    }
                });
            }

            // Display the suggestions from browse history
            suggest(suggestions);
        });
    }
});

// Encode characters for XML
function xmlEncode(str) {
    return str.replace(/&|<|>|'|"/g, (match) => {
        switch (match) {
            case "&": return "&amp;";
            case "<": return "&lt;";
            case ">": return "&gt;";
            case "'": return "&apos;";
            case '"': return "&quot;";
            default: return match;
        }
    });
}

// Limits a string  to a number of characters and appends ... to the end
function limitText(text, limit) {
    if(text.length>limit) text = text.substring(0, limit) + ' ... ';
    return text;
}

// Remove the protocol from domains (can be extended to do other things as needed)
function tidyUrl(url) {
    url = url.replace('https://', '');
    url = url.replace('http://', '');
    return url;
}

/*chrome.omnibox.onInputEntered.addListener(function (text, disposition) {
    appendLog(
        `✔️ onInputEntered: text -> ${text} | disposition -> ${disposition}`
    );
});*/

chrome.omnibox.onInputEntered.addListener((url, disposition) => {
  switch (disposition) {
    case "currentTab":
          chrome.tabs.update({ url });
      break;
    case "newForegroundTab":
          chrome.tabs.create({ url });
      break;
    case "newBackgroundTab":
          chrome.tabs.create({ url, active: false });
      break;
  }
});

/*chrome.omnibox.onInputCancelled.addListener(function () {
    appendLog('❌ onInputCancelled');
});

chrome.omnibox.onDeleteSuggestion.addListener(function (text) {
    appendLog('⛔ onDeleteSuggestion: ' + text);
});*/

/*chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(tab.url);
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./foreground.js"]
        })
        .then(() => {
            console.log("INJECTED THE FOREGROUND SCRIPT.");
        })
        .catch(err => console.log(err));
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_name') {
        console.log(request.message);
        chrome.storage.local.get('name', data => {
            if (chrome.runtime.lastError) {
                sendResponse({
                    message: 'fail'
                });

                return;
            }
            sendResponse({
                message: 'success',
                payload: data.name
            });
        });

        return true;
    } else if (request.message === 'change_name') {
        chrome.storage.local.set({
            name: request.payload
        }, () => {
            if (chrome.runtime.lastError) {
                sendResponse({ message: 'fail' });
                return;
            }
            sendResponse({ message: 'success' });
        })

        return true;
    }
});*/