// 環境変数を参照するときは、`process.env`を使う
// 環境変数が存在しない場合は、falseになるので、
// そのままif文を使う

if (process.env.NIKKEIID) {
  console.log(process.env.NIKKEIID);
}

if (process.env.NIKKEIPASSWORD) {
  console.log(process.env.NIKKEIPASSWORD);
}

if (process.env.NIKKEIPASSWOR) {
  console.log(process.env.NIKKEIPASSWOR);
}
