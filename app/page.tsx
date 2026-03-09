import Link from 'next/link';
import Image from 'next/image'; // Assuming you'll want to use the Next.js Image component

export default function HomePage() {
  const botFeatures = [
    {
      id: '01',
      title: 'Instant Loan Inquiries',
      description: 'Customers can query their current loan balance and status using their unique Loan Code.',
    },
    {
      id: '02',
      title: 'Automated State Handling',
      description: 'The bot utilizes a specialized service layer to pull real-time data directly from the backend.',
    },
    {
      id: '03',
      title: 'Menu-Driven UX',
      description:
        'A simple, numeric menu system (/start) guides users, making it accessible even for non-technical users.',
    },
    {
      id: '04',
      title: 'Real-Time Notifications',
      description:
        'The infrastructure is ready to push alerts for upcoming due dates, helping customers avoid late fees.',
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
          <span className="text-4xl font-bold text-white">L</span>
        </div>
        <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">Welcome to Loy Pawn Shop</h1>
        <p className="mb-10 max-w-2xl text-lg text-gray-600 md:text-xl">
          Providing fast, secure, and reliable collateral loan services. We are committed to transparency, trust, and
          modern financial convenience for every customer.
        </p>
        <Link
          href="/login"
          className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700"
        >
          Login to Your Account
        </Link>
        <p className="mt-4 text-sm text-gray-400">Staff access only</p>
      </section>

      {/* Core Values Section */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 text-center md:grid-cols-3">
          <div className="rounded-xl border p-8 shadow-sm transition hover:shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Fast Loan Processing</h3>
            <p className="text-gray-600">
              Quick and efficient approval process to support customers when they need it most.
            </p>
          </div>
          <div className="rounded-xl border p-8 shadow-sm transition hover:shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Transparent Service</h3>
            <p className="text-gray-600">
              Clear interest calculation and detailed loan information with no hidden surprises.
            </p>
          </div>
          <div className="rounded-xl border p-8 shadow-sm transition hover:shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Secure & Reliable</h3>
            <p className="text-gray-600">Customer records are securely managed and protected with modern systems.</p>
          </div>
        </div>
      </section>

      {/* Telegram Bot Integration Section */}
      <section className="bg-blue-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight uppercase">Telegram Bot Integration</h2>
              <p className="mb-6 text-xl leading-relaxed text-blue-100">
                The <span className="font-bold text-white">Loy Pawn Shop Assistant</span> is the centerpiece of our
                customer-facing technology. It serves as a 24/7 digital concierge, allowing customers to interact with
                the system without human intervention, significantly reducing the workload for shop staff.
              </p>
              <div className="inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium">
                Try it now: @LoyPawnBot
              </div>
            </div>

            {/* Feature List mimicking the slide design */}
            <div className="space-y-6">
              {botFeatures.map(feature => (
                <div key={feature.id} className="flex items-center gap-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-blue-400 text-2xl font-bold">
                    {feature.id}
                  </div>
                  <div className="relative flex-1 rounded-r-full bg-blue-700 py-4 pr-8 pl-6 shadow-lg">
                    {/* The "Arrow" point effect */}
                    <div className="absolute top-1/2 -left-4 h-0 w-0 -translate-y-1/2 border-y-[15px] border-r-[15px] border-y-transparent border-r-blue-700"></div>
                    <h4 className="font-bold tracking-wide uppercase">{feature.title}</h4>
                    <p className="text-sm text-blue-100">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Loy Pawn Shop. All rights reserved.
      </footer>
    </main>
  );
}
