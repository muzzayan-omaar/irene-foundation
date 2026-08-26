import prisma from "../src/lib/prisma";

async function main() {
  const donorCount = await prisma.donor.count();
  console.log("Donor count:", donorCount);
}

main()
  .catch((err) => {
    console.error("Something went wrong:", err);
  })
  .finally(async () => {
    process.exit();
  });