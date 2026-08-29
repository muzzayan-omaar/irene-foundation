"use client";

import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";

export default function CloudinaryUploadButton({
  onUpload,
  label = "Upload Image",
}: {
  onUpload: (url: string) => void;
  label?: string;
}) {
  function handleSuccess(result: CloudinaryUploadWidgetResults) {
    if (
      result.info &&
      typeof result.info === "object" &&
      "secure_url" in result.info
    ) {
      onUpload(result.info.secure_url as string);
    }
  }

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={handleSuccess}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
        >
          {label}
        </button>
      )}
    </CldUploadWidget>
  );
}