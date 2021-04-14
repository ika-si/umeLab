// url を書き換える処理

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

  // add zoom url
  for (let i=1; i<classData.length-1; i++) {
    // Coming Soon... から書き換わっているものだけ更新する
    if (classData[i][6].substring(0,6) != "Coming") {

      db.collection("year").doc("2021").collection("classes").doc(classData[i][1]).set({
        url: classData[i][6]
      }, {merge: true})
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });

    }
  }

}
