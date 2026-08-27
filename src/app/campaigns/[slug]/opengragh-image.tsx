import { ImageResponse } from "next/og";
import { getCampaignBySlug } from "@/lib/campaigns";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const campaign = await getCampaignBySlug(params.slug);

  if (!campaign) {
    return new ImageResponse(<div>Campaign not found</div>, size);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 60,
          background: "#111827",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7 }}>Irene Namatovu Foundation</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>
            {campaign.title}
          </div>

          <div
            style={{
              width: "100%",
              height: 24,
              background: "#374151",
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div
              style={{
                width: `${campaign.progressPercent}%`,
                height: "100%",
                background: "white",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 32 }}>
            <div>
              {campaign.currency} {campaign.raisedAmount.toLocaleString()} raised
            </div>
            <div style={{ opacity: 0.7 }}>
              of {campaign.currency} {campaign.goalAmount.toString()}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}