"use server";

import { prisma } from "@/lib/prisma";
import { JSONContent } from "@tiptap/core";
import { getInfoFromJWT } from "@/lib/jwt";

const createLiterature = async (formData: FormData) => {
  const content = JSON.parse(formData.get("content") as string) as JSONContent;
  const { email } = await getInfoFromJWT();
  try {
    const literature = await prisma.literature.create({
      data: {
        date: new Date(),
        content: content,
        userId: email,
      },
    });
    return {
      success: true,
      msg: "Literature created successfully",
      data: literature,
    };
  } catch (err) {
    console.log("err: ", err);
    return { success: false, msg: "Literature creation failed" };
  }
};

function thisMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start, end };
}

const getLiteratureByDate = async () => {
  const { email } = await getInfoFromJWT();
  try {
    const literature = await prisma.literature.findMany({
      where: {
        userId: email,
        date: {
          gte: thisMonthRange().start,
          lt: thisMonthRange().end,
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const formattedLiterature = literature.map((item) => ({
      id: item.id,
      date: item.date,
      content: item.content as JSONContent,
    }));

    return {
      success: true,
      msg: "Literature fetched successfully",
      data: formattedLiterature,
    };
  } catch (err) {
    throw err;
  }
};

const deleteQuote = async (id: string) => {
  const { email } = await getInfoFromJWT();
  try {
    const res = await prisma.literature.delete({
      where: {
        id: id,
        userId: email,
      },
    });
    if (res) {
      return {
        success: true,
        msg: "Quote deleted successfully",
      };
    }
  } catch (err) {
    console.log("err: ", err);
  }
};

const updateQuote = async (id: string, content: JSONContent) => {
  const { email } = await getInfoFromJWT();
  try {
    const res = await prisma.literature.update({
      where: {
        id: id,
        userId: email,
      },
      data: {
        content: content,
      },
    });
    if (res) {
      return {
        success: true,
        msg: "Quote updated successfully",
      };
    }
  } catch (err) {
    console.log("err: ", err);
  }
};

const updateLiterature = async (id: string, content: JSONContent) => {
  const { email } = await getInfoFromJWT();
  try {
    const res = await prisma.literature.update({
      where: {
        id: id,
        userId: email,
      },
      data: {
        content: content,
      },
    });
    if (res) {
      return {
        success: true,
        msg: "Literature updated successfully",
      };
    }
  } catch (err) {
    console.log("err: ", err);
  }
};

export { createLiterature, getLiteratureByDate, deleteQuote, updateLiterature };
