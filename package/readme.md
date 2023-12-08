```sh
pnpm add @roninbuilders/rns
```

You can call the functions directly
```ts
import { getName, getAddr } from '@roninbuilders/rns'

const myRNS = await getName('MY_RONIN_ADDRESS')

const myAddress = await getAddr(myRNS)
```


Or instantiate an object with a fixed RPC url:
```ts
import { initRNS } from '@roninbuilders/rns'

const RPCUrl = '...'
const rns = initRNS(RPCUrl)

const myAddress = await rns.getAddr('myRNS.ron')

const myRNS = await rns.getName(myAddress)
```