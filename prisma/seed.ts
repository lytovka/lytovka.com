import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

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
  console.timeEnd("Cleaned up the database...");

  const [wishlistEntries, tags] = await Promise.all([
    seedWishlistEntries(),
    seedTags(),
  ]);

  wishlistEntries.forEach(async (entry) => {
    const localTags = Array.from(tags);
    const tagsLength = faker.number.int({ min: 0, max: TAGS.length - 1 });
    for (let i = 0; i <= tagsLength; i++) {
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
