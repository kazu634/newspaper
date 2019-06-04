const puppeteer = require('puppeteer');
const fs = require('fs');

// 環境変数チェック
if (!process.env.NIKKEIID) {
  console.log("環境変数NIKKEIIDにIDを指定してください");
  process.exit(1);
}
const ID = process.env.NIKKEIID;

if (!process.env.NIKKEIPASSWORD) {
  console.log("環境変数NIKKEIPASSWORDにパスワードを指定してください");
  process.exit(1);
}
const PASSWORD = process.env.NIKKEIPASSWORD;

// コマンドライン引数から対象URLを取得する
if (process.argv.length != 3) {
  console.log("対象URLをコマンドライン引数に指定してください");
  process.exit(1);
}
const URL = process.argv[2];

// ファイル名の生成
const regexp = /([A-Z0-9]+)/g;
let match;
match = regexp.exec(URL);

const ARTICLEID = match[0];


(async () => {
  // puppeteerの起動
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // コマンドライン引数で指定したURLにアクセスする
  await page.goto(URL);
  await page.waitForSelector('#JSID_LOGIN', {visible: true});

  // ログインボタンをクリックする
  await page.click('a[id="JSID_LOGIN"]', {waitUntil: "domcontentloaded"})
  await page.waitForNavigation({timeout: 6000, waitUntil: "domcontentloaded"});

  // ログインページでID・パスワードを入力
  await page.type("[id='LA7010Form01:LA7010Email']", ID, {delay: 100})
  await page.type("[id='LA7010Form01:LA7010Password']", PASSWORD, {delay: 100})

  // const body = await page.evaluate(() => {
  //   return document.querySelector('body').innerHTML;
  // });
  // console.log(body);
  // ログインボタンをクリックする
  await page.evaluate(() => {
    document.querySelector('.btnM1').click();
  });
  // await page.click('.btnM1')
  await page.waitForNavigation({timeout: 6000, waitUntil: "domcontentloaded"});

  // 記事ページのスクリーンショットを取得
  await page.screenshot({
    path: ARTICLEID + '.png',
    fullPage: true
  });

  // タイトルの取得
  var title = await page.$eval('h1.cmn-article_title > span', item => {
    return item.innerText;
  });

  // 本文の取得
  var body = await page.$eval('div.cmn-article_text', item => {
    return item.innerText;
  });

  // ファイルの書き込み
  var data = URL + "\n" + title + "\n\n" + body;
  await fs.writeFile(ARTICLEID + '.txt', data, (err, data) => {
    if(err) console.log(err);
  });

  // ログオフメニューを表示する
  await page.click('#JSID_UserMenu > a')
  await page.waitForSelector('#JSID_l-miH02_H02c_userMenu', {visible: true});

  // ログオフを選択する
  await page.evaluate(() => {
    document.querySelector('#JSID_l-miH02_H02c_userMenu > div > div > div > div > div > a').click();
  });
  await page.waitForNavigation({timeout: 6000, waitUntil: "domcontentloaded"});

  // puppeteerを閉じる
  await browser.close();
})();
