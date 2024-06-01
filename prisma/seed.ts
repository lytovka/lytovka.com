import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export const prisma = new PrismaClient();

const WISHLIST_STATUS = ["Wanted", "Received", "Fulfilled"] as const;
const TAGS = ["Electronics", "Books", "Misc"] as const;

async function seedTags() {
  console.time("Seeding tags");
  const tags = await Promise.all(
    Array.from({ length: TAGS.length }).map((_, index) =>
      prisma.tag.create({ data: { name: TAGS[index] } }),
    ),
  );
  console.timeEnd("Seeding tags");

  return tags;
}

async function seedAlbums() {
  const ALBUMS = [
    {
      name: "Definitely Maybe",
      spotifyId: "3LzKUdUTdJb6P7xGN6SotC",
      description: "Best album of all time!",
    },
    {
      name: "WTSMG",
      spotifyId: "2u30gztZTylY4RG7IvfXs8",
    },
    {
      name: "Be Here Now",
      spotifyId: "021D07OEcg0c4tUCilc7ah",
    },
    {
      name: "The Masterplan",
      spotifyId: "15D0D1mafSX8Vx5a7w2ZR4",
    },
    {
      name: "Elwan",
      spotifyId: "41KpeN0qV6BBsuJgd8tZrE",
    },
    {
      name: "The Queen Is Dead",
      spotifyId: "5Y0p2XCgRRIjna91aQE8q7",
    },
    {
      name: "Black Pumas",
      spotifyId: "0VwJFPilOR47xaCXnJzB4u",
    },
    {
      name: "Dummy",
      spotifyId: "3539EbNgIdEDGBKkUf4wno",
    },
    {
      name: "Unplugged In New York",
      spotifyId: "1To7kv722A8SpZF789MZy7",
    },
    {
      name: "Days Gone By",
      spotifyId: "0u3Rl4KquP15smujFrgGz4",
    },
    {
      name: "Screamadelica",
      spotifyId: "4TECsw2dFHZ1ULrT7OA3OL",
    },
    {
      name: "Counsil Skies",
      spotifyId: "3chNtIzZ4hmmMVeq723m3f",
    },
    {
      name: "72 Seasons",
      spotifyId: "70uejEPPRPSLBrTRdfghP5",
    },
    {
      name: "Volcano",
      spotifyId: "5xnXOCf5aZgZ43DgGN4EDv",
    },
  ];

  console.time("Seeding albums");
  await prisma.album.createMany({ data: [...ALBUMS] });
  console.timeEnd("Seeding albums");
}

async function seedWishlistEntries() {
  const seedOne = async () =>
    prisma.wishlistEntry.create({
      data: {
        name: faker.lorem.words({ min: 1, max: 6 }),
        link: faker.internet.url(),
        price: faker.number.float({ min: 0.01, max: 1_000, fractionDigits: 2 }),
        status: faker.helpers.shuffle(WISHLIST_STATUS)[0],
      },
    });

  console.time("Seeding wishlist entries");
  const wishlistLength = faker.number.int({ min: 5, max: 15 });
  const wishlistEntries = await Promise.all(
    Array.from({ length: wishlistLength }).map(async () => seedOne()),
  );
  console.timeEnd("Seeding wishlist entries");

  return wishlistEntries;
}

async function seed() {
  console.time("Cleaned up the database...");
  await prisma.wishlistEntry.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.album.deleteMany();
  console.timeEnd("Cleaned up the database...");

  const [wishlistEntries, tags] = await Promise.all([
    seedWishlistEntries(),
    seedTags(),
    seedAlbums(),
  ]);

  wishlistEntries.forEach(async (entry) => {
    const localTags = Array.from(tags);
    const tagsLength = faker.number.int({ min: 0, max: TAGS.length - 1 });
    for (let i = 0; i < tagsLength; i++) {
      await prisma.wishlistEntryTag.create({
        data: {
          wishlistEntryId: entry.id,
          tagId: localTags.splice(
            faker.number.int({ min: 0, max: localTags.length - 1 }),
            1,
          )[0].id,
        },
      });
    }
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
