console.log('popup.js loaded');

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

$('#searchBoth').on('click', function() {
    var search = $('#search').val();
    searchBookmarks(search);
    searchHistory(search);
});

$('#searchBookmarks').on('click', function() {
    var search = $('#search').val();
    searchBookmarks(search);
});

$('#searchHistory').on('click', function() {
    var search = $('#search').val();
    searchHistory(search);
});

function searchBookmarks(search) {
    var bookmarkList = $('#bookmarks');
    bookmarkList.empty();
    chrome.bookmarks.search(search, function(results) {
        console.log(results.length + ' bookmarks found');
        results.forEach(function(bookmark) {
            bookmarkList.append($('<option>', {
                value: bookmark.url,
                text: bookmark.url
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
                text: result.visitCount + " " + result.url
            }));
            // console.log('URL: ' + result.url);
            // console.log('Last visited: ' + new Date(result.lastVisitTime));
            // console.log('Visit count: ' + result.visitCount);
        });
    });
}

