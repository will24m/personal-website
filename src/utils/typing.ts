function createSeededRng(seedText: string): () => number {
  let seed = 0;
  for (let i = 0; i < seedText.length; i += 1) {
    seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  }
  if (seed === 0) seed = 123456789;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export function buildTypingFrames(text: string): string[] {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const rng = createSeededRng(text);
  const frames: string[] = [];
  let rendered = "";
  let typoBudget = Math.max(1, Math.floor(text.length / 28));

  for (let i = 0; i < text.length; i += 1) {
    const nextChar = text[i];
    const isLetter = /[a-z]/i.test(nextChar);
    const canTypo = isLetter && typoBudget > 0 && i > 1 && i < text.length - 2;
    const shouldTypo = canTypo && rng() < 0.18;

    if (shouldTypo) {
      typoBudget -= 1;
      let wrongChar = alphabet[Math.floor(rng() * alphabet.length)];
      while (wrongChar.toLowerCase() === nextChar.toLowerCase()) {
        wrongChar = alphabet[Math.floor(rng() * alphabet.length)];
      }
      if (nextChar === nextChar.toUpperCase()) wrongChar = wrongChar.toUpperCase();
      frames.push(rendered + wrongChar);
      frames.push(rendered);
    }

    rendered += nextChar;
    frames.push(rendered);
  }

  return frames;
}

export function typingDelay(currentFrame: string, nextFrame: string | undefined): number {
  if (!nextFrame) return 0;
  if (nextFrame.length < currentFrame.length) return 72;
  const lastChar = currentFrame.charAt(currentFrame.length - 1);
  if (/[.!?]/.test(lastChar)) return 140;
  if (/[,:;]/.test(lastChar)) return 95;
  if (lastChar === " ") return 34;
  return 24;
}
