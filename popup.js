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
