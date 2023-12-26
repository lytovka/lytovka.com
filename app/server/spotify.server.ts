import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const SPOTIFY_ID = process.env.SPOTIFY_API_CLIENT_ID;
const SPOTIFY_SECRET = process.env.SPOTIFY_API_CLIENT_SECRET;

const spotifyClient = SpotifyApi.withClientCredentials(
  SPOTIFY_ID,
  SPOTIFY_SECRET,
);

async function getAlbumsByIds(ids: Array<string>) {
  const albums = await spotifyClient.albums.get(ids);

  return albums;
}

export { getAlbumsByIds };
