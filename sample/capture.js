const puppeteer = require('puppeteer');
const fs = require('fs')

// コマンドライン引数から対象URLを取得する
if (process.argv.length != 3) {
  console.log("対象URLをコマンドライン引数に指定してください");
  process.exit(1);
}
const URL = process.argv[2];

(async () => {
  // puppeteerの起動
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // コマンドライン引数で指定したURLにアクセスする
  await page.goto(URL, {waitUntil: "domcontentloaded"});

  // タイトルの取得
  var title = await page.$eval('h2.ttl', item => {
    return item.textContent;
  });

  // 本文テキストの取得
  var data = await page.$eval('.txt', item => {
    return item.textContent;
  });

  data = URL + "\n" + title + "\n\n" + data;

  fs.writeFile('out.txt', data, (err, data) => {
    if(err) console.log(err);
  });

  // puppeteerを閉じる
  await browser.close();
})();
