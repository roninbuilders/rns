import { decodeParameters, encodeParameters } from '@zoltu/ethereum-abi-encoder'
import { ABI, ADDRESS, bufferToHex, createRequestOptions, hexToASCII, hexToUint8Array } from './helpers'

export async function getName(address: string, RPCUrl?: string) {
	const BASE_URL = RPCUrl ?? 'https://api.roninchain.com/rpc'

	try {
		const encodedParameters = encodeParameters(ABI.RNSReverseRegistrar_computedId.inputs, [BigInt(address)])
		const data = bufferToHex(encodedParameters)
		const final = '0xd472ad04' + data

		const requestOptions = createRequestOptions({ to: ADDRESS.RNSReverseRegistrar, data: final })
		const res = await fetch(BASE_URL, requestOptions)
		const result = await res.text()
		const arg = JSON.parse(result).result

		const encodedParameters2 = encodeParameters(ABI.publicResolver_name.inputs, [BigInt(arg)])
		const data2 = bufferToHex(encodedParameters2)
		const final2 = '0x691f3431' + data2

		const requestOptions2 = createRequestOptions({ to: ADDRESS.publicResolver, data: final2 })
		const res2 = await fetch(BASE_URL, requestOptions2)
		const result2 = await res2.text()
		const hexRNS = JSON.parse(result2).result?.slice(2)

    if(!hexRNS) return hexRNS
		return hexToASCII(hexRNS)
	} catch (error) {
		console.error(error)
	}
}

export async function getAddr(rns: string, RPCUrl?: string){
	const BASE_URL = RPCUrl ?? 'https://api.roninchain.com/rpc'

  try{
    const encodedParameters = encodeParameters(ABI.RNSUnified_namehash.inputs, [rns])
    const data = bufferToHex(encodedParameters)
    const final = '0x09879962' + data
    
    const requestOptions = createRequestOptions({ to: ADDRESS.RNSUnified, data: final })
    const res = await fetch(BASE_URL, requestOptions)
    const result = await res.text()
    const arg = JSON.parse(result)?.result
    if(!arg) throw new Error('response is undefined - calling RNS Unified')
    
    const encodedParameters2 = encodeParameters(ABI.publicResolver_addr.inputs, [BigInt(arg)])
    const data2 = bufferToHex(encodedParameters2)
    const final2 = '0x3b3b57de' + data2
  
    const requestOptions2 = createRequestOptions({ to: ADDRESS.publicResolver, data: final2 })
    const res2 = await fetch(BASE_URL, requestOptions2)
    const result2 = await res2.text()
    const address = JSON.parse(result2)?.result
  
    if(!address) return address
    const decodedAddress = decodeParameters([{ internalType: "address payable", name: "", type: "address" }], hexToUint8Array(address))
    return "0x" + decodedAddress
  } catch (error) {
		console.error(error)
	}
}

export function initRNS(RPCUrl: string){
  return {
    getName: (address: string)=>getName(address, RPCUrl),
    getAddr: (RNS: string)=>getAddr(RNS, RPCUrl)
  }
}