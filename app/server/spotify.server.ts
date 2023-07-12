type SpotifyAccessToken = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
};

const SPOTIFY_ID = process.env.SPOTIFY_API_CLIENT_ID;
const SPOTIFY_SECRET = process.env.SPOTIFY_API_CLIENT_SECRET;
const SPOTIFY_API_BASE_URL = process.env.SPOTIFY_API_BASE_URL;

async function getAccessToken(): Promise<SpotifyAccessToken> {
  const auth = Buffer.from([SPOTIFY_ID, SPOTIFY_SECRET].join(":")).toString(
    "base64",
  );

  const tokenUrl = new URL("https://accounts.spotify.com/api/token");
  const params = new URLSearchParams({
    grant_type: "client_credentials",
  });

  const data = await fetch(tokenUrl, {
    method: "POST",
    body: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
  });

  return (await data.json()) as SpotifyAccessToken;
}

async function getAlbumsByIds(
  ids: Array<string>,
): Promise<SpotifyApi.MultipleAlbumsResponse> {
  const toRequestParam = ids.join(",");
  const auth = (await getAccessToken()).access_token;
  const requestUrl = new URL(`${SPOTIFY_API_BASE_URL}/v1/albums`);
  requestUrl.searchParams.append("ids", toRequestParam);

  const data = await fetch(requestUrl, {
    method: "GET",
    headers: { Authorization: `Bearer ${auth}` },
  });

  return data.json() as Promise<SpotifyApi.MultipleAlbumsResponse>;
}

export { getAlbumsByIds };
