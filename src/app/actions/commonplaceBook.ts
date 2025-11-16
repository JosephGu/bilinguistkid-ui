"use server";

import { prisma } from "@/lib/prisma";
import { JSONContent } from "@tiptap/core";
import {  getInfoFromJWT } from "@/lib/jwt";

const createCommonplaceBook = async (content: JSONContent) => {
    
   const { email } = await getInfoFromJWT();
};
