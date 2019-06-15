var str = "https://www.kahoku.co.jp/tohokunews/201906/20190615_43041.html";
const regexp = /([0-9_]+)\./g;

let match;
match = regexp.exec(str);

console.log(match[0]);
