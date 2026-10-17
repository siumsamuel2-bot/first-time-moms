import { type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface Provider {
  id: string;
  name: string;
  credentials: string;
  specialties: string[];
  insurance: string[];
  distance: string;
  rating: number;
  reviews: number;
  imageUrl?: string;
}

export interface WarmReferralCardProps extends HTMLAttributes<HTMLDivElement> {
  provider: Provider;
  onRequestContact: (providerId: string) => void;
  onViewDetails: (providerId: string) => void;
  requestSent?: boolean;
}

export function WarmReferralCard({
  provider,
  onRequestContact,
  onViewDetails,
  requestSent = false,
  className,
  ...props
}: WarmReferralCardProps) {
  const fullStars = Math.floor(provider.rating);
  const emptyStars = 5 - fullStars;

  return (
    <div
      className={cn(
        "bg-white rounded-lg p-4 mb-3 border border-esc-indigo-100",
        "shadow-sm hover:shadow-elevated transition-shadow duration-150",
        className,
      )}
      role="article"
      aria-label={`Provider: ${provider.name}`}
      {...props}
    >
      <button
        type="button"
        onClick={() => onViewDetails(provider.id)}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-esc-indigo-400 focus:ring-offset-2 rounded touch-target"
      >
        <div className="flex items-start gap-3 mb-2.5">
          <div
            className="w-13 h-13 rounded-full bg-esc-indigo-100 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            {provider.imageUrl ? (
              <img
                src={provider.imageUrl}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-esc-indigo-500">
                {provider.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-esc-slate-800 truncate">
              {provider.name}
            </h3>
            <p className="text-xs text-esc-slate-600 mt-0.5">{provider.credentials}</p>
            <p className="text-xs text-esc-amber-500 mt-0.5" aria-label={`${provider.rating} out of 5 stars, ${provider.reviews} reviews`}>
              {"★".repeat(fullStars)}
              {"☆".repeat(emptyStars)}
              {" "}
              <span className="text-esc-slate-200">({provider.reviews} reviews)</span>
            </p>
          </div>
        </div>
      </button>

      <div className="flex flex-wrap gap-1.5 mb-2">
        {provider.specialties.map((s, i) => (
          <span
            key={i}
            className="text-xs text-esc-indigo-500 bg-esc-indigo-50 rounded px-2 py-0.5"
          >
            {s}
          </span>
        ))}
      </div>

      <p className="text-xs text-esc-slate-600 mb-2.5">
        Accepts {provider.insurance.join(", ")}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-esc-slate-600">{provider.distance}</span>
        <button
          type="button"
          onClick={() => onRequestContact(provider.id)}
          disabled={requestSent}
          className={cn(
            "px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 touch-target",
            "focus:outline-none focus:ring-2 focus:ring-esc-indigo-400 focus:ring-offset-2",
            requestSent
              ? "bg-esc-sage-100 text-esc-sage-500 cursor-default"
              : "bg-esc-indigo-500 text-white hover:bg-esc-indigo-600 active:scale-[0.97]",
          )}
        >
          {requestSent ? "Request sent ✓" : "Request Contact"}
        </button>
      </div>
    </div>
  );
}
