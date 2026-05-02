import { test, expect } from '@playwright/test';
import { blogFixtures, gotoStagePath, publicationCardLink } from '../../../helpers/publication-stage-fixtures.mjs';

test.describe('stage blog pages', () => {
  test('blog list renders the canonical page chrome and visible card links', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, blogFixtures.listPath);

    await expect(page).toHaveTitle(blogFixtures.listTitle);
    await expect(page.getByRole('heading', { name: blogFixtures.listHeading })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ブログ' }).first()).toBeVisible();

    const visibleCard = publicationCardLink(page, blogFixtures.visibleCard.title);
    await expect(visibleCard).toBeVisible();
    await expect(visibleCard).toHaveAttribute('href', blogFixtures.visibleCard.href);
  });

  test('blog list excludes hidden posts from the public card surface', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, blogFixtures.listPath);

    await expect(page.getByText(blogFixtures.hiddenCardTitle, { exact: true })).toHaveCount(0);
  });

  test('blog id-only route redirects to the canonical slug route', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, blogFixtures.visiblePost.idOnlyPath);

    await expect(page).toHaveURL(`${baseURL}${blogFixtures.visiblePost.canonicalPath}`);
    await expect(page).toHaveTitle(`${blogFixtures.visiblePost.title} | QueryPie AI`);
  });

  test('blog mismatched slug route redirects to the canonical slug route', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, blogFixtures.visiblePost.mismatchedSlugPath);

    await expect(page).toHaveURL(`${baseURL}${blogFixtures.visiblePost.canonicalPath}`);
    await expect(page).toHaveTitle(`${blogFixtures.visiblePost.title} | QueryPie AI`);
  });

  test('visible blog detail renders title, author metadata, body heading, and related section', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, blogFixtures.visiblePost.path);

    await expect(page).toHaveTitle(`${blogFixtures.visiblePost.title} | QueryPie AI`);
    await expect(page.getByRole('heading', { name: blogFixtures.visiblePost.title })).toBeVisible();
    await expect(page.getByText(blogFixtures.visiblePost.authorName, { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: blogFixtures.visiblePost.bodyHeading })).toBeVisible();
    await expect(page.getByRole('heading', { name: blogFixtures.visiblePost.relatedHeading })).toBeVisible();
  });

  test('hidden blog detail stays directly reachable while remaining a normal article page', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, blogFixtures.hiddenPost.path);

    await expect(page).toHaveTitle(`${blogFixtures.hiddenPost.title} | QueryPie AI`);
    await expect(page.getByRole('heading', { name: blogFixtures.hiddenPost.title }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: blogFixtures.hiddenPost.bodyHeading })).toBeVisible();
    await expect(page.getByRole('heading', { name: blogFixtures.hiddenPost.relatedHeading })).toBeVisible();
  });
});
