type SpotifyAccessToken = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
};

async function getAccessToken(): Promise<SpotifyAccessToken> {
  const auth = Buffer.from(
    `${process.env.SPOTIFY_API_CLIENT_ID}:${process.env.SPOTIFY_API_CLIENT_SECRET}`
  ).toString("base64");

  const data = await fetch(`https://accounts.spotify.com/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  return (await data.json()) as SpotifyAccessToken;
}

async function getAlbumsByIds(
  ids: Array<string>
): Promise<SpotifyApi.MultipleAlbumsResponse> {
  const toRequestParam = ids.toString();
  const auth = (await getAccessToken()).access_token;
  const data = await fetch(
    `${process.env.SPOTIFY_API_BASE_URL}/v1/albums?ids=${toRequestParam}`,
    { method: "GET", headers: { Authorization: `Bearer ${auth}` } }
  );

  return data.json() as Promise<SpotifyApi.MultipleAlbumsResponse>;
}

export { getAlbumsByIds };
