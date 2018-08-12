jQuery(document).ready(function($){
    let es = new EventSource('/stream');
    es.onmessage = function (event) {
        console.log(event)
    };
    es.addEventListener('starter', function (event) {
        console.log(event)
    });
});