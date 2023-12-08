const { getName, getAddr } = require('./package/dist/index.cjs')

const address = 'ronin:a09a9b6f90ab23fcdcd6c3d087c1dfb65dddfb05'

async function init(){
  const rns = await getName(address)
  isEqual('jihoz.ron', rns)

  const addr = await getAddr(rns)
  isEqual(checkAddress(address), addr)
}

init()

function isEqual(a, b){
  console.log(`a is `, a)
  console.log(`b is `, b)
  if(typeof a === 'string' && typeof b === 'string'){
    console.log(`a length is `, a.length)
    console.log(`b length is `, b.length)
  }

  if(a !== b) throw new Error(`${a} is not equal to ${b}`)
  console.log(`${a} is equal to ${b}`)
}

function checkAddress(address){
  let _address = address
  if(address.includes('ronin:')) _address = '0x' + address.slice(6)
  return _address
}