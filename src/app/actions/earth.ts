"use server";

export async function getFunFact(
  country: string,
  age: number,
  gender: string
) {
  try {
    const funFact = await fetch(
      `http://localhost:19020/getFact?country=${country}&age=${age}&gender=${gender}`
    );
    if (!funFact.ok) {
      throw new Error(`Failed to get fun fact: ${funFact.statusText}`);
    }
    const funFactJson = await funFact.json();
    return { success: true, msg: null, data: funFactJson };
  } catch (error) {
    return {
      success: false,
      msg: `Failed to get fun fact: ${error}`,
      data: null,
    };
  }
}
