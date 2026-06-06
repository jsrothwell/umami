'use client';
import { Column, Text } from '@umami/react-zen';
import { WebsiteControls } from '@/app/(main)/websites/[websiteId]/WebsiteControls';
import { Panel } from '@/components/common/Panel';
import { useDateRange } from '@/components/hooks';
import { UTM } from './UTM';

export function UTMPage({ websiteId }: { websiteId: string }) {
  const {
    dateRange: { startDate, endDate },
  } = useDateRange();

  return (
    <Column gap>
      <WebsiteControls websiteId={websiteId} />
      <Panel>
        <Text color="muted" size="sm">
          UTM report tracks campaign parameters in URLs. For mobile apps, pass UTM values as custom
          event properties (e.g. <code>utm_source</code>, <code>utm_campaign</code>) using the
          identify or event API instead.
        </Text>
      </Panel>
      <UTM websiteId={websiteId} startDate={startDate} endDate={endDate} />
    </Column>
  );
}
