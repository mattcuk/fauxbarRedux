console.log('popup.js loaded');

$('#popButton').on('click', function() {
    console.log('popButton clicked');
});

function popFunc() {
    console.log('popup.js popFunc called');
    console.log($('body').text());
}