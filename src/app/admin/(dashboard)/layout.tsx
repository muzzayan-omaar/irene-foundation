import Link from "next/link";
import SignOutButton from "@/components/admin/SignOutButton";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin" },
  { label: "Campaigns", href: "/admin/campaigns" },
  { label: "Activities", href: "/admin/activities" },
  { label: "Wall of Support", href: "/admin/wall-of-support" },
  { label: "Press", href: "/admin/press" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Partners", href: "/admin/partners" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r border-gray-100 p-5 flex flex-col justify-between">
        <div>
          <h2 className="font-semibold mb-6">Foundation Admin</h2>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <SignOutButton />
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}