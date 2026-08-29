"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CloudinaryUploadButton from "./CloudinaryUploadButton";

type CampaignFormValues = {
  id?: string;
  title: string;
  slug: string;
  story: string;
  coverImage?: string;
  goalAmount: number | string;
  currency: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "PAUSED";
};

export default function CampaignForm({
  initialValues,
}: {
  initialValues?: CampaignFormValues;
}) {
  const isEditing = Boolean(initialValues?.id);
  const [values, setValues] = useState<CampaignFormValues>(
    initialValues ?? {
      title: "",
      slug: "",
      story: "",
      coverImage: "",
      goalAmount: "",
      currency: "USD",
      status: "DRAFT",
    }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function update<K extends keyof CampaignFormValues>(
    key: K,
    value: CampaignFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/campaigns", {
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

    router.push("/admin/campaigns");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          required
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          value={values.slug}
          onChange={(e) => update("slug", e.target.value)}
          required
          placeholder="clean-water-kityerera"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">
          Used in the URL: /campaigns/{values.slug || "..."}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Story</label>
        <textarea
          value={values.story}
          onChange={(e) => update("story", e.target.value)}
          required
          rows={5}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

    <div>
    <label className="block text-sm font-medium mb-1">Cover Image</label>
    <div className="flex items-center gap-3">
        <CloudinaryUploadButton onUpload={(url) => update("coverImage", url)} />
        {values.coverImage && (
        <span className="text-xs text-gray-400 truncate max-w-[200px]">
            {values.coverImage}
        </span>
        )}
    </div>
    </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Goal Amount</label>
          <input
            type="number"
            value={values.goalAmount}
            onChange={(e) => update("goalAmount", e.target.value)}
            required
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <input
            value={values.currency}
            onChange={(e) => update("currency", e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={values.status}
          onChange={(e) =>
            update("status", e.target.value as CampaignFormValues["status"])
          }
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-gray-900 text-white px-5 py-2.5 rounded-md text-sm font-medium disabled:opacity-50"
      >
        {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Campaign"}
      </button>
    </form>
  );
}