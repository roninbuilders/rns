const { getBalance } = require("./package/dist/index.cjs")

async function init(){
  const address = 'ronin:a09a9b6f90ab23fcdcd6c3d087c1dfb65dddfb05'
  const balance = await getBalance(address)
  console.log(balance)
}

init()