"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import CloudinaryUploadButton from "./CloudinaryUploadButton";

type BudgetLine = { label: string; amount: number | string };

type CampaignFormValues = {
  id?: string;
  title: string;
  slug: string;
  story: string;
  coverImage?: string;
  galleryImages: string[];
  videoUrl?: string;
  budgetBreakdown: BudgetLine[];
  outcomes?: string;
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
      galleryImages: [],
      videoUrl: "",
      budgetBreakdown: [],
      outcomes: "",
      goalAmount: "",
      currency: "USD",
      status: "DRAFT",
    }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  function update<K extends keyof CampaignFormValues>(
    key: K,
    value: CampaignFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function addBudgetLine() {
    update("budgetBreakdown", [...values.budgetBreakdown, { label: "", amount: "" }]);
  }

  function updateBudgetLine(index: number, field: keyof BudgetLine, value: string) {
    const updated = [...values.budgetBreakdown];
    updated[index] = { ...updated[index], [field]: value };
    update("budgetBreakdown", updated);
  }

  function removeBudgetLine(index: number) {
    update(
      "budgetBreakdown",
      values.budgetBreakdown.filter((_, i) => i !== index)
    );
  }

  function removeGalleryImage(index: number) {
    update(
      "galleryImages",
      values.galleryImages.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Clean up budget lines — drop empty rows, coerce amounts to numbers
    const payload = {
      ...values,
      budgetBreakdown: values.budgetBreakdown
        .filter((line) => line.label.trim() !== "")
        .map((line) => ({ label: line.label, amount: Number(line.amount) || 0 })),
    };

    const res = await fetch("/api/admin/campaigns", {
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

    showToast(isEditing ? "Campaign updated" : "Campaign created");
    router.push("/admin/campaigns");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
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

      {/* Cover image */}
      <div>
        <label className="block text-sm font-medium mb-1">Cover Image</label>
        <div className="flex items-center gap-3">
          <CloudinaryUploadButton onUpload={(url) => update("coverImage", url)} />
          {values.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={values.coverImage} alt="" className="h-12 w-12 object-cover rounded-md" />
          )}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Gallery (additional photos)
        </label>
        <CloudinaryUploadButton
          label="Add Photo to Gallery"
          onUpload={(url) => update("galleryImages", [...values.galleryImages, url])}
        />
        {values.galleryImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {values.galleryImages.map((url, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-16 w-16 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Campaign Video (optional)
        </label>
        <div className="flex items-center gap-3">
          <CloudinaryUploadButton
            label="Upload Video"
            onUpload={(url) => update("videoUrl", url)}
          />
          {values.videoUrl && (
            <span className="text-xs text-gray-400 truncate max-w-[200px]">
              Video attached
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

      {/* Budget breakdown */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Budget Breakdown (optional)
        </label>
        <p className="text-xs text-gray-400 mb-2">
          e.g. &quot;School fees&quot; — 2,000,000. Shown as a visual breakdown on the campaign page.
        </p>
        <div className="space-y-2">
          {values.budgetBreakdown.map((line, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Label (e.g. School fees)"
                value={line.label}
                onChange={(e) => updateBudgetLine(i, "label", e.target.value)}
                className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Amount"
                value={line.amount}
                onChange={(e) => updateBudgetLine(i, "amount", e.target.value)}
                className="w-32 rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeBudgetLine(i)}
                className="text-red-500 text-sm px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addBudgetLine}
          className="text-sm text-gray-600 underline mt-2"
        >
          + Add budget line
        </button>
      </div>

      {/* Outcomes */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Outcomes (optional)
        </label>
        <p className="text-xs text-gray-400 mb-1">
          What has this campaign achieved so far? Shown on the campaign page whenever filled in.
        </p>
        <textarea
          value={values.outcomes}
          onChange={(e) => update("outcomes", e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
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
        className="bg-gray-900 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Campaign"}
      </button>
    </form>
  );
}