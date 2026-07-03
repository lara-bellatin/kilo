import { cookies } from "next/headers";
import {
  FALLBACK_TIMEZONE,
  TZ_COOKIE,
  isValidTimeZone,
  toIsoDate,
} from "./date";

export async function getUserTimeZone(): Promise<string> {
  const jar = await cookies();
  const tz = jar.get(TZ_COOKIE)?.value;
  return tz && isValidTimeZone(tz) ? tz : FALLBACK_TIMEZONE;
}

export async function getTodayIsoDate(): Promise<string> {
  return toIsoDate(new Date(), await getUserTimeZone());
}
