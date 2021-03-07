function userSendChat() {
  window.location.href ='../chat.html?name=' + encodeURIComponent(uid);
}

function userSendRoom() {
  window.location.href ='../room.html?name=' + encodeURIComponent(uid);
}

function userSendClasslist(period) {
  window.location.href ='../classlist.html?name=' + encodeURIComponent(uid) + "?period=" + encodeURIComponent(period);
}

const db = firebase.firestore();
const weekArr = ["Mon", "Tue", "Wed", "Thu", "Fri"];

{/* <span id="openingClass">[開講曜日・時限]</span> */}

// 追加・roomのボタンを作成
for (let i=0; i<weekArr.length; i++) {
  for (let j=1; j<=6; j++) {
    let parent = document.getElementById(`${weekArr[i]}${j}`);
    // console.log(parent.id);
    let classname = document.createElement('span');
    classname.setAttribute('id', `${parent.id}name`);
    parent.appendChild(classname);
    let addBtn = document.createElement('button');
    addBtn.setAttribute('type', 'button');
    addBtn.setAttribute('id', `${parent.id}add`);
    addBtn.setAttribute('class', 'btn btn-outline-warning');
    addBtn.innerText = "追加";
    addBtn.setAttribute('onclick', `userSendClasslist('${parent.id}')`);
    parent.appendChild(addBtn);
    let roomBtn = document.createElement('button');
    roomBtn.setAttribute('type', 'button');
    roomBtn.setAttribute('id', `${parent.id}room`);
    roomBtn.setAttribute('class', 'btn btn-outline-primary');
    roomBtn.innerText = "room";
    roomBtn.setAttribute('onclick', 'userSendRoom()');
    parent.appendChild(roomBtn);
  }
} 
let isMyClasses = true;

if (isMyClasses) {
  for (let i=0; i<weekArr.length; i++) {
    for (let j=1; j<=6; j++) {
      document.getElementById(`${weekArr[i]}${j}room`).style.display = "none";
    }
  }
}

// 追加・roomボタンの表示/非表示を設定
for (let i=0; i<weekArr.length; i++) {
  for (let j=1; j<=6; j++) {

    // 自分が（uidでFirestoreを検索) Mon1とかごとにクラスを履修していたら addClass にtrueが入る
    db.collection("account")
    .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {
              db.collection("account").doc(doc.id).collection("myClasses")
              .get().then((querySnapshot2) => {

                for (var k in querySnapshot2.docs) {
                  const doc2 = querySnapshot2.docs[k];
                  if (doc2.data()["room"] == document.getElementById(`${weekArr[i]}${j}`).id) { //myClassesにこのroomのデータが登録されていたら　room ボタンを表示
                    console.log("Find room : " + weekArr[i] + j);
                    document.getElementById(`${weekArr[i]}${j}add`).style.display = "none";
                    document.getElementById(`${weekArr[i]}${j}room`).style.display = "block";
                    document.getElementById(`${document.getElementById(weekArr[i] + j).id}name`).textContent = doc2.data()["name"];
                    // document.write(doc2.data()["name"]);
                    console.log(`${weekArr[i]}${j} : "room" button`);
                    break;
                  } else { //追加 ボタンを表示
                    document.getElementById(`${weekArr[i]}${j}add`).style.display = "block";
                    document.getElementById(`${weekArr[i]}${j}room`).style.display = "none";
                    // console.log(`${weekArr[i]}${j} : "追加" button`);
                  }
                }

              });
            }
        });
    });
  }
}




// -> 1

// 追加・roomボタンの表示/非表示を設定
// for (let i=0; i<weekArr.length; i++) {
//   for (let j=1; j<=6; j++) {
//     let isAddedClass = false;

//     // 自分が（uidでFirestoreを検索) Mon1とかごとにクラスを履修していたら addClass にtrueが入る
//     db.collection("account")
//     .get().then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             if(doc.data()['uid'] == uid) {
//               db.collection("account").doc(doc.id).collection("myClasses")
//               .get().then((querySnapshot2) => {
//                 querySnapshot2.forEach((doc2) => {
//                     // console.log(doc2.id, " => ", doc2.data());
//                     if (doc2.data()["room"] == document.getElementById(`${weekArr[i]}${j}`).id) {
//                       isAddedClass = true;
//                       console.log("Find room : " + weekArr[i] + j);
//                     }
//                 });
//               });
//             }
//         });
//     });
//     console.log(isAddedClass);

//     if (isAddedClass) { //myClassesにこのroomのデータが登録されていたら　room ボタンを表示
//       document.getElementById(`${weekArr[i]}${j}add`).style.display = "none";
//       console.log(`${weekArr[i]}${j} : "room" button`);
//     } else { //追加 ボタンを表示
//       document.getElementById(`${weekArr[i]}${j}room`).style.display = "none";
//       console.log(`${weekArr[i]}${j} : "追加" button`);
//     }
//   }
// }

// <- 1


// -> 2

// displayBtn();

// async function displayBtn() {
//   for (let i=0; i<weekArr.length; i++) {
//     for (let j=1; j<=6; j++) {
//       let isAddedClass = await serchFBmyclass(i, j);

//       if (isAddedClass) { //myClassesにこのroomのデータが登録されていたら　room ボタンを表示
//         document.getElementById(`${weekArr[i]}${j}add`).style.display = "none";
//         console.log(`${weekArr[i]}${j} : "room" button`);
//       } else { //追加 ボタンを表示
//         document.getElementById(`${weekArr[i]}${j}room`).style.display = "none";
//         console.log(`${weekArr[i]}${j} : "追加" button`);
//       }
//     }
//   }
// }

// function serchFBmyclass(i, j) {
//   let result = false;
//   db.collection("account")
//     .get().then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//           if(doc.data()['uid'] == uid) {
//             db.collection("account").doc(doc.id).collection("myClasses")
//             .get().then((querySnapshot2) => {
//               querySnapshot2.forEach((doc2) => {
//                   // console.log(doc2.id, " => ", doc2.data());
//                   if (doc2.data()["room"] == document.getElementById(`${weekArr[i]}${j}`).id) {
//                     result = true;
//                     console.log("Find room : " + weekArr[i] + j);
//                   }
//               });
//             });
//           }
//       });
//     });
//     console.log(result);
//   return result;
// }

// <- 2