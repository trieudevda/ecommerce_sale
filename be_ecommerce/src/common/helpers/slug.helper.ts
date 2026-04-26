import slugify from 'slugify';

export function createSlug(text: string): string {
  if (!text) return '';

  return slugify(text, {
    lower: true,
    locale: 'vi',
    strict: true,
    trim: true,
  });
}
export async function createUniqueSlug(
  text: string,
  existsFn: (slug: string) => Promise<boolean>,
): Promise<string> {
  let baseSlug = createSlug(text);
  let slug = baseSlug;
  let i = 1;

  while (await existsFn(slug)) {
    slug = `${baseSlug}-${i}`;
    i++;
  }

  return slug;
}