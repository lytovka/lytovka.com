import {
  ONE_DAY,
  ONE_HOUR,
  ONE_MINUTE,
  ONE_MONTH,
  ONE_SECOND,
  ONE_YEAR,
} from "~/constants";
import { formatPlural } from "~/utils/misc";

export const dateFormatter = (locale = "en-US") =>
  new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export function ago(date: Date): string {
  const now = new Date();
  const utcTimestamp = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds(),
  );
  const diff = utcTimestamp - +date;

  const seconds = Math.floor(diff / ONE_SECOND);
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(diff / ONE_MINUTE);
  if (minutes < 60) {
    return `${formatPlural(minutes, "minute", "minutes")} ago`;
  }

  const hours = Math.floor(diff / ONE_HOUR);
  if (hours < 24) {
    return `${formatPlural(hours, "hour", "hours")} ago`;
  }

  const days = Math.floor(diff / ONE_DAY);
  if (days < 30) {
    return `${formatPlural(days, "day", "days")} ago`;
  }

  const months = Math.floor(diff / ONE_MONTH);
  if (months < 12) {
    return `${formatPlural(months, "month", "months")} ago`;
  }

  const years = Math.floor(diff / ONE_YEAR);

  return `${formatPlural(years, "year", "years")} ago`;
}
