import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const SPOTIFY_ID = process.env.SPOTIFY_API_CLIENT_ID;
const SPOTIFY_SECRET = process.env.SPOTIFY_API_CLIENT_SECRET;

export const spotifyClient = SpotifyApi.withClientCredentials(
  SPOTIFY_ID,
  SPOTIFY_SECRET,
);

async function getAlbumsByIds(ids: Array<string>) {
  const albumsResponse = await spotifyClient.albums.get(ids, "US");
  const albums = albumsResponse.map((a) => ({
    image: a.images[0],
    altName: a.name,
    href: a.external_urls.spotify,
    name: a.name,
    artists: a.artists.map((artist) => artist.name).join(", "),
  }));

  return albums;
}

export { getAlbumsByIds };
