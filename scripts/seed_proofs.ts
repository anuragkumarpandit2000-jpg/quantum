import prisma from "../src/lib/prisma";

async function main() {
  console.log("Seeding sample public transformation proofs...");

  const arun = await prisma.user.findFirst({ where: { email: "demo@quantum.system" } });
  const tanishq = await prisma.user.findFirst({ where: { email: "tanishq@quantum.system" } });
  const riddhi = await prisma.user.findFirst({ where: { email: "riddhi@quantum.system" } });
  const raghav = await prisma.user.findFirst({ where: { email: "raghav@quantum.system" } });

  const existingProofsCount = await prisma.galleryItem.count();
  if (existingProofsCount >= 4) {
    console.log(`Already have ${existingProofsCount} proofs in database. Skipping.`);
    return;
  }

  const sampleProofs = [
    {
      userId: tanishq?.id || arun?.id,
      dayNumber: 42,
      caption: "5:00 AM Calisthenics & 10km Weighted Run completed. Zero missed days in the Arc.",
      fileUrl: "/assets/images/avatars/avatar_16.jpg",
      isPublic: true,
    },
    {
      userId: riddhi?.id || arun?.id,
      dayNumber: 36,
      caption: "4 Hours Deep Work on Rust Engine & Distributed Sharding Nodes. Focus locked.",
      fileUrl: "/assets/images/avatars/avatar_17.jpg",
      isPublic: true,
    },
    {
      userId: raghav?.id || arun?.id,
      dayNumber: 28,
      caption: "Cold exposure protocol followed by 100 pushups. Mind cleared of dopamine noise.",
      fileUrl: "/assets/images/avatars/avatar_18.jpg",
      isPublic: true,
    },
    {
      userId: arun?.id,
      dayNumber: 14,
      caption: "Day 14 Matrix check: 5/5 daily habits locked unbroken. The inertia is real.",
      fileUrl: "/assets/images/avatars/avatar_15.jpg",
      isPublic: true,
    },
  ];

  for (const sp of sampleProofs) {
    if (sp.userId) {
      await prisma.galleryItem.create({
        data: {
          userId: sp.userId,
          dayNumber: sp.dayNumber,
          caption: sp.caption,
          fileUrl: sp.fileUrl,
          fileType: "image",
          isPublic: sp.isPublic,
        },
      });
      console.log(`Seeded proof for Day ${sp.dayNumber}`);
    }
  }

  console.log("Finished seeding public proofs successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
