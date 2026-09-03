"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CloudinaryUploadButton from "./CloudinaryUploadButton";
import { useToast } from "@/components/ui/ToastProvider";

type ActivityFormValues = {
  id?: string;
  title: string;
  slug: string;
  type: "UPDATE" | "PHOTO_STORY" | "VIDEO" | "POD";
  body: string;
  mediaUrls: string; // comma-separated in the form, split into an array on submit
  campaignId?: string;
  isPublished: boolean;
};

export default function ActivityForm({
  initialValues,
  campaigns,
}: {
  initialValues?: ActivityFormValues;
  campaigns: { id: string; title: string }[];
}) {
  const isEditing = Boolean(initialValues?.id);
  const [values, setValues] = useState<ActivityFormValues>(
    initialValues ?? {
      title: "",
      slug: "",
      type: "UPDATE",
      body: "",
      mediaUrls: "",
      campaignId: "",
      isPublished: false,
    }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  function update<K extends keyof ActivityFormValues>(
    key: K,
    value: ActivityFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...values,
      mediaUrls: values.mediaUrls
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
      campaignId: values.campaignId || undefined,
    };

    const res = await fetch("/api/admin/activities", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      showToast(result.error || "Something went wrong", "error");
      setSubmitting(false);
      return;
    }

    showToast("Saved successfully");
    router.push("/admin/activities");
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
          placeholder="new-water-point"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">
          Used in the URL: /field-notes/{values.slug || "..."}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          value={values.type}
          onChange={(e) => update("type", e.target.value as ActivityFormValues["type"])}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="UPDATE">Update</option>
          <option value="PHOTO_STORY">Photo Story</option>
          <option value="VIDEO">Video</option>
          <option value="POD">Pod</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Body</label>
        <textarea
          value={values.body}
          onChange={(e) => update("body", e.target.value)}
          required
          rows={5}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Media</label>
        <div className="flex items-center gap-3 mb-2">
          <CloudinaryUploadButton
            label="Upload Media"
            onUpload={(url) =>
              update(
                "mediaUrls",
                values.mediaUrls ? `${values.mediaUrls}, ${url}` : url
              )
            }
          />
        </div>
        {values.mediaUrls && (
          <p className="text-xs text-gray-400 break-all">{values.mediaUrls}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Linked Campaign (optional)
        </label>
        <select
          value={values.campaignId}
          onChange={(e) => update("campaignId", e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">— None (general update) —</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.isPublished}
          onChange={(e) => update("isPublished", e.target.checked)}
        />
        Publish immediately
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-gray-900 text-white px-5 py-2.5 rounded-md text-sm font-medium active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Activity"}
      </button>
    </form>
  );
}