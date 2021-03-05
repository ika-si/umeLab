// index.html 内に以下の記述がある
// ->  <input type="file" id="csvFile">
// ->  <script src="./js/getCsv.js"></script>
// 参考： https://techacademy.jp/magazine/28267
// 参考： https://qiita.com/hiroyuki-n/items/5786c8fc84eb85944681

let fileInput = document.getElementById('csvFile');
let fileReader = new FileReader();
fileInput.onchange = () => {
  let file = fileInput.files[0];
  fileReader.readAsText(file);
};

function csv_array(data) {
  const inputCsvDataArray = []; //配列を用意
  const dataString = data.split('\n'); //改行で分割
  for (let i = 0; i < dataString.length; i++) { //あるだけループ
      inputCsvDataArray[i] = dataString[i].split(',');
  }
  // console.log(inputCsvDataArray);
  return inputCsvDataArray;
}

let classData;
const db = firebase.firestore();


fileReader.onload = () => {

  let inputClassDetail = fileReader.result;
  console.log(inputClassDetail);
  const classData = csv_array(inputClassDetail);
  // console.log(classData[0]);
  // console.log(classData[1][0]);

  // 各クラスのデータをcsvファイルをもとに作成する処理
  for (let i=1; i<classData.length; i++) {
    db.collection("rooms").doc(classData[i][0]).collection("classes").doc(classData[i][1]).set({
    // ※フィールドに入れる id と同じデータを各クラスのドキュメント名とする(t1m1201等)
      id: classData[i][1],
      classId: classData[i][2],
      name: classData[i][3],
      term: classData[i][4],
      period: classData[i][5],
      teacher: classData[i][6]
    })
    .then(() => {
      console.log("Document successfully written!");
    })
      .catch((error) => {
    console.error("Error writing document: ", error);
    });
  }

  // 各クラスに collection"chat" と　collection"users"　を追加する処理
  const periodData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  for (let i=0; i<5; i++) {
    for (let j=0; j<=5; j++) { // あれ、5限までだっけ

      db.collection("rooms").doc(periodData[i]+j).collection("classes")
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {

              db.collection("rooms").doc(periodData[i]+j).collection("classes").doc(doc.id).collection("chat").add({
                name:"test",
                msg:"testです",
                createdAt:"2021年2月4日 00:00:00 UTC+9"
              })
              .then(() => {
                console.log("Document successfully written!");
              })
              .catch((error) => {
                console.error("Error writing document: ", error);
              });

              db.collection("rooms").doc(periodData[i]+j).collection("classes").doc(doc.id).collection("users").add({
                name: "test",
                uid: "hogehogehogehogehoge"
              })
              .then(() => {
                console.log("Document successfully written!");
              })
              .catch((error) => {
                console.error("Error writing document: ", error);
              });

          });
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });

    }
  }

}