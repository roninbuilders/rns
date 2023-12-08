export function createRequestOptions({ to, data }: { to: string; data: string }) {
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')

	const raw = JSON.stringify({
		method: 'eth_call',
		params: [
			{
				from: null,
				to: to,
				data: data,
			},
			'latest',
		],
		id: 1,
		jsonrpc: '2.0',
	})

	return {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow',
	} as RequestInit
}

export function hexToASCII(value: string) {
	let str = ''
	for (let i = 0; i < value.length; i += 2) {
		const v = parseInt(value.substring(i, i + 2), 16)
		if (v) str += String.fromCharCode(v)
	}
	return str
}

export function bufferToHex(buffer: Uint8Array) {
	return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('')
}

export function hexToUint8Array(hex: string) {
	const match = /^(?:0x)?([a-fA-F0-9]*)$/.exec(hex)
	if (!match) throw new Error('Error while converting hex to Uint8Array - match is undefined')
	const normalized = match[1]
	if (!normalized) throw new Error('Error while converting hex to Uint8Array - normalized is undefined')
	const bytes = []
	for (let i = 0; i < normalized.length; i += 2) {
		bytes.push(Number.parseInt(`${normalized[i]}${normalized[i + 1]}`, 16))
	}
	const result = new Uint8Array(bytes.length)
	result.set(bytes, 0)

	return result
}

export const ABI = {
	RNSReverseRegistrar_computedId: {
		inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
		name: 'computeId',
		outputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
		stateMutability: 'pure',
		type: 'function',
	},
	publicResolver_name: {
		inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
		name: 'name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	publicResolver_addr: {
		inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
		name: 'addr',
		outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	RNSUnified_namehash: {
		inputs: [{ internalType: 'string', name: 'str', type: 'string' }],
		name: 'namehash',
		outputs: [{ internalType: 'bytes32', name: 'hashed', type: 'bytes32' }],
		stateMutability: 'pure',
		type: 'function',
	},
}

export const ADDRESS = {
	RNSReverseRegistrar: '0xb8618a73cc08d2c4097d5c0e0f32fa4af4547e2f',
	publicResolver: '0xadb077d236d9e81fb24b96ae9cb8089ab9942d48',
	RNSUnified: '0x67c409dab0ee741a1b1be874bd1333234cfdbf44',
}
