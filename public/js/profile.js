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
              console.log(userName + " "+ myEmail);
              $('#MyName').append('<h2>' + userName + '</h2>');
              $('#MyUndergraduate').append('<h2>' + myUndergraduate + '</h2>');
              $('#MyDepartment').append('<h2>' + myDepartment + '</h2>');
              $('#MyGrade').append('<h2>' + myGrade + '</h2>');
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
  document.location.reload();
}

function changeProfile(){
  //
  let inputUndergraduate = $("#undergraduate").val();
  if (inputUndergraduate == "") return;

  let inputDepartment = $("#department").val();
  if (inputDepartment == "") return;

  let inputGrade = $("#grade").val();
  if (inputGrade == "") return;

  // Add a new document in collection "cities"
  db.collection("account").doc(accountDoc).set({
      email: myEmail,
      name: userName,
      uid: uid,
      undergraduate: inputUndergraduate,
      department: inputDepartment,
      grade: Number(inputGrade)
  })
  .then(() => {
      console.log("Document successfully written!");
      showNewProfile();

  })
  .catch((error) => {
      console.error("Error writing document: ", error);
  });
}
