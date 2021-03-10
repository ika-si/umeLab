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
              $('#MyMustCredits').append('<h4><br>　　必修科目　:　' + mustCount + '</h4>');
              $('#MyOptionalMustCredits').append('<h4>選択必修科目　:　' + optionalCount + '</h4>');
              $('#MyFreeCredits').append('<h4>　　自由科目　:　' + freeCount + '</h4>');

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
  if (myUndergraduate != "") inputUndergraduate = myUndergraduate;

  let inputDepartment = $("#department").val();
  if (myDepartment != "") inputDepartment = myDepartment;

  let inputGrade = $("#grade").val();
  if (myGrade != -1 || inputGrade == "") inputGrade = myGrade;
  if (isNaN(inputGrade)) inputGrade = -1;

  let inputDetails = $("#details").val();
  if (myDetails != "") inputDetails = myDetails;

  let inputTwitter = $("#twitter").val();
  if (myTwitter != "") inputTwitter = myTwitter;

  let inputInstagram = $("#instagram").val();
  if (myInstagram != "") inputInstagram = myInstagram;

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
