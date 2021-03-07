let urlClass, period;
function getClasses() {
    // URLから授業情報を取得
    let query = location.search;
    let value = query.split('=');
    urlClass = value[2];
    if (urlClass.indexOf("?") != -1) {
        urlClass = urlClass.substring(0, urlClass.indexOf("?"));
    }
    period = value[3];
    console.log(urlClass);
    console.log(period);
}
getClasses();
