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
    const v = parseInt(value.substring(i,i + 2), 16)
    if (v) str += String.fromCharCode(v)
  }
  return str
}

export function bufferToHex(buffer: Uint8Array) {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
}

export const ABI = {
	RNSReverseRegistrar: {
		inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
		name: 'computeId',
		outputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
		stateMutability: 'pure',
		type: 'function',
	},
	publicResolver: {
		inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
		name: 'name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
}

export const ADDRESS = {
	RNSReverseRegistrar: '0xb8618a73cc08d2c4097d5c0e0f32fa4af4547e2f',
	publicResolver: '0xadb077d236d9e81fb24b96ae9cb8089ab9942d48',
}
