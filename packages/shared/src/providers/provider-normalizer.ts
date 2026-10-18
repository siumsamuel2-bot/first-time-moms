import { ProviderScreeningStatus, Specialty } from '../enums.js';
import type { Provider } from '../zod-schemas.js';

export const DEFAULT_PROVIDER_RADIUS_MILES = 25;
export const DEFAULT_NEXT_SLOT_DAYS = 7;

export interface NormalizedProviderLocation {
  lat: number;
  lng: number;
  address: string;
  radiusMiles: number;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface NormalizedProviderAvailability {
  nextSlotDays: number;
  slots: Array<{ date: string; times: string[] }>;
  days?: string[];
  hours?: { start: string; end: string };
  virtual?: boolean;
  inPerson?: boolean;
}

export interface NormalizedProviderContactInfo {
  phone: string;
  email: string;
  portalUrl?: string;
  website?: string;
  npi?: string;
}

type JsonObject = Record<string, unknown>;

const SPECIALTY_VALUES = new Set<string>(Object.values(Specialty));
const SCREENING_STATUS_VALUES = new Set<string>(Object.values(ProviderScreeningStatus));

function asObject(value: unknown): JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}

function asString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function pickNumber(object: JsonObject, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = asNumber(object[key]);
    if (value !== undefined) return value;
  }
  return undefined;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function normalizeSpecialties(value: unknown): Specialty[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Specialty => typeof item === 'string' && SPECIALTY_VALUES.has(item)
  );
}

function normalizeScreeningStatus(value: unknown): ProviderScreeningStatus {
  return typeof value === 'string' && SCREENING_STATUS_VALUES.has(value)
    ? (value as ProviderScreeningStatus)
    : ProviderScreeningStatus.PENDING;
}

function toIsoString(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return new Date(0).toISOString();
}

function normalizeSlot(value: unknown): { date: string; times: string[] } | undefined {
  const slot = asObject(value);
  const date = asString(slot.date);
  if (date === undefined) return undefined;
  return { date, times: normalizeStringArray(slot.times) };
}

export function normalizeProviderLocation(raw: unknown): NormalizedProviderLocation {
  const object = asObject(raw);
  const lat = pickNumber(object, ['lat', 'latitude']) ?? 0;
  const lng = pickNumber(object, ['lng', 'lon', 'longitude']) ?? 0;
  const rawRadius = pickNumber(object, ['radiusMiles', 'radius']) ?? DEFAULT_PROVIDER_RADIUS_MILES;
  const radiusMiles = Math.min(100, Math.max(1, Math.trunc(rawRadius)));

  const location: NormalizedProviderLocation = {
    lat,
    lng,
    address: asString(object.address) ?? '',
    radiusMiles,
  };

  const city = asString(object.city);
  const state = asString(object.state);
  const zipCode = asString(object.zipCode);
  if (city !== undefined) location.city = city;
  if (state !== undefined) location.state = state;
  if (zipCode !== undefined) location.zipCode = zipCode;

  return location;
}

export function normalizeProviderAvailability(raw: unknown): NormalizedProviderAvailability {
  const object = asObject(raw);
  const rawNextSlotDays = pickNumber(object, ['nextSlotDays']);
  const nextSlotDays =
    rawNextSlotDays === undefined
      ? DEFAULT_NEXT_SLOT_DAYS
      : Math.max(0, Math.trunc(rawNextSlotDays));

  const slots = Array.isArray(object.slots)
    ? object.slots
        .map(normalizeSlot)
        .filter((slot): slot is { date: string; times: string[] } => slot !== undefined)
    : [];

  const availability: NormalizedProviderAvailability = { nextSlotDays, slots };

  const days = normalizeStringArray(object.days);
  if (days.length > 0) availability.days = days;

  const hours = asObject(object.hours);
  const start = asString(hours.start);
  const end = asString(hours.end);
  if (start !== undefined && end !== undefined) availability.hours = { start, end };

  const virtual = asBoolean(object.virtual);
  const inPerson = asBoolean(object.inPerson);
  if (virtual !== undefined) availability.virtual = virtual;
  if (inPerson !== undefined) availability.inPerson = inPerson;

  return availability;
}

export function normalizeProviderContactInfo(raw: unknown): NormalizedProviderContactInfo {
  const object = asObject(raw);
  const contactInfo: NormalizedProviderContactInfo = {
    phone: asString(object.phone) ?? '',
    email: asString(object.email) ?? '',
  };

  const portalUrl = asString(object.portalUrl);
  const website = asString(object.website);
  const npi = asString(object.npi);
  if (portalUrl !== undefined) contactInfo.portalUrl = portalUrl;
  if (website !== undefined) contactInfo.website = website;
  if (npi !== undefined) contactInfo.npi = npi;

  return contactInfo;
}

export function normalizeProvider(raw: unknown): Provider {
  const object = asObject(raw);
  return {
    id: asString(object.id) ?? '',
    name: asString(object.name) ?? '',
    specialties: normalizeSpecialties(object.specialties),
    location: normalizeProviderLocation(object.location),
    insuranceAccepted: normalizeStringArray(object.insuranceAccepted),
    screeningStatus: normalizeScreeningStatus(object.screeningStatus),
    availability: normalizeProviderAvailability(object.availability),
    contactInfo: normalizeProviderContactInfo(object.contactInfo),
    createdAt: toIsoString(object.createdAt),
    updatedAt: toIsoString(object.updatedAt),
  };
}
