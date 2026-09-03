"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import CloudinaryUploadButton from "./CloudinaryUploadButton";

type PartnerFormValues = {
  id?: string;
  name: string;
  logoUrl?: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  status: "ACTIVE" | "PAST" | "PROSPECTIVE";
  notes?: string;
};

export default function PartnerForm({
  initialValues,
}: {
  initialValues?: PartnerFormValues;
}) {
  const isEditing = Boolean(initialValues?.id);
  const [values, setValues] = useState<PartnerFormValues>(
    initialValues ?? {
      name: "",
      logoUrl: "",
      website: "",
      contactName: "",
      contactEmail: "",
      status: "PROSPECTIVE",
      notes: "",
    }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  function update<K extends keyof PartnerFormValues>(
    key: K,
    value: PartnerFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/partners", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Something went wrong");
      showToast(result.error || "Something went wrong", "error");
      setSubmitting(false);
      return;
    }

    showToast(isEditing ? "Partner updated" : "Partner added");
    router.push("/admin/partners");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Organization Name</label>
        <input
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          required
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Logo</label>
        <div className="flex items-center gap-3">
          <CloudinaryUploadButton
            label="Upload Logo"
            onUpload={(url) => update("logoUrl", url)}
          />
          {values.logoUrl && (
            <span className="text-xs text-gray-400 truncate max-w-[200px]">
              {values.logoUrl}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Website</label>
        <input
          value={values.website}
          onChange={(e) => update("website", e.target.value)}
          placeholder="https://..."
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Contact Name</label>
          <input
            value={values.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Email</label>
          <input
            type="email"
            value={values.contactEmail}
            onChange={(e) => update("contactEmail", e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={values.status}
          onChange={(e) =>
            update("status", e.target.value as PartnerFormValues["status"])
          }
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="PROSPECTIVE">Prospective</option>
          <option value="ACTIVE">Active</option>
          <option value="PAST">Past</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">
          Only &quot;Active&quot; partners appear publicly on the site.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Internal Notes (not shown publicly)
        </label>
        <textarea
          value={values.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-gray-900 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Saving..." : isEditing ? "Save Changes" : "Add Partner"}
      </button>
    </form>
  );
}
