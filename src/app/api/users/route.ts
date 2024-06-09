import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const users = getAllUsers();
  return NextResponse.json({ users });
}

export interface User {
  id: number;
  name: string;
}

export type StepData = { datetime: string; step: number };
interface UsersPostBody {
  name: string;
  csv: Array<StepData>;
}
interface UsersPostResponse {}
export const POST = async (request: NextRequest) => {
  const { name, csv } = (await request.json()) as UsersPostBody;

  const exist = await prisma.user.findFirst({ where: { name } });
  if (exist) {
    await prisma.step.deleteMany({ where: { user_id: exist.id } });
    await prisma.user.delete({ where: { id: exist.id } });
  }

  const user = await prisma.user.create({
    data: {
      name,
    },
  });

  for (const step of csv) {
    await prisma.step.create({
      data: { user: { connect: { id: user.id } }, ...step },
    });
  }

  return NextResponse.json({ user } as UsersPostResponse);
};

async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}
