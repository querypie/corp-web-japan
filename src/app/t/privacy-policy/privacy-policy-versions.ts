export type PrivacyPolicyVersion = {
  slug: string;
  title: string;
  date: string;
  label: string;
};

export const PRIVACY_POLICY_VERSIONS: PrivacyPolicyVersion[] = [
  {
    slug: "2026-01-15",
    title: "QueryPie Privacy Policy (Jan 15, 2026)",
    date: "2026-01-15",
    label: "2026-01-15",
  },
  {
    slug: "2025-12-03",
    title: "QueryPie Privacy Policy (Dec 3, 2025)",
    date: "2025-12-03",
    label: "2025-12-03",
  },
  {
    slug: "2025-10-21",
    title: "QueryPie Privacy Policy (Oct 21, 2025)",
    date: "2025-10-21",
    label: "2025-10-21",
  },
  {
    slug: "2025-09-08",
    title: "QueryPie Privacy Policy (Sep 8, 2025)",
    date: "2025-09-08",
    label: "2025-09-08",
  },
  {
    slug: "2025-07-28",
    title: "QueryPie Privacy Policy (Jul 28, 2025)",
    date: "2025-07-28",
    label: "2025-07-28",
  },
  {
    slug: "2025-07-15",
    title: "QueryPie Privacy Policy (Jul 15, 2025)",
    date: "2025-07-15",
    label: "2025-07-15",
  },
  {
    slug: "2025-06-10",
    title: "QueryPie Privacy Policy (Jun 10, 2025)",
    date: "2025-06-10",
    label: "2025-06-10",
  },
  {
    slug: "2025-06-05",
    title: "QueryPie Privacy Policy (Jun 5, 2025)",
    date: "2025-06-05",
    label: "2025-06-05",
  },
  {
    slug: "2024-11-29",
    title: "QueryPie Privacy Policy (Nov 29, 2024)",
    date: "2024-11-29",
    label: "2024-11-29",
  },
  {
    slug: "2024-06-07",
    title: "QueryPie Privacy Policy (Jun 7, 2024)",
    date: "2024-06-07",
    label: "2024-06-07",
  },
  {
    slug: "2023-09-22",
    title: "QueryPie Privacy Policy (Sep 22, 2023)",
    date: "2023-09-22",
    label: "2023-09-22",
  },
  {
    slug: "2023-08-25",
    title: "QueryPie Privacy Policy (Aug 25, 2023)",
    date: "2023-08-25",
    label: "2023-08-25",
  },
  {
    slug: "2022-10-11",
    title: "QueryPie Privacy Policy (Oct 11, 2022)",
    date: "2022-10-11",
    label: "2022-10-11",
  },
  {
    slug: "2022-06-06",
    title: "QueryPie Privacy Policy (Jun 6, 2022)",
    date: "2022-06-06",
    label: "2022-06-06",
  },
  {
    slug: "2022-01-12",
    title: "QueryPie Privacy Policy (Jan 12, 2022)",
    date: "2022-01-12",
    label: "2022-01-12",
  },
  {
    slug: "2021-03-30",
    title: "QueryPie Privacy Policy (Mar 30, 2021)",
    date: "2021-03-30",
    label: "2021-03-30",
  },
  {
    slug: "2019-11-29",
    title: "QueryPie Privacy Policy (Nov 29, 2019)",
    date: "2019-11-29",
    label: "2019-11-29",
  },
];

export const LATEST_PRIVACY_POLICY_VERSION = PRIVACY_POLICY_VERSIONS[0];

export function getPrivacyPolicyVersion(slug: string) {
  return PRIVACY_POLICY_VERSIONS.find((version) => version.slug === slug) ?? null;
}
