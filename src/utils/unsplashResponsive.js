/**
 * Build responsive img props for images.unsplash.com (width + srcset + sizes).
 * Reduces bytes vs. always using w=1200 on phones.
 */
function buildSrcSet(imageUrl, widths, commonParams) {
  return widths
    .map((w) => {
      const u = new URL(imageUrl);
      Object.entries(commonParams).forEach(([k, v]) => u.searchParams.set(k, v));
      u.searchParams.set('w', String(w));
      return `${u.toString()} ${w}w`;
    })
    .join(', ');
}

export function unsplashImgProps(imageUrl, sizes) {
  if (typeof imageUrl !== 'string' || !imageUrl.includes('images.unsplash.com')) {
    return { src: imageUrl, srcSet: undefined, sizes: undefined };
  }
  try {
    const common = { auto: 'format', fit: 'crop', q: '75' };
    const widths = [320, 480, 640, 960, 1280];
    const srcSet = buildSrcSet(imageUrl, widths, common);
    const srcU = new URL(imageUrl);
    Object.entries(common).forEach(([k, v]) => srcU.searchParams.set(k, v));
    /* Default `src` when browser ignores srcset (older clients); ~480px covers many desktop card widths. */
    srcU.searchParams.set('w', '480');
    return { src: srcU.toString(), srcSet, sizes };
  } catch {
    return { src: imageUrl, srcSet: undefined, sizes: undefined };
  }
}

/** Small fixed display (hero avatars); keep srcset caps low to save bandwidth. */
export function unsplashAvatarImgProps(imageUrl, sizes) {
  if (typeof imageUrl !== 'string' || !imageUrl.includes('images.unsplash.com')) {
    return { src: imageUrl, srcSet: undefined, sizes: undefined };
  }
  try {
    const common = { auto: 'format', fit: 'crop', q: '50' };
    const widths = [40, 56, 72, 96];
    const srcSet = buildSrcSet(imageUrl, widths, common);
    const srcU = new URL(imageUrl);
    Object.entries(common).forEach(([k, v]) => srcU.searchParams.set(k, v));
    srcU.searchParams.set('w', '72');
    return { src: srcU.toString(), srcSet, sizes };
  } catch {
    return { src: imageUrl, srcSet: undefined, sizes: undefined };
  }
}
