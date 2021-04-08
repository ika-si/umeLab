function show() {
    var query = location.search;
    var value1 = query.split('?');
    var array = [];

    var value2 = value1[1].split('=');
    array[0] = value2[1];


    for(let i = 1; i < value1.length; i++) {
        var value2 = value1[i].split('=');
        array[i] = value2[1];
    }

    userName = decodeURI(array[1]);
    myUndergraduate = decodeURI(array[2]);
    myDepartment = decodeURI(array[3]);
    myGrade = decodeURI(array[4]);
    myDetails = decodeURI(array[5]);
    myTwitter = decodeURI(array[6]);
    myInstagram = decodeURI(array[7]);

    $('#MyName').append('<h4>名　　前　:　' + userName + '</h4>');
    $('#MyUndergraduate').append('<h4>学　　部　:　' + myUndergraduate + '</h4>');
    $('#MyDepartment').append('<h4>学　　科　:　' + myDepartment + '</h4>');
    if (myGrade == -1) {
        $('#MyGrade').append('<h4>学　　年　:　' + '</h4>');
    } else {
        $('#MyGrade').append('<h4>学　　年　:　' + myGrade + '</h4>');
    }
    $('#MyDetails').append('<h4>コメント　:　' + myDetails + '</h4>');
    if (myTwitter == '') {
        $('#MyTwitter').append('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16">'
        +'<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>'
        +'</svg>');
        // $('#MyTwitter').append('<h4>@' + myTwitter + '</h4>');
    } else {
        $('#MyTwitter').append('<a href="https://twitter.com/'+myTwitter+'?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Follow @'+myTwitter+'</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>');
    }
    $('#MyInstagram').append('<h4>' + myInstagram + '</h4>');


}
show();
