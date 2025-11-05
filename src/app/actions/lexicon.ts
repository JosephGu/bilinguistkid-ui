"use server";

import { LexiconCollection } from "@/generated/prisma/client";
import { AUTH_COOKIE_NAME, getInfoFromJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { LexiconType } from "@/generated/prisma/enums";

const createLexicon = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const list = JSON.parse(formData.get("list") as string) as string[];
  const type = formData.get("type") as LexiconType;

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    throw new Error("No token found");
  }
  const { email } = await getInfoFromJWT(token);
  console.log("email: ", email);
  if (!email) {
    throw new Error("No email found");
  }
  try {
    const res = await prisma.lexiconCollection.create({
      data: {
        title,
        type,
        list,
        userId: email,
      },
    });
    return { success: true, msg: "Lexicon created successfully" };
  } catch (err) {
    console.log("err: ", err);
  }

  //   return await prisma.lexiconCollection.create({
  //     data: {
  //       title,
  //       list: JSON.parse(list),
  //     },
  //   });
};

const loadLexiconCollection = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  console.log("token: ", token, !token);
  if (!token) {
    throw new Error("No token found");
  }
  const { email } = await getInfoFromJWT(token);
  console.log("email: ", email);
  if (!email) {
    throw new Error("No email found");
  }
  const res: LexiconCollection[] = await prisma.lexiconCollection.findMany({
    where: {
      userId: email,
    },
  });
  const lexiconList = res.map((item) => {
    const { id, title, list, type } = item;
    return { id, title, list, type };
  });
  return lexiconList;
};

const loadLexicon = async (id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  console.log("token: ", token, !token);
  if (!token) {
    throw new Error("No token found");
  }
  const { email } = await getInfoFromJWT(token);
  console.log("email: ", email);
  if (!email) {
    throw new Error("No email found");
  }
  if (!id) {
    throw new Error("No id found");
  }
  const res: LexiconCollection | null =
    await prisma.lexiconCollection.findUnique({
      where: {
        id,
        userId: email,
      },
    });
  if (!res) {
    throw new Error("Lexicon not found");
  }
  const { title, list, type } = res;
  return { id, title, list, type };
};

const updateLexicon = async (id: string, formData: FormData) => {
  const title = formData.get("title") as string;
  const list = JSON.parse(formData.get("list") as string) as string[];
  const type = formData.get("type") as LexiconType;

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    throw new Error("No token found");
  }
  const { email } = await getInfoFromJWT(token);
  console.log("email: ", email);
  if (!email) {
    throw new Error("No email found");
  }
  if (!id) {
    throw new Error("No id found");
  }
  try {
    await prisma.lexiconCollection.update({
      where: {
        id,
        userId: email,
      },
      data: {
        title,
        list,
        type,
      },
    });
    return { success: true, msg: "Lexicon updated successfully" };
  } catch (err) {
    console.log("err: ", err);
  }
};
const deleteLexicon = async (id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    throw new Error("No token found");
  }
  const { email } = await getInfoFromJWT(token);
  console.log("email: ", email);
  if (!email) {
    throw new Error("No email found");
  }
  if (!id) {
    throw new Error("No id found");
  }
  try {
    await prisma.lexiconCollection.delete({
      where: {
        id,
        userId: email,
      },
    });
    return { success: true, msg: "Lexicon deleted successfully" };
  } catch (err) {
    console.log("err: ", err);
  }
};

export {
  createLexicon,
  loadLexiconCollection,
  loadLexicon,
  updateLexicon,
  deleteLexicon,
};
