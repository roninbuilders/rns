import { encodeParameters } from '@zoltu/ethereum-abi-encoder'
import { ABI, ADDRESS, bufferToHex, createRequestOptions, hexToASCII } from './helpers'

export async function getName(address: string, { path = 'rpc', apiKey }: { path?: string, apiKey?: string } = {}) {
	const BASE_URL = apiKey ? `https://api-gateway.skymavis.com/${path}?apikey=${apiKey}` : 'https://api.roninchain.com/rpc'

	try {
		const encodedParameters = encodeParameters(ABI.RNSReverseRegistrar.inputs, [BigInt(address)])
		const data = bufferToHex(encodedParameters)
		const final = '0xd472ad04' + data

		const requestOptions = createRequestOptions({ to: ADDRESS.RNSReverseRegistrar, data: final })
		const res = await fetch(BASE_URL, requestOptions)
		const result = await res.text()
		const arg = JSON.parse(result).result

		const encodedParameters2 = encodeParameters(ABI.publicResolver.inputs, [BigInt(arg)])
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
