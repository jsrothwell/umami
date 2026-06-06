'use client';
import { Column, Text } from '@umami/react-zen';
import { WebsiteControls } from '@/app/(main)/websites/[websiteId]/WebsiteControls';
import { Panel } from '@/components/common/Panel';
import { useDateRange } from '@/components/hooks';
import { Performance } from './Performance';

export function PerformancePage({ websiteId }: { websiteId: string }) {
  const {
    dateRange: { startDate, endDate, unit },
  } = useDateRange();

  return (
    <Column gap>
      <WebsiteControls websiteId={websiteId} />
      <Panel>
        <Text color="muted" size="sm">
          Performance report tracks Web Vitals (LCP, INP, CLS, FCP, TTFB) collected by a browser.
          This data is not available for native mobile apps.
        </Text>
      </Panel>
      <Performance websiteId={websiteId} startDate={startDate} endDate={endDate} unit={unit} />
    </Column>
  );
}
