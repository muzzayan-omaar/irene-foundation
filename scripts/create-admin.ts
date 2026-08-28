import prisma from "../src/lib/prisma";

async function main() {
  const adminUser = await prisma.adminUser.create({
    data: {
      supabaseUid: "34f2b43f-dadf-4a1b-a038-a431d0ac25a9",
      fullName: "Muzzayan",
      email: "muzzayanomaar@gmail.com", 
      role: "OWNER",
    },
  });

  console.log("Created admin user:", adminUser);
}

main()
  .catch((err) => {
    console.error("Failed to create admin user:", err);
  })
  .finally(async () => {
    process.exit();
  });
