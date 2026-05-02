export function publicationCardLink(page, title) {
  return page.locator('a').filter({ has: page.getByRole('heading', { name: title }) }).first();
}

export async function gotoStagePath(page, baseURL, path) {
  await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle' });
}
