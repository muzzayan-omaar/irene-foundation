"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CloudinaryUploadButton from "./CloudinaryUploadButton";

type PressMentionFormValues = {
  id?: string;
  outletName: string;
  title: string;
  url: string;
  logoUrl?: string;
  publishedDate?: string; // yyyy-mm-dd from <input type="date">
};

export default function PressMentionForm({
  initialValues,
}: {
  initialValues?: PressMentionFormValues;
}) {
  const isEditing = Boolean(initialValues?.id);
  const [values, setValues] = useState<PressMentionFormValues>(
    initialValues ?? {
      outletName: "",
      title: "",
      url: "",
      logoUrl: "",
      publishedDate: "",
    }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function update<K extends keyof PressMentionFormValues>(
    key: K,
    value: PressMentionFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/press", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Something went wrong");
      setSubmitting(false);
      return;
    }

    router.push("/admin/press");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Outlet Name</label>
        <input
          value={values.outletName}
          onChange={(e) => update("outletName", e.target.value)}
          required
          placeholder="Daily Monitor"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Article Title</label>
        <input
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          required
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Article URL</label>
        <input
          value={values.url}
          onChange={(e) => update("url", e.target.value)}
          required
          placeholder="https://..."
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Outlet Logo</label>
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
        <label className="block text-sm font-medium mb-1">Published Date</label>
        <input
          type="date"
          value={values.publishedDate}
          onChange={(e) => update("publishedDate", e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-gray-900 text-white px-5 py-2.5 rounded-md text-sm font-medium disabled:opacity-50"
      >
        {submitting ? "Saving..." : isEditing ? "Save Changes" : "Add Mention"}
      </button>
    </form>
  );
}