var db = firebase.firestore();
let accountDoc, myEmail, myUndergraduate, myDepartment, myGrade, myTwitter, myInstagram;

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
              myTwitter = doc.data()['twitter'];
              myInstagram = doc.data()['instagram'];
              console.log(userName + " "+ myEmail);
              $('#MyName').append('<h4>名前: ' + userName + '</h4>');
              $('#MyUndergraduate').append('<h4>学部: ' + myUndergraduate + '</h4>');
              $('#MyDepartment').append('<h4>学科: ' + myDepartment + '</h4>');
              $('#MyGrade').append('<h4>学年: ' + myGrade + '</h4>');
              $('#MyTwitter').append('<h4>' + myTwitter + '</h4>');
              $('#MyInstagram').append('<h4>' + myInstagram + '</h4>');
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
  $('#MyTwitter').innerHTML = myTwitter;
  $('#MyInstagram').innerHTML = myInstagram;
  document.location.href = '../account.html?name=' + encodeURIComponent(uid);
}

function changeProfile(){
  //
  let inputUndergraduate = $("#undergraduate").val();
  // if (myUndergraduate == "undefined") myUndergraduate = "未入力";
  if (inputUndergraduate == "") inputUndergraduate = "未入力";

  let inputDepartment = $("#department").val();
  // if (myDepartment == "undefined") myDepartment = "未入力";
  if (inputDepartment == "") inputDepartment = "未入力";

  let inputGrade = $("#grade").val();
  // if (myGrade == "undefined") myGrade = "未入力";
  if (inputGrade == "") inputGrade = -1;

  let inputTwitter = $("#twitter").val();
  // if (myTwitter == "undefined") myTwitter = "未入力";
  if (inputTwitter == "") inputTwitter = "未入力";

  let inputInstagram = $("#instagram").val();
  // if (myInstagram == "undefined") myInstagram = "未入力";
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
      instagram: inputInstagram
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
