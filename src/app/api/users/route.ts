import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const users = await getAllUsers();
  return NextResponse.json({ users });
}

export type StepData = { datetime: string; step: number };
interface UsersPostBody {
  name: string;
  csv: Array<StepData>;
}
interface UsersPostResponse {}
export const POST = async (request: NextRequest) => {
  const { name, csv } = (await request.json()) as UsersPostBody;

  if (!name) {
    throw new Error("Name is required");
  }

  const exist = await prisma.user.findFirst({ where: { name } });
  if (exist) {
    await prisma.step.deleteMany({ where: { user_id: exist.id } });
  }

  const user = await prisma.user.upsert({
    where: {
      name,
    },
    update: {},
    create: {
      name,
    },
  });

  await prisma.step.createMany({
    data: csv.map((step) => ({ user_id: user.id, ...step })),
  })

  // for (const step of csv) {
  //   await prisma.step.create({
  //     data: { user: { connect: { id: user.id } }, ...step },
  //   });
  // }

  return NextResponse.json({ user } as UsersPostResponse);
};

async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}
