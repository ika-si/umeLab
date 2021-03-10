function show() {
    var query = location.search;
    var value1 = query.split('?');
    console.log(value1[3]);
    var array = [];


    var value2 = value1[1].split('=');
    array[0] = value2[1];
    console.log(array[0]);


    for(let i = 1; i < value1.length; i++) {
        var value2 = value1[i].split('=');
        array[i] = value2[1];
        console.log(array[i]);
    }

    userName = decodeURI(array[1]);
    myUndergraduate = decodeURI(array[2]);
    myDepartment = decodeURI(array[3]);
    myGrade = decodeURI(array[4]);
    myDetails = decodeURI(array[5]);
    myTwitter = decodeURI(array[6]);
    myInstagram = decodeURI(array[7]);

    if (myGrade == -1) {
        myGrade = "未入力"
    }

    // if (uid.indexOf("?") != -1) {
    //     uid = uid.substring(0, uid.indexOf("?"));
    // }
    // console.log(decodeURIComponent(uid));
    $('#MyName').append('<h4>名前: ' + userName + '</h4>');
    $('#MyUndergraduate').append('<h4>学部: ' + myUndergraduate + '</h4>');
    $('#MyDepartment').append('<h4>学科: ' + myDepartment + '</h4>');
    $('#MyGrade').append('<h4>学年: ' + myGrade + '</h4>');
    $('#MyDetails').append('<h4>コメント: ' + myDetails + '</h4>');
    $('#MyTwitter').append('<h4>@' + myTwitter + '</h4>');
    $('#MyInstagram').append('<h4>' + myInstagram + '</h4>');

}
show();
