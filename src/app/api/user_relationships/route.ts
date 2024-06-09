import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export async function GET() {
  const users = await getAllUsers();
  return NextResponse.json({ users });
}

export const POST = async (request: NextRequest) => {
  const allUsers = await getAllUsers();

  const scores: {
    targetUserId: number;
    fromUserId: number;
    score: number;
  }[] = [];

  const doneUsers: typeof allUsers = [];
  allUsers.forEach((user) => {
    allUsers
      .filter((u) => u.id !== user.id)
      .filter((user) => !doneUsers.some((su) => su.id === user.id))
      .forEach((targetUser) => {
        const userSteps = user.steps;
        const targetUserSteps = targetUser.steps;

        const steps = userSteps.map((step, index) => {
          const targetStep = targetUserSteps[index];
          if (!dayjs(step.datetime).isSame(targetStep.datetime)) {
            throw new Error("Datetime is not equal");
          }

          return {
            child: (step.step - targetStep.step) ** 2,
            parent: step.step ** 2 + targetStep.step ** 2,
          };
        });

        const coefficentsData = steps.flatMap((_, index) => {
          const windowSize = 60;
          const windowArray: { child: number; parent: number }[] = [];

          for (let i = 0; i < windowSize; i++) {
            const prevIndex = index - i;
            if (prevIndex < 0) {
              return [];
            }
            windowArray.push(steps[prevIndex]);
          }

          const child = windowArray
            .map((item) => item.child)
            .reduce((acc, item) => acc + item, 0);
          const parent = windowArray
            .map((item) => item.parent)
            .reduce((acc, item) => acc + item, 0);

          return [
            {
              child,
              parent,
            },
          ];
        });

        let score = 0;
        coefficentsData.forEach((_, index) => {
          const continuous = 15;

          for (let i = 0; i < continuous; i++) {
            const prevIndex = index - i;
            if (prevIndex < 0) {
              return;
            }
            const prevInfo = coefficentsData[prevIndex];

            if (prevInfo.parent < 5500) {
              return;
            }

            const prevCoefficent = prevInfo.child / prevInfo.parent;
            if (prevCoefficent > 0.05) {
              return;
            }
          }
          score += 1;
        });

        console.log(user.name, targetUser.name, score);
        scores.push({
          targetUserId: targetUser.id,
          fromUserId: user.id,
          score,
        });
      });
    doneUsers.push(user);
  });

  await Promise.all<void>(
    scores.map(
      (score) =>
        new Promise(async (resolve) => {
          await Promise.all([
            new Promise<void>(async (resolve) => {
              const exist = await prisma.userRelationship.findFirst({
                where: {
                  from_user_id: score.fromUserId,
                  target_user_id: score.targetUserId,
                },
              });
              if (exist) {
                await prisma.userRelationship.delete({
                  where: {
                    id: exist.id,
                  },
                });
              }
              resolve();
            }),
            new Promise<void>(async (resolve) => {
              const exist = await prisma.userRelationship.findFirst({
                where: {
                  from_user_id: score.targetUserId,
                  target_user_id: score.fromUserId,
                },
              });
              if (exist) {
                await prisma.userRelationship.delete({
                  where: {
                    id: exist.id,
                  },
                });
              }
              resolve();
            }),
          ]);
          await prisma.userRelationship.create({
            data: {
              from_user_id: score.fromUserId,
              target_user_id: score.targetUserId,
              score: score.score,
            },
          });
          resolve();
        })
    )
  );

  return NextResponse.json({ messegga: "ok" });
};

async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      steps: {
        select: {
          datetime: true,
          step: true,
        },
        orderBy: {
          datetime: "asc",
        },
      },
    },
  });
  return users;
}
