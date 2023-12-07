
export async function getName(address: string, { path = 'rpc', apiKey }: { path?: string, apiKey?: string } = {}) {
	const BASE_URL = apiKey ? `https://api-gateway.skymavis.com/${path}?apikey=${apiKey}` : 'https://api.roninchain.com/rpc'
 console.log(path)

}
