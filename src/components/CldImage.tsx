// components/CldImage.tsx  (or src/components/CldImage.tsx)
"use client";

import { CldImage as CldImageDefault, type CldImageProps } from "next-cloudinary";

export default function CldImage(props: CldImageProps) {
  return <CldImageDefault {...props} />;
}