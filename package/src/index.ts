import { type ParameterDescription, decodeParameters, encodeParameters, type Encodable } from '@zoltu/ethereum-abi-encoder'
import { ABI, ADDRESS, bufferToHex, createRequestOptions, hexToASCII, hexToUint8Array } from './helpers'

async function contractCall({
	hexFunction,
	RPCUrl,
	input,
	ABIParams,
	address,
}: { hexFunction: string; RPCUrl: string; input: Encodable; ABIParams: ParameterDescription[]; address: string }) {
	const encodedParameters = encodeParameters(ABIParams, [input])

	const requestOptions = createRequestOptions({ to: address, data: hexFunction + bufferToHex(encodedParameters) })
	const res = await fetch(RPCUrl, requestOptions)
	const result = JSON.parse(await res.text())
	if (!result || !result.result) return null

	return result.result
}

export async function getName(address: string, RPCUrl?: string) {
	const BASE_URL = RPCUrl ?? 'https://api.roninchain.com/rpc'

  let _address = address
  if(address.includes('ronin:')) _address = '0x' + address.slice(6)

	try {
		const arg = await contractCall({
			hexFunction: '0xd472ad04',
			RPCUrl: BASE_URL,
			input: BigInt(_address),
			ABIParams: ABI.RNSReverseRegistrar_computedId.inputs,
			address: ADDRESS.RNSReverseRegistrar,
		})
		if (!arg) throw new Error('response is undefined - calling RNS Unified')

		const hexRNS = await contractCall({
			hexFunction: '0x691f3431',
			RPCUrl: BASE_URL,
			input: BigInt(arg),
			ABIParams: ABI.publicResolver_name.inputs,
			address: ADDRESS.publicResolver,
		})

		if (!hexRNS) return hexRNS
		return hexToASCII(hexRNS)
	} catch (error) {
		console.error(error)
	}
}

export async function getAddr(rns: string, RPCUrl?: string) {
	const BASE_URL = RPCUrl ?? 'https://api.roninchain.com/rpc'

	try {
		const arg = await contractCall({
			hexFunction: '0x09879962',
			RPCUrl: BASE_URL,
			input: rns,
			ABIParams: ABI.RNSUnified_namehash.inputs,
			address: ADDRESS.RNSUnified,
		})
		if (!arg) throw new Error('response is undefined - calling RNS Unified')

		const address = await contractCall({
			hexFunction: '0x3b3b57de',
			RPCUrl: BASE_URL,
			input: BigInt(arg),
			ABIParams: ABI.publicResolver_addr.inputs,
			address: ADDRESS.publicResolver,
		})
    
		if (!address) return address
		const decodedAddress = decodeParameters(ABI.publicResolver_addr.outputs, hexToUint8Array(address))

		return '0x' + (decodedAddress.result)?.toString(16)
	} catch (error) {
		console.error(error)
	}
}

export function initRNS(RPCUrl: string) {
	return {
		getName: (address: string) => getName(address, RPCUrl),
		getAddr: (RNS: string) => getAddr(RNS, RPCUrl),
	}
}
