"use client";

import { RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import {
  SITE_NOTICE_SPOTLIGHT_STORAGE_KEY,
  listSiteNoticeLocalStorageEntries,
  parseSiteNoticeSpotlightVisibilityRecords,
  type ParsedSiteNoticeSpotlightRecord,
  type SiteNoticeLocalStorageEntry,
} from "@/lib/site-notice-spotlight-storage";

type ParsedEntry = SiteNoticeLocalStorageEntry & {
  error: string | null;
  records: ParsedSiteNoticeSpotlightRecord[];
};

const codeClassName = "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-950";
const secondaryButtonClassName =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-950 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400";
const dangerButtonClassName =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-800 bg-red-800 px-3 py-2 text-sm font-semibold text-white transition hover:border-red-900 hover:bg-red-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400";

function parseEntry(entry: SiteNoticeLocalStorageEntry): ParsedEntry {
  if (entry.key !== SITE_NOTICE_SPOTLIGHT_STORAGE_KEY) {
    return {
      ...entry,
      error: null,
      records: [],
    };
  }

  try {
    return {
      ...entry,
      error: null,
      records: parseSiteNoticeSpotlightVisibilityRecords(entry.value),
    };
  } catch (error) {
    return {
      ...entry,
      error: error instanceof Error ? error.message : "Unable to parse spotlight storage value",
      records: [],
    };
  }
}

function readEntries() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return listSiteNoticeLocalStorageEntries(window.localStorage);
  } catch {
    return [];
  }
}

