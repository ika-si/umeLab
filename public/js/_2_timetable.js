// ページ遷移時 のscript
// -----------------------------------------------------------------------------------------------------------------------------
let year = "2021"; // default いつか拡張させて変数にする
let selectedTerm = document.getElementById("termSelect");

let returnTerm; // classlist.html から戻ってきた時にもとのタームが表示されるようにするために使う
// URLから取得
let query = location.search;
let value = query.split('=');
returnTerm = value[2];
console.log("returnTerm : ", returnTerm);
if (value[1].indexOf("?") != -1) { // classlist.html から戻ってきた時
  if (returnTerm == "T1") {
    selectedTerm.options[0].selected = true;
  } else if (returnTerm == "T2") {
    selectedTerm.options[1].selected = true;
  } else if (returnTerm == "T3") {
    selectedTerm.options[2].selected = true;
  } else { // returnTerm == "T4"
    selectedTerm.options[3].selected = true;
  }
  // console.log(document.getElementById("termSelect"));
}


const db = firebase.firestore();
const weekArr = ["Mon", "Tue", "Wed", "Thu", "Fri"];
let edit = false; // 編集ステータスかどうか

// 追加・room・変更ボタンを作成
for (let i=0; i<weekArr.length; i++) {
  for (let j=1; j<=6; j++) {
    let parent = document.getElementById(`${weekArr[i]}${j}`);
    let classname = document.createElement('span');
    classname.setAttribute('id', `${parent.id}name`);
    parent.appendChild(classname);
    let addBtn = document.createElement('button');
    addBtn.setAttribute('type', 'button');
    addBtn.setAttribute('id', `${parent.id}add`);
    addBtn.setAttribute('class', 'addRoom');
    addBtn.innerText = "追加";
    addBtn.setAttribute('onclick', `userSendClasslist('${weekArr[i]}${j}')`);
    parent.appendChild(addBtn);
    let roomBtn = document.createElement('button');
    roomBtn.setAttribute('type', 'button');
    roomBtn.setAttribute('id', `${parent.id}room`);
    roomBtn.setAttribute('class', 'classroom');
    roomBtn.innerText = "room";
    roomBtn.setAttribute('onclick', `sendRoom('${weekArr[i]}${j}')` );
    parent.appendChild(roomBtn);
    let changeBtn = document.createElement('button');
    changeBtn.setAttribute('type', 'button');
    changeBtn.setAttribute('id', `${parent.id}change`);
    changeBtn.setAttribute('class', 'changeroom');
    changeBtn.innerText = "変更";
    changeBtn.setAttribute('onclick', `sendClasslistChange('${weekArr[i]}${j}')` );
    parent.appendChild(changeBtn);
  }
}

document.getElementById("btn2").style.display = "none";
document.getElementById("btn1").addEventListener("click", function(){
  edit = true;
  document.getElementById("btn1").style.display = "none";
  document.getElementById("btn2").style.display = "block";
  buttonShow();
});

document.getElementById("btn2").addEventListener("click", function(){
  edit = false;
  document.getElementById("btn1").style.display = "block";
  document.getElementById("btn2").style.display = "none";
  buttonShow();
});

reloadTimeTable();
// -----------------------------------------------------------------------------------------------------------------------------




// ページ遷移時　と　タームが切り替え時　に属性を更新して、各種ボタンの表示非表示を設定
// -----------------------------------------------------------------------------------------------------------------------------
function reloadTimeTable() {
  // 表示クラス名のリセット
  for (let i=0; i<weekArr.length; i++) {
    for (let j=1; j<=6; j++) {
      document.getElementById(`${weekArr[i]}${j}name`).textContent = "";
    }
  }

  // 一旦すべて他のボタンを非表示にする
  for (let i=0; i<weekArr.length; i++) {
    for (let j=1; j<=6; j++) {
      document.getElementById(`${weekArr[i]}${j}room`).style.display = "none";
      document.getElementById(`${weekArr[i]}${j}add`).style.display = "none";
      document.getElementById(`${weekArr[i]}${j}change`).style.display = "none";
    }
  }

  // T1~T4のどれが選択されているのかを更新
  selectedTerm = document.getElementById("termSelect");
  // console.log("now ", selectedTerm.value, " selected!");
  
  // 履修に合わせてボタンを表示
  buttonShow();
}

