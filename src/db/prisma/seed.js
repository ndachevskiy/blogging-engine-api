"use strict";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const johndow = await prisma.user.upsert({
    where: {
      email: "johndow@example.com",
    },
    update: {},
    create: {
      email: "johndow@example.com",
      // as plaintext pass Test123()()
      password: "$2a$08$oSt8cM6LmQToOhTjmByOrOg.PztB982p1hiisUpAdE5SOYe.YuYtu",
      isactivated: true,
      posts: {
        create: {
          title: "Hey there!",
          content: "This is my first post!",
        },
      },
    },
  });

  const janedow = await prisma.user.upsert({
    where: {
      email: "janedow@example.com",
    },
    update: {},
    create: {
      email: "janedow@example.com",
      // as plaintext pass Test123()()
      password: "$2a$08$oSt8cM6LmQToOhTjmByOrOg.PztB982p1hiisUpAdE5SOYe.YuYtu",
      isactivated: true,
      posts: {
        create: {
          title: "Hi",
          content: "How are you doing?",
        },
      },
    },
  });
  console.log(johndow, janedow);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
