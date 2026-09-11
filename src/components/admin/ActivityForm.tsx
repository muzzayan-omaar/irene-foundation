"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import CloudinaryUploadButton from "./CloudinaryUploadButton";

type ActivityFormValues = {
  id?: string;
  title: string;
  slug: string;
  type: "UPDATE" | "PHOTO_STORY" | "VIDEO" | "POD";
  body: string;
  mediaUrls: string[];
  campaignId?: string;
  isPublished: boolean;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
      mediaUrls: [],
      campaignId: "",
      isPublished: false,
    }
  );
  // Once editing an existing activity, or once the person has typed directly
  // into the slug field, stop auto-generating it from the title.
  const [slugTouched, setSlugTouched] = useState(isEditing);
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

  function handleTitleChange(title: string) {
    setValues((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugify(title),
    }));
  }

  function addMediaUrl(url: string) {
    setValues((prev) => ({ ...prev, mediaUrls: [...prev.mediaUrls, url] }));
  }

  function removeMediaUrl(index: number) {
    setValues((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...values,
      campaignId: values.campaignId || undefined,
    };

    const res = await fetch("/api/admin/activities", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Something went wrong");
      showToast(result.error || "Something went wrong", "error");
      setSubmitting(false);
      return;
    }

    showToast(isEditing ? "Activity updated" : "Activity created");
    router.push("/admin/activities");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          value={values.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            update("slug", e.target.value);
          }}
          required
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">
          Auto-generated from the title — edit directly if you want something different. URL: /field-notes/{values.slug || "..."}
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

      {/* Real upload UI instead of a comma-separated URL field */}
      <div>
        <label className="block text-sm font-medium mb-1">Media</label>
        <CloudinaryUploadButton
          label={values.type === "PHOTO_STORY" ? "Add Photo" : "Upload Media"}
          multiple={values.type === "PHOTO_STORY"}
          onUpload={addMediaUrl}
        />
        {values.mediaUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {values.mediaUrls.map((url, i) => (
              <div key={i} className="relative">
                {values.type === "VIDEO" ? (
                  <video src={url} className="h-16 w-16 object-cover rounded-md" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="h-16 w-16 object-cover rounded-md" />
                )}
                <button
                  type="button"
                  onClick={() => removeMediaUrl(i)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">
          For Photo Story, add as many as you like. For Video/Pod, just the one file.
        </p>
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
        className="bg-gray-900 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Activity"}
      </button>
    </form>
  );
}