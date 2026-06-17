import { FloatingSpotlightCard } from "@/components/sections/site-notice/floating-spotlight-card";
import { TopAnnouncementBar } from "@/components/sections/site-notice/top-announcement-bar";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { getActiveSiteNoticeFeaturedContent } from "@/lib/site-notice";

type SiteNoticeSurfaceProps = {
  className?: string;
  spotlightPositionAsof?: string;
  spotlightYPosition?: number;
};

export function SiteNoticeSurface({ className, spotlightPositionAsof, spotlightYPosition }: SiteNoticeSurfaceProps = {}) {
  const content = getActiveSiteNoticeFeaturedContent();

  if (!content) {
    return null;
  }

  return (
    <div {...componentNameDebugProps("SiteNoticeSurface")} className={className}>
      <TopAnnouncementBar content={content} />
      <FloatingSpotlightCard
        items={content.items}
        nextLabel={content.nextLabel}
        previousLabel={content.previousLabel}
        spotlightCtaLabel={content.spotlightCtaLabel}
        spotlightDismissLabel={content.spotlightDismissLabel}
        spotlightLabel={content.spotlightLabel}
        spotlightPositionAsof={spotlightPositionAsof}
        spotlightYPosition={spotlightYPosition}
      />
    </div>
  );
}
