var db = firebase.firestore();
let accountDoc, myEmail, myUndergraduate, myDepartment, myGrade;

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
              console.log(userName + " "+ myEmail);
              $('#MyName').append('<h4>名前: ' + userName + '</h4>');
              $('#MyUndergraduate').append('<h4>学部: ' + myUndergraduate + '</h4>');
              $('#MyDepartment').append('<h4>学科: ' + myDepartment + '</h4>');
              $('#MyGrade').append('<h4>学年: ' + myGrade + '</h4>');
              $('#MyDetails').append('<h4>コメント: ' + myDetails + '</h4>');
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
  $('#MyDetails').innerHTML = myDetails;
  document.location.href = '../account.html?name=' + encodeURIComponent(uid);
}

function changeProfile(){
  //
  let inputUndergraduate = $("#undergraduate").val();
  if (inputUndergraduate == "") return;

  let inputDepartment = $("#department").val();
  if (inputDepartment == "") return;

  let inputGrade = $("#grade").val();
  if (inputGrade == "") return;

  let inputdetails = $("#details").val();
  if (inputdetails == "") return;

  // Add a new document in collection "cities"
  db.collection("account").doc(accountDoc).set({
      email: myEmail,
      name: userName,
      uid: uid,
      undergraduate: inputUndergraduate,
      department: inputDepartment,
      grade: Number(inputGrade),
      details: inputdetails
  })
  .then(() => {
      console.log("Document successfully written!");
      showNewProfile();
  })
  .catch((error) => {
      console.error("Error writing document: ", error);
  });
}
