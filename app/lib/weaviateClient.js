import weaviate, { ApiKey } from 'weaviate-ts-client';

const weaviateURL = process.env.WEAVIATE_URL;
const weaviateApiKey = process.env.WEAVIATE_API_KEY;

const client = weaviate.client({
  scheme: 'https',
  host: weaviateURL,
  apiKey: new ApiKey(weaviateApiKey),
});

console.log("Client is ready?", await client.misc.readyChecker().do())

export default client;