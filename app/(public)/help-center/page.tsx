export default function HelpCenterPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Help Center</h1>

      <section id="it-support" className="mb-10 scroll-mt-24">
        <h2 className="text-xl font-medium mb-2">IT Support</h2>
        <p className="text-gray-600">
          Having trouble accessing your account, the admin dashboard, or
          uploading documents? Reach out to our IT department at{" "}
          <a href="mailto:it-support@malutitvet.ac.za" className="text-blue-600 hover:underline">
            it-support@malutitvet.ac.za
          </a>{" "}
          for assistance.
        </p>
      </section>

      <section id="general-faq" className="mb-10 scroll-mt-24">
        <h2 className="text-xl font-medium mb-2">General FAQs</h2>
        <p className="text-gray-500">Content coming soon.</p>
      </section>
    </main>
  );
}