function removeSpotlightRecord(recordId: string) {
  const rawValue = window.localStorage.getItem(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY);

  if (!rawValue) {
    return;
  }

  const parsedValue: unknown = JSON.parse(rawValue);

  if (!parsedValue || typeof parsedValue !== "object" || Array.isArray(parsedValue)) {
    window.localStorage.removeItem(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY);
    return;
  }

  const nextValue = { ...parsedValue } as Record<string, unknown>;
  delete nextValue[recordId];

  if (Object.keys(nextValue).length === 0) {
    window.localStorage.removeItem(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY, JSON.stringify(nextValue, null, 2));
}

export function SiteNoticeStorageDebugPanel() {
  const [entries, setEntries] = useState<SiteNoticeLocalStorageEntry[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState("");

  const refreshEntries = useCallback((nextMessage?: string) => {
    setEntries(readEntries());
    setIsReady(true);
    setMessage(nextMessage ?? "Local storage snapshot refreshed.");
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refreshEntries("");
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshEntries]);

  const parsedEntries = useMemo(() => entries.map(parseEntry), [entries]);
  const totalRecords = parsedEntries.reduce((sum, entry) => sum + entry.records.length, 0);

  const deleteKey = (key: string) => {
    try {
      window.localStorage.removeItem(key);
      refreshEntries(`Deleted ${key}.`);
    } catch {
      setMessage(`Failed to delete ${key}.`);
    }
  };

  const deleteAll = () => {
    try {
      for (const entry of entries) {
        window.localStorage.removeItem(entry.key);
      }

      refreshEntries("Deleted all site-notice local storage entries.");
    } catch {
      setMessage("Failed to delete all site-notice local storage entries.");
    }
  };

  const deleteRecord = (recordId: string) => {
    try {
      removeSpotlightRecord(recordId);
      refreshEntries(`Deleted spotlight record ${recordId}.`);
    } catch {
      setMessage(`Failed to delete spotlight record ${recordId}.`);
    }
  };

  return (
    <section
      {...componentNameDebugProps("SiteNoticeStorageDebugPanel")}
      className="bg-white px-6 py-12 text-slate-950 sm:px-10 lg:px-16 lg:py-16"
      aria-labelledby="site-notice-storage-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-3">
          <p className="text-sm font-semibold uppercase text-blue-600">Internal debug</p>
          <h2 id="site-notice-storage-heading" className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Site Notice Local Storage
          </h2>
          <p className="max-w-3xl text-base leading-7 text-slate-600">
            Inspect and clear browser-local Site Notice data used by the Floating Spotlight Card.
          </p>
        </div>

        <dl className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))]">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <dt className="text-sm text-slate-500">Watched spotlight key</dt>
            <dd className="mt-2 break-all text-lg font-semibold text-slate-950">
              <code className={codeClassName}>{SITE_NOTICE_SPOTLIGHT_STORAGE_KEY}</code>
            </dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <dt className="text-sm text-slate-500">Matched storage keys</dt>
            <dd className="mt-2 text-2xl font-semibold text-slate-950">{isReady ? entries.length : "-"}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <dt className="text-sm text-slate-500">Parsed spotlight records</dt>
            <dd className="mt-2 text-2xl font-semibold text-slate-950">{isReady ? totalRecords : "-"}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button className={secondaryButtonClassName} type="button" onClick={() => refreshEntries()}>
            <RefreshCw aria-hidden="true" size={16} />
            Refresh
          </button>
          <button className={dangerButtonClassName} type="button" onClick={deleteAll} disabled={entries.length === 0}>
            <Trash2 aria-hidden="true" size={16} />
            Delete all site-notice data
          </button>
        </div>

        <p className="mt-3 min-h-6 text-sm text-slate-600" aria-live="polite">
          {message}
        </p>

        {!isReady ? (
          <p className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
            Reading browser local storage.
          </p>
        ) : null}

        {isReady && entries.length === 0 ? (
          <p className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
            No site-notice or spotlight local storage entries were found.
          </p>
        ) : null}

        {parsedEntries.length > 0 ? (
          <div className="mt-6 grid gap-5">
            {parsedEntries.map((entry) => (
              <section
                className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                key={entry.key}
                aria-labelledby={`site-notice-storage-${entry.key}`}
              >
                <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <h3 id={`site-notice-storage-${entry.key}`} className="break-all text-xl font-semibold text-slate-950">
                      {entry.key}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{entry.value.length.toLocaleString()} characters</p>
                  </div>
                  <button
                    className={dangerButtonClassName}
                    type="button"
                    onClick={() => deleteKey(entry.key)}
                    aria-label={`Delete key ${entry.key}`}
                  >
                    <Trash2 aria-hidden="true" size={16} />
                    Delete key
                  </button>
                </div>

                {entry.error ? (
                  <p className="border-b border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-800">
                    {entry.error}
                  </p>
                ) : null}

                {entry.records.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-[920px] w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600">
                          <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                            ID
                          </th>
                          <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                            Disposition
                          </th>
                          <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                            Updated
                          </th>
                          <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                            Expires
                          </th>
                          <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                            Status
                          </th>
                          <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.records.map((record) => (
                          <tr key={record.id}>
                            <td className="border-b border-slate-200 px-4 py-3 align-top">
                              <code className={codeClassName}>{record.id}</code>
                            </td>
                            <td className="border-b border-slate-200 px-4 py-3 align-top text-slate-600">
                              {record.disposition}
                            </td>
                            <td className="border-b border-slate-200 px-4 py-3 align-top text-slate-600">
                              {record.updatedAt}
                            </td>
                            <td className="border-b border-slate-200 px-4 py-3 align-top text-slate-600">
                              {record.expiresAt}
                            </td>
                            <td className="border-b border-slate-200 px-4 py-3 align-top text-slate-600">
                              {record.isExpired ? "Expired" : "Active"}
                            </td>
                            <td className="border-b border-slate-200 px-4 py-3 align-top">
                              <button
                                className={secondaryButtonClassName}
                                type="button"
                                onClick={() => deleteRecord(record.id)}
                                aria-label={`Delete record ${record.id}`}
                              >
                                <Trash2 aria-hidden="true" size={16} />
                                Delete record
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                <details className="p-5">
                  <summary className="font-semibold text-slate-950">Raw value</summary>
                  <pre className="mt-3 max-h-[360px] overflow-auto rounded-lg bg-slate-950 p-4 font-mono text-[13px] leading-6 whitespace-pre-wrap text-slate-100">
                    {entry.value}
                  </pre>
                </details>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
