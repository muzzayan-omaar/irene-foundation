import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import SupportPostForm from "@/components/admin/SupportPostForm";

export default async function EditSupportPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.supportPost.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Support Post</h1>
      <SupportPostForm
        initialValues={{
          id: post.id,
          authorName: post.authorName,
          platform: post.platform,
          content: post.content,
          imageUrl: post.imageUrl ?? "",
          sourceUrl: post.sourceUrl ?? "",
          isFeatured: post.isFeatured,
        }}
      />
    </div>
  );
}