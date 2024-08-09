import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Website } from '@/lib/types';
import Header from './header';
import ResponseTimeChart from './charts/response-time-chart';

export default async function MonitoringOverview({ website }: { website: Website | undefined }) {
  if (!website) return null;

  const host = new URL(website.url).hostname;

  try {
    const response = await fetch(
      `${process.env.URL}/api/whoIs?host=${encodeURIComponent(host)}`
    );

    console.log('Response:', response);

    if (!response.ok) {
      console.error('Failed to fetch WHOIS data:', response.status, response.statusText);
      return;
    }

    const data = await response.json();
    console.log('WHOIS data:', data);

  } catch (error) {
    console.error('Error fetching WHOIS data:', error);
  }

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <div className='flex flex-col sm:gap-4 sm:py-4'>
        <Header />
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
          <Card x-chunk='dashboard-06-chunk-0'>
            <CardHeader className='flex flex-row items-end justify-between w-full'>
              <div className='hidden sm:block space-y-2'>
                <CardTitle>Overview</CardTitle>
                <CardDescription>{website.url}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ResponseTimeChart healthChecks={website.healthChecks} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
