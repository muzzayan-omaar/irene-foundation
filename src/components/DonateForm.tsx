"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donateSchema, type DonateFormInput, type DonateInput } from "@/lib/schemas/donate";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const PRESET_AMOUNTS: Record<"USD" | "UGX", number[]> = {
  USD: [10, 25, 50, 100],
  UGX: [5000, 10000, 20000, 50000],
};

export default function DonateForm({ campaignId }: { campaignId?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { t } = useLocale();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DonateFormInput, unknown, DonateInput>({
    resolver: zodResolver(donateSchema),
    defaultValues: {
      currency: "USD",
      frequency: "ONE_TIME",
      isAnonymous: false,
      campaignId,
    },
  });

  const selectedAmount = watch("amount");
  const frequency = watch("frequency");
  const currency = watch("currency") as "USD" | "UGX";

  async function onSubmit(data: DonateInput) {
    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      // Send the donor to Flutterwave's hosted checkout
      window.location.href = result.checkoutLink;
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md w-full space-y-6">
      {/* Frequency toggle */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200">
        <button
          type="button"
          onClick={() => setValue("frequency", "ONE_TIME")}
          className={`flex-1 py-2 text-sm font-medium ${
            frequency === "ONE_TIME"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600"
          }`}
        >
          {t("donate_giveOnce")}
        </button>
        <button
          type="button"
          onClick={() => setValue("frequency", "MONTHLY")}
          className={`flex-1 py-2 text-sm font-medium ${
            frequency === "MONTHLY"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600"
          }`}
        >
          {t("donate_giveMonthly")}
        </button>
      </div>

      {/* Currency toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("donate_currencyLabel")}
        </label>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-1">
          <button
            type="button"
            onClick={() => {
              setValue("currency", "USD");
              setValue("amount", undefined as unknown as number);
            }}
            className={`flex-1 py-2 text-sm font-medium ${
              currency === "USD"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            USD ($)
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("currency", "UGX");
              setValue("amount", undefined as unknown as number);
            }}
            className={`flex-1 py-2 text-sm font-medium ${
              currency === "UGX"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            UGX (Shillings)
          </button>
        </div>
        <p className="text-xs text-gray-400">
          {currency === "UGX"
            ? t("donate_currencyHint_ugx")
            : t("donate_currencyHint_usd")}
        </p>
      </div>

      {/* Amount presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("donate_amountLabel")}
        </label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {PRESET_AMOUNTS[currency || "USD"].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setValue("amount", amt)}
              className={`py-2 rounded-md border text-sm font-medium ${
                selectedAmount === amt
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              {currency === "UGX" ? amt.toLocaleString() : `$${amt}`}
            </button>
          ))}
        </div>
        <label htmlFor="donate-amount" className="sr-only">
          {t("donate_customAmount")}
        </label>
        <input
          id="donate-amount"
          type="number"
          step="0.01"
          placeholder={t("donate_customAmount")}
          {...register("amount")}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Donor details */}
      <div className="space-y-3">
        <div>
          <label htmlFor="donate-fullName" className="sr-only">
            {t("donate_fullName")}
          </label>
          <input
            id="donate-fullName"
            type="text"
            placeholder={t("donate_fullName")}
            {...register("fullName")}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="donate-email" className="sr-only">
            {t("donate_email")}
          </label>
          <input
            id="donate-email"
            type="email"
            placeholder={t("donate_email")}
            {...register("email")}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <label htmlFor="donate-phone" className="sr-only">
          {t("donate_phone")}
        </label>
        <input
          id="donate-phone"
          type="tel"
          placeholder={t("donate_phone")}
          {...register("phone")}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />

        <label htmlFor="donate-country" className="sr-only">
          {t("donate_country")}
        </label>
        <input
          id="donate-country"
          type="text"
          placeholder={t("donate_country")}
          {...register("country")}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />

        <label htmlFor="donate-message" className="sr-only">
          {t("donate_message")}
        </label>
        <textarea
          id="donate-message"
          placeholder={t("donate_message")}
          {...register("message")}
          rows={3}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" {...register("isAnonymous")} />
          {t("donate_anonymous")}
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" {...register("isSubscribed")} />
          {t("donate_subscribe")}
        </label>

        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            {...register("agreedToTerms")}
            className="mt-0.5"
          />
          <span>
            {t("donate_agreeText")}{" "}
            <Link href="/terms" target="_blank" className="underline hover:text-gray-900">
              {t("donate_termsLink")}
            </Link>{" "}
            {t("donate_and")}{" "}
            <Link href="/privacy" target="_blank" className="underline hover:text-gray-900">
              {t("donate_privacyLink")}
            </Link>
          </span>
        </label>
        {errors.agreedToTerms && (
          <p className="text-red-500 text-xs">{errors.agreedToTerms.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-red-500 text-sm">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gray-900 text-white py-3 rounded-md font-medium disabled:opacity-50"
      >
        {submitting ? t("donate_submitting") : t("donate_submit")}
      </button>
    </form>
  );
}