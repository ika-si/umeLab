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
// const db = firebase.firestore();


fileReader.onload = () => {

  let inputClassDetail = fileReader.result;
  console.log(inputClassDetail);
  const classData = csv_array(inputClassDetail);
  // console.log(classData[0]);
  // console.log(classData[1][0]);

  // 各クラスのデータをcsvファイルをもとに作成する処理
  // for (let i=1; i<classData.length-1; i++) { // なんか最後空白行が入ってしまうので-1している　T1.3.4分
  for (let i=1676; i<classData.length-1; i++) { // なんか最後空白行が入ってしまうので-1している T2分
    let containTermPeriod = [
      [false, false, false, false], // Mon1
      [false, false, false, false], // Mon2
      [false, false, false, false], // Mon3
      [false, false, false, false], // Mon4
      [false, false, false, false], // Mon5
      [false, false, false, false], // Mon6
      [false, false, false, false], // Tue1
      [false, false, false, false], // Tue2
      [false, false, false, false], // Tue3
      [false, false, false, false], // Tue4
      [false, false, false, false], // Tue5
      [false, false, false, false], // Tue6
      [false, false, false, false], // Wed1
      [false, false, false, false], // Wed2
      [false, false, false, false], // Wed3
      [false, false, false, false], // Wed4
      [false, false, false, false], // Wed5
      [false, false, false, false], // Wed6
      [false, false, false, false], // Thu1
      [false, false, false, false], // Thu2
      [false, false, false, false], // Thu3
      [false, false, false, false], // Thu4
      [false, false, false, false], // Thu5
      [false, false, false, false], // Thu6
      [false, false, false, false], // Fri1
      [false, false, false, false], // Fri2
      [false, false, false, false], // Fri3
      [false, false, false, false], // Fri4
      [false, false, false, false], // Fri5
      [false, false, false, false], // Fri6
    ];

    let termPeriod = [
      ['T1Mon1', 'T2Mon1', 'T3Mon1', 'T4Mon1'],
      ['T1Mon2', 'T2Mon2', 'T3Mon2', 'T4Mon2'],
      ['T1Mon3', 'T2Mon3', 'T3Mon3', 'T4Mon3'],
      ['T1Mon4', 'T2Mon4', 'T3Mon4', 'T4Mon4'],
      ['T1Mon5', 'T2Mon5', 'T3Mon5', 'T4Mon5'],
      ['T1Mon6', 'T2Mon6', 'T3Mon6', 'T4Mon6'],

      ['T1Tue1', 'T2Tue1', 'T3Tue1', 'T4Tue1'],
      ['T1Tue2', 'T2Tue2', 'T3Tue2', 'T4Tue2'],
      ['T1Tue3', 'T2Tue3', 'T3Tue3', 'T4Tue3'],
      ['T1Tue4', 'T2Tue4', 'T3Tue4', 'T4Tue4'],
      ['T1Tue5', 'T2Tue5', 'T3Tue5', 'T4Tue5'],
      ['T1Tue6', 'T2Tue6', 'T3Tue6', 'T4Tue6'],

      ['T1Wed1', 'T2Wed1', 'T3Wed1', 'T4Wed1'],
      ['T1Wed2', 'T2Wed2', 'T3Wed2', 'T4Wed2'],
      ['T1Wed3', 'T2Wed3', 'T3Wed3', 'T4Wed3'],
      ['T1Wed4', 'T2Wed4', 'T3Wed4', 'T4Wed4'],
      ['T1Wed5', 'T2Wed5', 'T3Wed5', 'T4Wed5'],
      ['T1Wed6', 'T2Wed6', 'T3Wed6', 'T4Wed6'],

      ['T1Thu1', 'T2Thu1', 'T3Thu1', 'T4Thu1'],
      ['T1Thu2', 'T2Thu2', 'T3Thu2', 'T4Thu2'],
      ['T1Thu3', 'T2Thu3', 'T3Thu3', 'T4Thu3'],
      ['T1Thu4', 'T2Thu4', 'T3Thu4', 'T4Thu4'],
      ['T1Thu5', 'T2Thu5', 'T3Thu5', 'T4Thu5'],
      ['T1Thu6', 'T2Thu6', 'T3Thu6', 'T4Thu6'],

      ['T1Fri1', 'T2Fri1', 'T3Fri1', 'T4Fri1'],
      ['T1Fri2', 'T2Fri2', 'T3Fri2', 'T4Fri2'],
      ['T1Fri3', 'T2Fri3', 'T3Fri3', 'T4Fri3'],
      ['T1Fri4', 'T2Fri4', 'T3Fri4', 'T4Fri4'],
      ['T1Fri5', 'T2Fri5', 'T3Fri5', 'T4Fri5'],
      ['T1Fri6', 'T2Fri6', 'T3Fri6', 'T4Fri6'],
    ];

    let isOtherPeriod = false;
    let tpArr = [];
    if (classData[i][7].trim() == "他") {
      // console.log("skip!");
      isOtherPeriod = true;
    } else {
      tpArr = classData[i][7].trim().split('/');
      // console.log(tpArr);
      for (let t=0; t<tpArr.length; t++) {
        for (let k=0; k<30; k++) {
          for (let j=0; j<4; j++) {
            if (tpArr[t] == termPeriod[k][j]) {
              containTermPeriod[k][j] = true;
            }
          }
        }
      }
      // console.log(containTermPeriod);
    }



    db.collection("years").doc("2021").collection("classes").add({
    // db.collection("rooms").doc(classData[i][0]).collection("classes").add({
      id: classData[i][0],
      classId: Number(classData[i][1]),
      name: classData[i][2],
      teacher: classData[i][3],
      credit: Number(classData[i][4]),
      style: classData[i][5],
      url: classData[i][6],

      // termperiod: 
      isOtherPeriod: isOtherPeriod,
      termPeriodArr: tpArr,

      T1Mon1: containTermPeriod[0][0],
      T2Mon1: containTermPeriod[0][1],
      T3Mon1: containTermPeriod[0][2],
      T4Mon1: containTermPeriod[0][3],

      T1Mon2: containTermPeriod[1][0],
      T2Mon2: containTermPeriod[1][1],
      T3Mon2: containTermPeriod[1][2],
      T4Mon2: containTermPeriod[1][3],

      T1Mon3: containTermPeriod[2][0],
      T2Mon3: containTermPeriod[2][1],
      T3Mon3: containTermPeriod[2][2],
      T4Mon3: containTermPeriod[2][3],

      T1Mon4: containTermPeriod[3][0],
      T2Mon4: containTermPeriod[3][1],
      T3Mon4: containTermPeriod[3][2],
      T4Mon4: containTermPeriod[3][3],

      T1Mon5: containTermPeriod[4][0],
      T2Mon5: containTermPeriod[4][1],
      T3Mon5: containTermPeriod[4][2],
      T4Mon5: containTermPeriod[4][3],

      T1Mon6: containTermPeriod[5][0],
      T2Mon6: containTermPeriod[5][1],
      T3Mon6: containTermPeriod[5][2],
      T4Mon6: containTermPeriod[5][3],

      T1Tue1: containTermPeriod[6][0],
      T2Tue1: containTermPeriod[6][1],
      T3Tue1: containTermPeriod[6][2],
      T4Tue1: containTermPeriod[6][3],

      T1Tue2: containTermPeriod[7][0],
      T2Tue2: containTermPeriod[7][1],
      T3Tue2: containTermPeriod[7][2],
      T4Tue2: containTermPeriod[7][3],

      T1Tue3: containTermPeriod[8][0],
      T2Tue3: containTermPeriod[8][1],
      T3Tue3: containTermPeriod[8][2],
      T4Tue3: containTermPeriod[8][3],

      T1Tue4: containTermPeriod[9][0],
      T2Tue4: containTermPeriod[9][1],
      T3Tue4: containTermPeriod[9][2],
      T4Tue4: containTermPeriod[9][3],

      T1Tue5: containTermPeriod[10][0],
      T2Tue5: containTermPeriod[10][1],
      T3Tue5: containTermPeriod[10][2],
      T4Tue5: containTermPeriod[10][3],

      T1Tue6: containTermPeriod[11][0],
      T2Tue6: containTermPeriod[11][1],
      T3Tue6: containTermPeriod[11][2],
      T4Tue6: containTermPeriod[11][3],

      T1Wed1: containTermPeriod[12][0],
      T2Wed1: containTermPeriod[12][1],
      T3Wed1: containTermPeriod[12][2],
      T4Wed1: containTermPeriod[12][3],

      T1Wed2: containTermPeriod[13][0],
      T2Wed2: containTermPeriod[13][1],
      T3Wed2: containTermPeriod[13][2],
      T4Wed2: containTermPeriod[13][3],

      T1Wed3: containTermPeriod[14][0],
      T2Wed3: containTermPeriod[14][1],
      T3Wed3: containTermPeriod[14][2],
      T4Wed3: containTermPeriod[14][3],

      T1Wed4: containTermPeriod[15][0],
      T2Wed4: containTermPeriod[15][1],
      T3Wed4: containTermPeriod[15][2],
      T4Wed4: containTermPeriod[15][3],

      T1Wed5: containTermPeriod[16][0],
      T2Wed5: containTermPeriod[16][1],
      T3Wed5: containTermPeriod[16][2],
      T4Wed5: containTermPeriod[16][3],

      T1Wed6: containTermPeriod[17][0],
      T2Wed6: containTermPeriod[17][1],
      T3Wed6: containTermPeriod[17][2],
      T4Wed6: containTermPeriod[17][3],

      T1Thu1: containTermPeriod[18][0],
      T2Thu1: containTermPeriod[18][1],
      T3Thu1: containTermPeriod[18][2],
      T4Thu1: containTermPeriod[18][3],

      T1Thu2: containTermPeriod[19][0],
      T2Thu2: containTermPeriod[19][1],
      T3Thu2: containTermPeriod[19][2],
      T4Thu2: containTermPeriod[19][3],

      T1Thu3: containTermPeriod[20][0],
      T2Thu3: containTermPeriod[20][1],
      T3Thu3: containTermPeriod[20][2],
      T4Thu3: containTermPeriod[20][3],

      T1Thu4: containTermPeriod[21][0],
      T2Thu4: containTermPeriod[21][1],
      T3Thu4: containTermPeriod[21][2],
      T4Thu4: containTermPeriod[21][3],

      T1Thu5: containTermPeriod[22][0],
      T2Thu5: containTermPeriod[22][1],
      T3Thu5: containTermPeriod[22][2],
      T4Thu5: containTermPeriod[22][3],

      T1Thu6: containTermPeriod[23][0],
      T2Thu6: containTermPeriod[23][1],
      T3Thu6: containTermPeriod[23][2],
      T4Thu6: containTermPeriod[23][3],

      T1Fri1: containTermPeriod[24][0],
      T2Fri1: containTermPeriod[24][1],
      T3Fri1: containTermPeriod[24][2],
      T4Fri1: containTermPeriod[24][3],

      T1Fri2: containTermPeriod[25][0],
      T2Fri2: containTermPeriod[25][1],
      T3Fri2: containTermPeriod[25][2],
      T4Fri2: containTermPeriod[25][3],

      T1Fri3: containTermPeriod[26][0],
      T2Fri3: containTermPeriod[26][1],
      T3Fri3: containTermPeriod[26][2],
      T4Fri3: containTermPeriod[26][3],

      T1Fri4: containTermPeriod[27][0],
      T2Fri4: containTermPeriod[27][1],
      T3Fri4: containTermPeriod[27][2],
      T4Fri4: containTermPeriod[27][3],

      T1Fri5: containTermPeriod[28][0],
      T2Fri5: containTermPeriod[28][1],
      T3Fri5: containTermPeriod[28][2],
      T4Fri5: containTermPeriod[28][3],

      T1Fri6: containTermPeriod[29][0],
      T2Fri6: containTermPeriod[29][1],
      T3Fri6: containTermPeriod[29][2],
      T4Fri6: containTermPeriod[29][3]
    })
    .then(() => {
      console.log("Document successfully written!");
    })
      .catch((error) => {
    console.error("Error writing document: ", error);
    });
  }



  // // 各クラスに collection"chat" と　collection"users"　を追加する処理
  // const periodData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  // for (let i=0; i<5; i++) {
  //   for (let j=0; j<=5; j++) { // あれ、5限までだっけ

  //     db.collection("rooms").doc(periodData[i]+j).collection("classes")
  //     .get()
  //     .then((querySnapshot) => {
  //         querySnapshot.forEach((doc) => {

  //             db.collection("rooms").doc(periodData[i]+j).collection("classes").doc(doc.id).collection("chat").add({
  //               name:"test",
  //               msg:"testです",
  //               createdAt:"2021年2月4日 00:00:00 UTC+9"
  //             })
  //             .then(() => {
  //               console.log("Document successfully written!");
  //             })
  //             .catch((error) => {
  //               console.error("Error writing document: ", error);
  //             });

  //             db.collection("rooms").doc(periodData[i]+j).collection("classes").doc(doc.id).collection("users").add({
  //               name: "test",
  //               uid: "hogehogehogehogehoge"
  //             })
  //             .then(() => {
  //               console.log("Document successfully written!");
  //             })
  //             .catch((error) => {
  //               console.error("Error writing document: ", error);
  //             });

  //         });
  //     })
  //     .catch((error) => {
  //         console.log("Error getting documents: ", error);
  //     });

  //   }
  // }

}