function buttonShow(){
  // 追加・room・更新ボタンの表示/非表示を設定
  for (let i=0; i<weekArr.length; i++) {
    for (let j=1; j<=6; j++) {

      db.collection("account").where("uid", "==", uid)
      .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const myClassesArr = doc.data()['y2021MyClasses'];
          // console.log(myClassesArr);

          if (typeof doc.data()["y2021MyClasses"] === 'undefined') {
            document.getElementById(`${weekArr[i]}${j}add`).style.display = "block";
          } else {
            if (myClassesArr.length == 0) { // 何か履修登録してから全て消すと、配列の形だけ残って中身は消えるのでここに引っかかる
              document.getElementById(`${weekArr[i]}${j}add`).style.display = "block";
            }
            const period = weekArr[i] + j;
            judgeMyClassContain(period, myClassesArr);
          }
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    }
  }  
}

function judgeMyClassContain(period, myClassesArr) {
  const term_period = selectedTerm.value + period;
  for (let i=0; i<myClassesArr.length; i++) {
    // 自分が履修しているクラスのなかにはT1Mon1 == trueとかになるのは一つしかないことを利用
    db.collection("years").doc(year).collection("classes").where("classId", "==", Number(myClassesArr[i]))
    .get().then((querySnapshot) => {
      for (var k in querySnapshot.docs) {
        const doc = querySnapshot.docs[k];
        // console.log(doc.id);


      // querySnapshot.forEach((doc) => {
        if (doc.data()[`${term_period}`] == true) {
          document.getElementById(`${period}add`).style.display = "none";
              
          if(edit==false){
            document.getElementById(`${period}room`).style.display = "block";
            document.getElementById(`${period}change`).style.display = "none";
          } else {
            document.getElementById(`${period}room`).style.display = "none";
            document.getElementById(`${period}change`).style.display = "block";
          }
          
          document.getElementById(`${period}name`).textContent = doc.data()["name"];
          break;
        } else {
          // document.getElementById(`${period}add`).style.display = "block";
          // document.getElementById(`${period}room`).style.display = "none";
          // document.getElementById(`${period}change`).style.display = "none";
        }
      // });

        if (k + 1 == querySnapshot.docs.length && i + 1 == myClassesArr.length) {
          displayAddBtn(period);
        }

      }
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }
}
function displayAddBtn(period) {
  for (let i=0; i<weekArr.length; i++) {
    for (let j=1; j<=6; j++) {
      if (document.getElementById(`${weekArr[i]}${j}room`).style.display == "none" && document.getElementById(`${weekArr[i]}${j}change`).style.display == "none") {
        document.getElementById(`${weekArr[i]}${j}add`).style.display = "block";
      }
    }
  }
}
// -----------------------------------------------------------------------------------------------------------------------------




function userSendChat() {
  window.location.href ='../chat.html?name=' + encodeURIComponent(uid);
}

function userSendRoom(year_term_period, classId) {
  window.location.href ='../room.html?name=' + encodeURIComponent(uid) + "?period=" + encodeURIComponent(year_term_period) + "?classId=" + encodeURIComponent(classId);
}

function userSendClasslist(period) { // 追加ボタンを押された時の処理
  const year_term_period = year + selectedTerm.value + period;
  window.location.href ='../classlist.html?name=' + encodeURIComponent(uid) + "?period=" + encodeURIComponent(year_term_period);
}

function userSendClasslistChange(year_term_period, classId) {
  window.location.href ='../classlist.html?name=' + encodeURIComponent(uid) + "?period=" + encodeURIComponent(year_term_period) + "?classId=" + encodeURIComponent(classId);
}




function sendRoom(period){ // roomボタンを押された時の処理
  const term_period = selectedTerm.value + period;
  getMyClassIdArr(term_period);
}

function sendClasslistChange(period){ // 更新ボタンを押された時の処理
  const term_period = selectedTerm.value + period;
  getMyClassIdArr(term_period);
}

function getMyClassIdArr(term_period) {
  db.collection("account").where("uid", "==", uid)
  .get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const myClassesArr = doc.data()[`y${year}MyClasses`];
      console.log(myClassesArr);
      findCorrectClassId(term_period, myClassesArr);
    });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
}
function findCorrectClassId(term_period, myClassesArr) {
  for (let i=0; i<myClassesArr.length; i++) {
    // 自分が履修しているクラスのなかにはT1Mon1 == trueとかになるのは一つしかないことを利用
    db.collection("years").doc(year).collection("classes").where("classId", "==", Number(myClassesArr[i]))
    .get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data()[`${term_period}`] == true) {
          // 発見
          const year_term_period = year + term_period;

          // "edit==true" -> 更新ボタンが表示されていてそれを押したときの状態なので、更新の時こっち
          if (edit == true) {
            userSendClasslistChange(year_term_period, myClassesArr[i]);
          }

          // roomに飛ばすときこっち
          else {
            userSendRoom(year_term_period, myClassesArr[i]);
          }

        }
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }
}






