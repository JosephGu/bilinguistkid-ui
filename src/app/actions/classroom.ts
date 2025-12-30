import { redis } from "@/app/lib/redis";

export  async function createClassroom() {
  const roomId = Math.random().toString(36).slice(2, 8);
  const ttl = 2 * 60 * 60;
  await redis.hset(`room:${roomId}`, {
    createdAt: Date.now().toString(),
    max: 6,
  });

  await redis.expire(`room:${roomId}`, ttl);
  await redis.expire(`room:${roomId}:peers`, ttl);
  return roomId;
}

export async function joinClassroom(roomId: string, peerId: string) {
  const room = await redis.hgetall(`room:${roomId}`);
  if (!room) {
    throw new Error("Room not found");
  }
  const exists = await redis.get(`room:${roomId}`);
  if (!exists) {
    throw new Error("Peer already in room");
  }
  if (Number(exists.length) >= Number(room.max)) {
    throw new Error("Room is full");
  }
  await redis.sadd(`room:${roomId}:peers`, peerId);
  await redis.set(`room:${peerId}`, peerId, "EX", 30);
  const peers = await redis.smembers(`room:${roomId}:peers`);
  return peers.filter((p) => p !== peerId);
}