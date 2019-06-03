// コマンドライン引数が一つの場合は、
// `process.argv.length`が3になる
if (process.argv.length == 3) {
  // コマンドライン引数の添字は2になる
  console.log(process.argv[2])
}