function termSelectChange() {
  const selected = document.getElementById("termSelect");
  console.log(selected.value);
}





// let classDoacId = [
//   {time:"T1Mon1"},
//   {time:"T1Mon2"},
//   {time:"T1Mon3"},
//   {time:"T1Mon4"},
//   {time:"T1Mon5"},
//   {time:"T1Mon6"},

//   {time:"T2Mon1"},
//   {time:"T2Mon2"},
//   {time:"T2Mon3"},
//   {time:"T2Mon4"},
//   {time:"T2Mon5"},
//   {time:"T2Mon6"},

//   {time:"T3Mon1"},
//   {time:"T3Mon2"},
//   {time:"T3Mon3"},
//   {time:"T3Mon4"},
//   {time:"T3Mon5"},
//   {time:"T3Mon6"},

//   {time:"T4Mon1"},
//   {time:"T4Mon2"},
//   {time:"T4Mon3"},
//   {time:"T4Mon4"},
//   {time:"T4Mon5"},
//   {time:"T4Mon6"},


//   {time:"T1Tue1"},
//   {time:"T1Tue2"},
//   {time:"T1Tue3"},
//   {time:"T1Tue4"},
//   {time:"T1Tue5"},
//   {time:"T1Tue6"},

//   {time:"T2Tue1"},
//   {time:"T2Tue2"},
//   {time:"T2Tue3"},
//   {time:"T2Tue4"},
//   {time:"T2Tue5"},
//   {time:"T2Tue6"},

//   {time:"T3Tue1"},
//   {time:"T3Tue2"},
//   {time:"T3Tue3"},
//   {time:"T3Tue4"},
//   {time:"T3Tue5"},
//   {time:"T3Tue6"},

//   {time:"T4Tue1"},
//   {time:"T4Tue2"},
//   {time:"T4Tue3"},
//   {time:"T4Tue4"},
//   {time:"T4Tue5"},
//   {time:"T4Tue6"},


//   {time:"T1Wed1"},
//   {time:"T1Wed2"},
//   {time:"T1Wed3"},
//   {time:"T1Wed4"},
//   {time:"T1Wed5"},
//   {time:"T1Wed6"},

//   {time:"T2Wed1"},
//   {time:"T2Wed2"},
//   {time:"T2Wed3"},
//   {time:"T2Wed4"},
//   {time:"T2Wed5"},
//   {time:"T2Wed6"},

//   {time:"T3Wed1"},
//   {time:"T3Wed2"},
//   {time:"T3Wed3"},
//   {time:"T3Wed4"},
//   {time:"T3Wed5"},
//   {time:"T3Wed6"},

//   {time:"T4Wed1"},
//   {time:"T4Wed2"},
//   {time:"T4Wed3"},
//   {time:"T4Wed4"},
//   {time:"T4Wed5"},
//   {time:"T4Wed6"},


//   {time:"T1Thu1"},
//   {time:"T1Thu2"},
//   {time:"T1Thu3"},
//   {time:"T1Thu4"},
//   {time:"T1Thu5"},
//   {time:"T1Thu6"},

//   {time:"T2Thu1"},
//   {time:"T2Thu2"},
//   {time:"T2Thu3"},
//   {time:"T2Thu4"},
//   {time:"T2Thu5"},
//   {time:"T2Thu6"},

//   {time:"T3Thu1"},
//   {time:"T3Thu2"},
//   {time:"T3Thu3"},
//   {time:"T3Thu4"},
//   {time:"T3Thu5"},
//   {time:"T3Thu6"},

//   {time:"T4Thu1"},
//   {time:"T4Thu2"},
//   {time:"T4Thu3"},
//   {time:"T4Thu4"},
//   {time:"T4Thu5"},
//   {time:"T4Thu6"},


//   {time:"T1Fri1"},
//   {time:"T1Fri2"},
//   {time:"T1Fri3"},
//   {time:"T1Fri4"},
//   {time:"T1Fri5"},
//   {time:"T1Fri6"},

//   {time:"T2Fri1"},
//   {time:"T2Fri2"},
//   {time:"T2Fri3"},
//   {time:"T2Fri4"},
//   {time:"T2Fri5"},
//   {time:"T2Fri6"},

//   {time:"T3Fri1"},
//   {time:"T3Fri2"},
//   {time:"T3Fri3"},
//   {time:"T3Fri4"},
//   {time:"T3Fri5"},
//   {time:"T3Fri6"},

//   {time:"T4Fri1"},
//   {time:"T4Fri2"},
//   {time:"T4Fri3"},
//   {time:"T4Fri4"},
//   {time:"T4Fri5"},
//   {time:"T4Fri6"},
// ]