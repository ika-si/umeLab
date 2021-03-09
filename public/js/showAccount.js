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
    
    // let mySubGrade;
    // if (myGrade == -1) {
    //     mySubGrade = "未入力"
    // } else {
    //     mySubGrade = myGrade;
    // }
    // if (uid.indexOf("?") != -1) {
    //     uid = uid.substring(0, uid.indexOf("?"));
    // }
    // console.log(decodeURIComponent(uid));

    $('#MyName').append('<h4>名前: ' + array[1] + '</h4>');
    $('#MyUndergraduate').append('<h4>学部: ' + array[2] + '</h4>');
    $('#MyDepartment').append('<h4>学科: ' + array[3] + '</h4>');
    $('#MyGrade').append('<h4>学年: ' + array[4] + '</h4>');
    $('#MyDetails').append('<h4>コメント: ' + array[5] + '</h4>');
    $('#MyTwitter').append('<h4>' + array[6] + '</h4>');
    $('#MyInstagram').append('<h4>' + array[7] + '</h4>');
}
show();