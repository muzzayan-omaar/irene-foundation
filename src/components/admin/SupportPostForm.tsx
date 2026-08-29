"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CloudinaryUploadButton from "./CloudinaryUploadButton";

type SupportPostFormValues = {
  id?: string;
  authorName: string;
  platform: "INSTAGRAM" | "TWITTER" | "FACEBOOK" | "TIKTOK" | "OTHER";
  content: string;
  imageUrl?: string;
  sourceUrl?: string;
  isFeatured: boolean;
};

export default function SupportPostForm({
  initialValues,
}: {
  initialValues?: SupportPostFormValues;
}) {
  const isEditing = Boolean(initialValues?.id);
  const [values, setValues] = useState<SupportPostFormValues>(
    initialValues ?? {
      authorName: "",
      platform: "OTHER",
      content: "",
      imageUrl: "",
      sourceUrl: "",
      isFeatured: true,
    }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function update<K extends keyof SupportPostFormValues>(
    key: K,
    value: SupportPostFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/support-posts", {
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

    router.push("/admin/wall-of-support");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Author Name</label>
        <input
          value={values.authorName}
          onChange={(e) => update("authorName", e.target.value)}
          required
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Platform</label>
        <select
          value={values.platform}
          onChange={(e) =>
            update("platform", e.target.value as SupportPostFormValues["platform"])
          }
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="INSTAGRAM">Instagram</option>
          <option value="TWITTER">X / Twitter</option>
          <option value="FACEBOOK">Facebook</option>
          <option value="TIKTOK">TikTok</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Post Content</label>
        <textarea
          value={values.content}
          onChange={(e) => update("content", e.target.value)}
          required
          rows={3}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <div className="flex items-center gap-3">
          <CloudinaryUploadButton onUpload={(url) => update("imageUrl", url)} />
          {values.imageUrl && (
            <span className="text-xs text-gray-400 truncate max-w-[200px]">
              {values.imageUrl}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Source URL (link to original post, optional)
        </label>
        <input
          value={values.sourceUrl}
          onChange={(e) => update("sourceUrl", e.target.value)}
          placeholder="https://instagram.com/p/..."
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.isFeatured}
          onChange={(e) => update("isFeatured", e.target.checked)}
        />
        Show on Wall of Support
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-gray-900 text-white px-5 py-2.5 rounded-md text-sm font-medium disabled:opacity-50"
      >
        {submitting ? "Saving..." : isEditing ? "Save Changes" : "Add Post"}
      </button>
    </form>
  );
}