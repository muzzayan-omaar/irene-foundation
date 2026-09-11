"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function AdminDeleteButton({
  endpoint,
  id,
  confirmMessage = "Delete this permanently? This cannot be undone.",
}: {
  endpoint: string;
  id: string;
  confirmMessage?: string;
}) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(confirmMessage)) return;

    setDeleting(true);
    const res = await fetch(`${endpoint}?id=${id}`, { method: "DELETE" });

    if (!res.ok) {
      showToast("Failed to delete", "error");
      setDeleting(false);
      return;
    }

    showToast("Deleted");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      aria-label="Delete"
      className="text-red-400 hover:text-red-600 p-1.5 disabled:opacity-50"
    >
      <Trash2 size={16} />
    </button>
  );
}