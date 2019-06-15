const puppeteer = require('puppeteer');
const fs = require('fs');

// コマンドライン引数から対象URLを取得する
if (process.argv.length != 3) {
  console.log("対象URLをコマンドライン引数に指定してください");
  process.exit(1);
}
const URL = process.argv[2];

// ファイル名の生成
const regexp = /([0-9_]+)\./g;
let match;
match = regexp.exec(URL);

const ARTICLEID = match[0];


(async () => {
  // puppeteerの起動
  console.log("Puppeteerを起動しています");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
  });

  try{
    const page = await browser.newPage();

    // コマンドライン引数で指定したURLにアクセスする
    console.log("URLにアクセスします");
    await page.goto(URL, {waitUntil: "domcontentloaded"});

    // 記事ページのスクリーンショットを取得
    console.log("スクリーンショットを取得します");
    await page.screenshot({
      path: ARTICLEID + 'png',
      fullPage: true
    });

    // タイトルの取得
    console.log("タイトルを取得します");
    var title = await page.$eval('h2.ttl', item => {
      return item.innerText;
    });

    // 本文の取得
    console.log("本文を取得します");
    var body = await page.$eval('.txt', item => {
      return item.innerText;
    });

    // ファイルの書き込み
    console.log("ファイルに書き込みます");
    var data = URL + "\n" + title + "\n\n" + body;
    await fs.writeFile(ARTICLEID + 'txt', data, (err, data) => {
      if(err) console.log(err);
    });

  } catch(e) {
    throw e;
  } finally {
    // puppeteerを閉じる
    console.log("Puppeteerを閉じます");
    await browser.close();
  }
})();
