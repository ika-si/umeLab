var db = firebase.firestore();
let accountDoc, myEmail, myUndergraduate, myDepartment, myGrade, myDetails, myTwitter, myInstagram;
let mustCount, optionalCount, freeCount;
let my2021ContainClassIdArr = [];
let my2021Count = 0;

function pageOnload() { // account.jsで呼ばれてここがまず実行される
  // showProfile();
  calcMy2021Credits(); // showProfile()も呼ばれる
}

function showProfile(){
  mydocRef.get().then((doc) => {
    if (doc.exists) {
      accountDoc = doc.id;
      console.log(accountDoc);
        userName = doc.data()['name'];
        myEmail = doc.data()['email'];
        myUndergraduate = doc.data()['undergraduate'];
        myDepartment = doc.data()['department'];
        myGrade = doc.data()['grade'];
        myDetails = doc.data()['details'];
        myTwitter = doc.data()['twitter'];
        myInstagram = doc.data()['instagram'];
        mustCount = doc.data()['mustCount'];
        optionalCount = doc.data()['optionalCount'];
        freeCount = doc.data()['freeCount'];

        $('#MyName').append('<h4>名　　前　:　' + userName + '</h4>');
        $('#MyUndergraduate').append('<h4>学　　部　:　' + myUndergraduate + '</h4>');
        $('#MyDepartment').append('<h4>学　　科　:　' + myDepartment + '</h4>');
        if (myGrade == -1) {
          $('#MyGrade').append('<h4>学　　年　:　' + '</h4>');
        } else {
          $('#MyGrade').append('<h4>学　　年　:　' + myGrade + '</h4>');
        }
        $('#MyDetails').append('<h4>コメント　:　' + myDetails + '</h4>');
        $('#MyTwitter').append('<h4>@' + myTwitter + '</h4>');
        $('#MyInstagram').append('<h4>' + myInstagram + '</h4>');
        $('#My2021Credits').append('<h4><br>2021年度総単位数　:　' + my2021Count + '</h4>'); //
        $('#MyMustCredits').append('<h4><br>　　必修科目　:　' + mustCount + '</h4>');
        $('#MyOptionalMustCredits').append('<h4>選択必修科目　:　' + optionalCount + '</h4>');
        $('#MyFreeCredits').append('<h4>　　自由科目　:　' + freeCount + '</h4>');
    } else {
        console.log("No such document!");
        // console.log('アカウントがない');
        // window.location.href ='../index.html';
        // console.log(doc.data()['name']);
        // var name = doc.data()['name'];
        // $('#list').append('<li>'+ name + '</li>');
    }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });

}

function showNewProfile(){
  $('#MyName').innerHTML = userName;
  $('#MyUndergraduate').innerHTML = myUndergraduate;
  $('#MyDepartment').innerHTML = myDepartment;
  $('#MyGrade').innerHTML = myGrade;
  $('#MyDtails').innerHTML = myDetails;
  $('#MyTwitter').innerHTML = myTwitter;
  $('#MyInstagram').innerHTML = myInstagram;
  document.location.href = '../account.html?name=' + encodeURIComponent(uid);
}

function changeProfile(){

  let inputUndergraduate = $("#undergraduate").val();
  if (inputUndergraduate == "") {
    if (myUndergraduate != "") inputUndergraduate = myUndergraduate;
  }

  let inputDepartment = $("#department").val();
  if (inputDepartment == "") {
    if (myDepartment != "") inputDepartment = myDepartment;
  }

  let inputGrade = $("#grade").val();
  if (inputGrade == "") inputGrade = myGrade;
  if (isNaN(inputGrade)) inputGrade = -1;

  let inputDetails = $("#details").val();
  if (inputDetails == "") {
    if (myDetails != "") inputDetails = myDetails;
  }

  let inputTwitter = $("#twitter").val();
  if (inputTwitter == "") {
    if (myTwitter != "") inputTwitter = myTwitter;
  }

  let inputInstagram = $("#instagram").val();
  if (inputInstagram == "") {
    if (myInstagram != "") inputInstagram = myInstagram;
  }

  // Add a new document in collection "cities"
  db.collection("account").doc(accountDoc).update({
      email: myEmail,
      name: userName,
      uid: uid,
      undergraduate: inputUndergraduate,
      department: inputDepartment,
      grade: Number(inputGrade),
      twitter: inputTwitter,
      instagram: inputInstagram,
      details: inputDetails
  })
  .then(() => {
      console.log("Document successfully written!");
      showNewProfile();
  })
  .catch((error) => {
      console.error("Error writing document: ", error);
      var errorMessage = error.message;
      $('#errorMessage').append("Error: "+errorMessage);
  });
}

function calcMy2021Credits() {
  mydocRef.get().then((doc) => {
    if (doc.exists) {
      if (typeof doc.data()["y2021MyClasses"] === 'undefined') {
        // my2021Count = 0; でプロフィールを表示する
        showProfile();
      } else {
        if (doc.data()["y2021MyClasses"].length == 0) {
          showProfile();
        } else {
          my2021ContainClassIdArr = doc.data()["y2021MyClasses"];
          calcCredits(0);
        }
      }
    } else {
        console.log("No such document!");
    }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

function calcCredits(i) {
  db.collection("year").doc("2021").collection("classes").doc(String(my2021ContainClassIdArr[i])).get().then((doc) => {
    if (doc.exists) {
        my2021Count += doc.data()["credit"];

        if (i + 1 < my2021ContainClassIdArr.length) {
          calcCredits(i + 1);
        } else {
          // 単位計算完了。プロフィールを表示する
          showProfile();
        }
    } else {
        console.log("No such document!");
    }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}