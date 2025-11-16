"use server";

import { LexiconCollection } from "@/generated/prisma/client";
import { getInfoFromJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { LexiconType } from "@/generated/prisma/enums";

const createLexicon = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const list = JSON.parse(formData.get("list") as string) as string[];
  const type = formData.get("type") as LexiconType;

  const { email } = await getInfoFromJWT();

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
};

const loadLexiconCollection = async () => {
  const { email } = await getInfoFromJWT();
  console.log("email: ", email);
  if (!email) {
    throw new Error("NO_EMAIL");
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
  const { email } = await getInfoFromJWT();
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

  const { email } = await getInfoFromJWT();
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
  const { email } = await getInfoFromJWT();
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
