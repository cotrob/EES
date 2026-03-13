/**
 * Converts a hugeicons icon definition to an SVG string.
 * Useful for components like IconFeatureGrid that expect icon as an HTML string.
 */
type HugeIconDef = [string, Record<string, string | number>][];

function toKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function hugeIconToSvg(icon: HugeIconDef, size: number = 24): string {
  const children = icon
    .map(([tag, attrs]) => {
      const attrStr = Object.entries(attrs)
        .filter(([k]) => k !== 'key')
        .map(([k, v]) => `${toKebab(k)}="${v}"`)
        .join(' ');
      return `<${tag} ${attrStr} />`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" color="currentColor">${children}</svg>`;
}
