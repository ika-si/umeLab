var db = firebase.firestore();
let accountDoc, myEmail, myUndergraduate, myDepartment, myGrade, myDetails, myTwitter, myInstagram;
let mustCount, optionalCount, freeCount;

function showProfile(){
  db.collection("account").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if(doc.data()['uid'] == uid) {
            accountDoc = doc.id;
            console.log(accountDoc);
              console.log('find');
              userName = doc.data()['name'];
              myEmail = doc.data()['email'];
              myUndergraduate = doc.data()['undergraduate'];
              myDepartment = doc.data()['department'];
              myGrade = doc.data()['grade'];
              let mySubGrade;
              if (myGrade == -1) {
                mySubGrade = "未入力"
              } else {
                mySubGrade = myGrade;
              }
              myDetails = doc.data()['details'];
              myTwitter = doc.data()['twitter'];
              myInstagram = doc.data()['instagram'];
              mustCount = doc.data()['mustCount'];
              optionalCount = doc.data()['optionalCount'];
              freeCount = doc.data()['freeCount'];

              $('#MyName').append('<h4>名前: ' + userName + '</h4>');
              $('#MyUndergraduate').append('<h4>学部: ' + myUndergraduate + '</h4>');
              $('#MyDepartment').append('<h4>学科: ' + myDepartment + '</h4>');
              $('#MyGrade').append('<h4>学年: ' + mySubGrade + '</h4>');
              $('#MyDetails').append('<h4>コメント: ' + myDetails + '</h4>');
              $('#MyTwitter').append('<h4>' + myTwitter + '</h4>');
              $('#MyInstagram').append('<h4>' + myInstagram + '</h4>');
              $('#MyMustCredits').append('<h4>必修科目単位数: ' + mustCount + '</h4>');
              $('#MyOptionalMustCredits').append('<h4>選択必修科目単位数: ' + optionalCount + '</h4>');
              $('#MyFreeCredits').append('<h4>自由科目単位数: ' + freeCount + '</h4>');

          }
          // console.log('アカウントがない');
          // window.location.href ='../index.html';
          // console.log(doc.data()['name']);
          // var name = doc.data()['name'];
          // $('#list').append('<li>'+ name + '</li>');
      })
  })

}

showProfile();
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
  if (inputUndergraduate == "") inputUndergraduate = "未入力";

  let inputDepartment = $("#department").val();
  if (inputDepartment == "") inputDepartment = "未入力";

  let inputGrade = $("#grade").val();
  if (inputGrade == "") inputGrade = -1;

  let inputDetails = $("#details").val();
  if (inputDetails == "") inputDetails = "未入力";

  let inputTwitter = $("#twitter").val();
  if (inputTwitter == "") inputTwitter = "未入力";

  let inputInstagram = $("#instagram").val();
  if (inputInstagram == "") inputInstagram = "未入力";

  // Add a new document in collection "cities"
  db.collection("account").doc(accountDoc).set({
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
