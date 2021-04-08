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
    $('#MyTwitter').append('<a href="https://twitter.com/'+myTwitter+'?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Follow @'+myTwitter+'</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>');
    $('#MyInstagram').append('<h4>' + myInstagram + '</h4>');


}
show();
