import { getInfoFromJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function getUserList() {
  const { email } = await getInfoFromJWT();
  if (email === "josephgusdm@163.com" || email === "285822850@qq.com") {
    try{
        const userList = await prisma.user.findMany();
        return userList;
    } catch (error) {
      console.log("err: ", error);
      throw new Error("Failed to get user list");
    }
  } else {
    console.log("err: ", "not entitled");
    throw new Error("not entitled");
  }
}
