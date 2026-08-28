import Link from 'next/link'


export default function Dashboard() {
  return (
    <section className="min-h-screen bg-slate-400 p-6">
          <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      <Link href="/dashboard/DataAnalytics" className="mr-4 rounded bg-white px-4 py-2 text-purple-600">
        Data Analytics
      </Link>
      <Link href="/dashboard/SeoAnalytics" className="rounded bg-white px-4 py-2 text-purple-600">
        SEO Analytics
      </Link>
    </section>
  );
}
