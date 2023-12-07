import { getName } from "@roninbuilders/rns"

const app = document.querySelector<HTMLDivElement>('#app')

const name = await getName('YOUR_RONIN_ADDRESS')

console.log("name: ", name)
if(app && name) app.innerHTML = name