export async function getAudio(content: string) {
  try {
    const audio = await fetch(
      `http://localhost:19020/getAudio?content=${content}`
    );
    if (!audio.ok) {
      throw new Error(
        `Failed to get audio: ${audio.statusText}`
      );
    }
    const audioJson = await audio.json();
    return { success: true, msg: null, data: audioJson };
  } catch (error) {
    return {
      success: false,
      msg: `Failed to get fun fact audio: ${error}`,
      data: null,
    };
  }
}