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


function pageOnload() { // account.js内で呼ばれる処理

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
}
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
      mydocRef.get().then((doc) => {
        if (doc.exists) {
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

        } else {
            console.log("No such document!");
        }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });

    }
  }  
}

function judgeMyClassContain(period, myClassesArr) {
  const term_period = selectedTerm.value + period;
  db.collection("year").doc(year).get().then((doc) => {
    if (doc.exists) {
        // 自分の履修クラス配列とタームピリオドに開講される授業配列のなかに一致するものがあればそのタームピリオドに自分が履修しているということを利用
        let tpContainArr = doc.data()[`${term_period}Arr`];
        for (let i=0; i<tpContainArr.length; i++) {
          for (let j=0; j<myClassesArr.length; j++) {

            if (tpContainArr[i] == myClassesArr[j]) {
              console.log(period + " " +tpContainArr[i]);
              document.getElementById(`${period}add`).style.display = "none";
              
              if(edit==false){
                document.getElementById(`${period}room`).style.display = "block";
                document.getElementById(`${period}change`).style.display = "none";
              } else {
                document.getElementById(`${period}room`).style.display = "none";
                document.getElementById(`${period}change`).style.display = "block";
              }
              
              db.collection("year").doc(year).collection("classes").doc(tpContainArr[i]).get().then((doc2) => {
                if (doc2.exists) {
                  console.log(doc2.data()["name"]);
                  document.getElementById(`${period}name`).textContent = doc2.data()["name"];
                } else {
                    console.log("No such document!");
                }
              }).catch((error) => {
                  console.log("Error getting document:", error);
              });

              break;
            }

            if (i + 1 == tpContainArr.length && j + 1 == myClassesArr.length) {
              displayAddBtn(period);
            }

          }
        }

    } else {
        console.log("No such document!");
    }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
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

function userSendRoom(year_term_period, id) {
  window.location.href ='../room.html?name=' + encodeURIComponent(uid) + "?period=" + encodeURIComponent(year_term_period) + "?id=" + encodeURIComponent(id);
}

function userSendClasslist(period) { // 追加ボタンを押された時の処理
  const year_term_period = year + selectedTerm.value + period;
  window.location.href ='../classlist.html?name=' + encodeURIComponent(uid) + "?period=" + encodeURIComponent(year_term_period);
}

function userSendClasslistChange(year_term_period, id) {
  window.location.href ='../classlist.html?name=' + encodeURIComponent(uid) + "?period=" + encodeURIComponent(year_term_period) + "?id=" + encodeURIComponent(id);
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
  mydocRef.get().then((doc) => {
    if (doc.exists) {
      const myClassesArr = doc.data()[`y${year}MyClasses`];
      console.log(myClassesArr);
      findCorrectId(term_period, myClassesArr);
    } else {
        console.log("No such document!");
    }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}
function findCorrectId(term_period, myClassesArr) {
  for (let i=0; i<myClassesArr.length; i++) {

    db.collection("year").doc(year).get().then((doc) => {
      if (doc.exists) {
          let tpContainArr = doc.data()[`${term_period}Arr`];
          console.log(tpContainArr);
          for (let j=0; j<tpContainArr.length; j++) {
            if (myClassesArr[i] == tpContainArr[j]) {
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
          }

          
  
      } else {
          console.log("No such document!");
      }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

  }
}



function termSelectChange() {
  const selected = document.getElementById("termSelect");
  console.log(selected.value);
}
