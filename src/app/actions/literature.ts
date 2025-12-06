"use server";

import { prisma } from "@/lib/prisma";
import { JSONContent } from "@tiptap/core";
import { getInfoFromJWT } from "@/lib/jwt";
import { TimeRange } from "@/app/shared/TimeRange";

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

function thisWeekRange() {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay()
  );
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay() + 7
  );
  return { start, end };
}

function last7DaysRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return { start, end };
}

function todayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { start, end };
}

function allRange() {
  const now = new Date();
  const start = new Date(0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { start, end };
}

const getLiteratureByDate = async (timeRange: TimeRange) => {
  let range: { start: Date; end: Date };
  switch (timeRange) {
    case TimeRange.Today:
      range = todayRange();
      break;
    case TimeRange.ThisWeek:
      range = thisWeekRange();
      break;
    case TimeRange.Last7Days:
      range = last7DaysRange();
      break;
    case TimeRange.ThisMonth:
      range = thisMonthRange();
      break;
    case TimeRange.All:
      range = allRange();
      break;
    default:
      range = thisMonthRange();
      break;
  }

  const { email } = await getInfoFromJWT();
  try {
    const literature = await prisma.literature.findMany({
      where: {
        userId: email,
        deleted: false,
        date: {
          gte: range.start,
          lt: range.end,
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
      deleted: item.deleted || false,
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

const restoreLiterature = async (id: string) => {
  const { email } = await getInfoFromJWT();
  try {
    const res = await prisma.literature.update({
      where: {
        id: id,
        userId: email,
        deleted: true,
      },
      data: {
        deleted: false,
      },
    });
    if (res) {
      return {
        success: true,
        msg: "Quote restored successfully",
      };
    }
  } catch (err) {
    console.log("err: ", err);
  }
};

const deleteLiterature = async (id: string) => {
  const { email } = await getInfoFromJWT();
  try {
    const res = await prisma.literature.delete({
      where: {
        id: id,
        userId: email,
        deleted: true,
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

const softDeleteLiterature = async (id: string) => {
  const { email } = await getInfoFromJWT();
  try {
    const res = await prisma.literature.update({
      where: {
        id: id,
        userId: email,
        deleted: false,
      },
      data: {
        deleted: true,
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

export {
  createLiterature,
  getLiteratureByDate,
  softDeleteLiterature,
  updateLiterature,
  restoreLiterature,
  deleteLiterature,
};
