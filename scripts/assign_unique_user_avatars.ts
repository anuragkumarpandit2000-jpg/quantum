import prisma from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({ include: { profile: true } });
  const avatarPool = Array.from({ length: 23 }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    const ext = i + 1 <= 3 ? "png" : "jpg";
    return `/assets/images/avatars/avatar_${num}.${ext}`;
  });

  const used = new Set<string>();

  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    let curAvatar = u.profile?.avatar;
    if (!curAvatar || curAvatar === "/assets/images/avatar_1.png" || used.has(curAvatar)) {
      const nextUnused = avatarPool.find((a) => !used.has(a)) || avatarPool[i % avatarPool.length];
      if (u.profile) {
        await prisma.profile.update({
          where: { userId: u.id },
          data: { avatar: nextUnused },
        });
      } else {
        await prisma.profile.create({
          data: {
            userId: u.id,
            avatar: nextUnused,
            level: 1,
            totalXP: 100,
          },
        });
      }
      used.add(nextUnused);
      console.log(`Updated user '${u.name}' (@${u.username}) -> ${nextUnused}`);
    } else {
      used.add(curAvatar);
      console.log(`Kept user '${u.name}' (@${u.username}) -> ${curAvatar}`);
    }
  }
}

main()
  .then(() => {
    console.log("Successfully assigned unique avatars to all user profiles!");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
