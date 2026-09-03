"use client";

import { useEffect, useState } from "react";

type Inquiry = {
  id: string;
  type: "PARTNER" | "IN_KIND" | "VOLUNTEER";
  fullName: string;
  email: string;
  phone: string | null;
  organizationName: string | null;
  message: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: string;
};

const TYPE_LABELS: Record<Inquiry["type"], string> = {
  PARTNER: "Partner",
  IN_KIND: "In-Kind",
  VOLUNTEER: "Volunteer",
};

export default function AdminInquiriesClient({
  initialInquiries,
}: {
  initialInquiries: Inquiry[];
}) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [filter, setFilter] = useState<"ALL" | Inquiry["type"]>("ALL");

  async function updateStatus(id: string, status: Inquiry["status"]) {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );

    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  useEffect(() => {
    setInquiries(initialInquiries);
  }, [initialInquiries]);

  const filtered =
    filter === "ALL" ? inquiries : inquiries.filter((i) => i.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["ALL", "PARTNER", "IN_KIND", "VOLUNTEER"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-sm ${
              filter === t ? "bg-gray-900 text-white" : "border border-gray-200"
            }`}
          >
            {t === "ALL" ? "All" : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No inquiries in this category.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((inquiry) => (
            <div key={inquiry.id} className="p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mr-2">
                    {TYPE_LABELS[inquiry.type]}
                  </span>
                  <span className="font-medium">{inquiry.fullName}</span>
                  {inquiry.organizationName && (
                    <span className="text-gray-500"> · {inquiry.organizationName}</span>
                  )}
                </div>
                <select
                  value={inquiry.status}
                  onChange={(e) =>
                    updateStatus(inquiry.id, e.target.value as Inquiry["status"])
                  }
                  className="text-xs border border-gray-200 rounded-md px-2 py-1"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <p className="text-sm text-gray-600 mb-2">{inquiry.message}</p>
              <p className="text-xs text-gray-400">
                {inquiry.email}
                {inquiry.phone && ` · ${inquiry.phone}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}