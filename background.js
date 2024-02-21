console.log('background.js loaded');

chrome.runtime.onInstalled.addListener(() => {
    // default state goes here
    // this runs ONE TIME ONLY (unless the user reinstalls your extension)
});

chrome.omnibox.onInputStarted.addListener(function () {
    chrome.omnibox.setDefaultSuggestion({
        description:
            "<match>History Results</match> from"
    });
});

// https://developer.chrome.com/docs/extensions/reference/api/omnibox
chrome.omnibox.onInputChanged.addListener(function (searchText, suggest) {

    if (searchText.length>1) {
        chrome.history.search({ text: searchText, startTime: 0 }, function (results) {
            var suggestions = [];
            results.forEach(function (result) {
                if(result.title.length>1) {
                    suggestions.push({ content: result.url, description: xmlEncodeManual(result.title) + ' - <url>' +xmlEncodeManual(result.url)+'</url>', deletable: false });
                }
                // console.log('URL: ' + result.url);
                // console.log('Last visited: ' + new Date(result.lastVisitTime));
                // console.log('Visit count: ' + result.visitCount);
            });
            if(suggestions.length>0) suggest(suggestions);
        });
    }
});

function xmlEncodeManual(str) {
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