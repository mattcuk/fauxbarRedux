console.log('popup.js loaded');

var _activeTab;

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    _activeTab = tabs[0];
});

$('#readVar').on('click', function() {
    chrome.runtime.sendMessage({ 
        message: "get_name"
    }, response => {
        if (response.message === 'success') {
            $('#response').html(`Variable contains: ${response.payload}`);
        }
    });

    commonFunc();
});

$('#setVar').on('click', function() {
    chrome.runtime.sendMessage({ 
        message: "change_name",
        payload: "Scott"
    }, response => {
        if (response.message === 'success') {
            $('#response').html('Variable set!');
        }
    });
});

$('#setVar2').on('click', function() {
    chrome.storage.local.set({
        name: 'John'
    }, () => {
        $('#response').html('Variable set2!');
    })
});

 var debounce;
 $('#search').on('keyup', function (e) {
     clearTimeout(debounce);
     debounce = setTimeout( 
       function () { 
            var search = $('#search').val();
            searchBookmarks(search);
            searchHistory(search);
       }, 300
     );
});

$("#history,#bookmarks").on("dblclick", function() {
    var url = $(this).find(":selected").val();
    console.log(_activeTab);
    
    if(_activeTab.url.indexOf('chrome')==0) {
        chrome.tabs.update(_activeTab.id, {url: url})
    } else {
        alert(_activeTab.url);
        chrome.tabs.create({url: url})
    }
});

// $('#searchBoth').on('click', function() {
//     var search = $('#search').val();
//     searchBookmarks(search);
//     searchHistory(search);
// });

// $('#searchBookmarks').on('click', function() {
//     var search = $('#search').val();
//     searchBookmarks(search);
// });

// $('#searchHistory').on('click', function() {
//     var search = $('#search').val();
//     searchHistory(search);
// });

function searchBookmarks(search) {
    var bookmarkList = $('#bookmarks');
    bookmarkList.empty();
    chrome.bookmarks.search(search, function(results) {
        console.log(results.length + ' bookmarks found');
        results.forEach(function(bookmark) {
            bookmarkList.append($('<option>', {
                value: bookmark.url,
                text: bookmark.url,
                title: bookmark.title
            }));
            // console.log('ID: ' + bookmark.id);
            // console.log('Title: ' + bookmark.title);
            // console.log('URL: ' + bookmark.url);
        });
    });
}

function searchHistory(search) {
    var historyList = $('#history');
    historyList.empty();
    chrome.history.search({text: search, startTime: 0}, function(results) {
        results.forEach(function(result) {
            historyList.append($('<option>', {
                value: result.url,
                text: result.visitCount + " " + result.url,
                title: result.title
            }));
            // console.log('URL: ' + result.url);
            // console.log('Last visited: ' + new Date(result.lastVisitTime));
            // console.log('Visit count: ' + result.visitCount);
        });
    });
}

