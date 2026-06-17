export const spotlightCardPositionPercentages = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95] as const;
export const spotlightYPositionParamName = "spotlightY";

export type SpotlightCardPositionPercentage = number;

type SpotlightPositionAsof = {
  hours: number;
  minutes: number;
  seconds: number;
};

type SpotlightCardTopInput = {
  cardHeight: number;
  mainContentBottom: number;
  mainContentTop: number;
  positionPercentage: number;
  viewportHeight: number;
};

const minutesPerSpotlightPositionBucket = 4;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function parseSpotlightPositionAsof(value: string | undefined): SpotlightPositionAsof | null {
  if (!value) {
    return null;
  }

  const match = /^(\d{2}):(\d{2}):(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, hoursValue, minutesValue, secondsValue] = match;
  const hours = Number(hoursValue);
  const minutes = Number(minutesValue);
  const seconds = Number(secondsValue);

  if (hours > 23 || minutes > 59 || seconds > 59) {
    return null;
  }

  return {
    hours,
    minutes,
    seconds,
  };
}

export function parseSpotlightYPosition(value: string | undefined): number | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }

  const position = Number(value);

  if (!Number.isFinite(position)) {
    return undefined;
  }

  return clamp(Math.round(position), 0, 100);
}

export function resolveSpotlightPositionPercentage(
  spotlightPositionAsof: string | undefined,
  now = new Date(),
  spotlightYPosition?: number,
): SpotlightCardPositionPercentage {
  if (spotlightYPosition !== undefined) {
    return clamp(spotlightYPosition, 0, 100);
  }

  const asof = parseSpotlightPositionAsof(spotlightPositionAsof);
  const minute = asof?.minutes ?? now.getMinutes();
  const bucketIndex = clamp(
    Math.floor(minute / minutesPerSpotlightPositionBucket),
    0,
    spotlightCardPositionPercentages.length - 1,
  );

  return spotlightCardPositionPercentages[bucketIndex];
}

export function calculateSpotlightCardTop({
  cardHeight,
  mainContentBottom,
  mainContentTop,
  positionPercentage,
  viewportHeight,
}: SpotlightCardTopInput) {
  const normalizedViewportHeight = Math.max(0, viewportHeight);
  const normalizedCardHeight = clamp(cardHeight, 0, normalizedViewportHeight);
  const maxTop = Math.max(0, normalizedViewportHeight - normalizedCardHeight);
  const visibleMainContentTop = clamp(mainContentTop, 0, normalizedViewportHeight);
  const visibleMainContentBottom = clamp(mainContentBottom, 0, normalizedViewportHeight);

  if (visibleMainContentBottom - visibleMainContentTop < normalizedCardHeight) {
    return Math.round(clamp(visibleMainContentTop, 0, maxTop));
  }

  const rangeStart = clamp(visibleMainContentTop, 0, maxTop);
  const rangeEnd = clamp(visibleMainContentBottom - normalizedCardHeight, rangeStart, maxTop);
  const ratio = clamp(positionPercentage, 0, 100) / 100;

  return Math.round(rangeStart + (rangeEnd - rangeStart) * ratio);
}
