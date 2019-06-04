var str = "https://www.nikkei.com/article/DGKKZO45645560T00C19A6FF1000/";
const regexp = /([A-Z0-9]+)/g;

let match;
match = regexp.exec(str);

console.log(match[0]);
