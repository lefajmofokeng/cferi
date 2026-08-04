import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminApplicationsPage() {
  const supabase = await createClient();

  const { data: applications, error } = await supabase
    .from("incubation_applications")
    .select("id, full_name, business_name, business_stage, status, submitted_at")
    .order("submitted_at", { ascending: false });

  if (error) {
    return (
      <main className="px-8 py-8">
        <p className="text-red-600">Failed to load applications: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="px-8 py-8">
      <h1 className="text-2xl font-semibold mb-6">Incubation Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications yet.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-200 text-gray-500">
              <th className="py-2 pr-4">Applicant</th>
              <th className="py-2 pr-4">Business</th>
              <th className="py-2 pr-4">Stage</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Submitted</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-gray-100">
                <td className="py-3 pr-4">{app.full_name}</td>
                <td className="py-3 pr-4 text-gray-600">
                  {app.business_name || "—"}
                </td>
                <td className="py-3 pr-4 text-gray-600 capitalize">
                  {app.business_stage?.replace("_", " ") || "—"}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      app.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : app.status === "reviewing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-500">
                  {new Date(app.submitted_at).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4">
                  <Link
                    href={`/admin/applications/${app.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}