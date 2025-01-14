import big from "big.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

import type { Option } from "lib/types";

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const getDefaultDate = (): Date => dayjs.utc(0).toDate();

export const getCurrentDate = (): Date => dayjs.utc().toDate();

export const parseDate = (date: string): Date => dayjs.utc(date).toDate();

export const parseDateOpt = (dateOpt: Option<string>): Option<Date> =>
  dateOpt ? parseDate(dateOpt) : undefined;

// TODO: remove default fn
export const parseDateDefault = (dateOpt: Option<string>): Date =>
  dateOpt ? parseDate(dateOpt) : getDefaultDate();

export const formatUTC = (date: Date) =>
  dayjs.utc(date).format("MMM DD, YYYY, h:mm:ss A [(UTC)]");

export const dateFromNow = (date: Date) => dayjs.utc(date).fromNow();

export const formatSeconds = (sec: Option<string>) => {
  if (!sec) return "N/A";
  const formatSec = big(sec.replace("s", ""));

  switch (true) {
    case formatSec.gte(86400): {
      const days = formatSec.div(86400).round(0, 0).toNumber();
      return `${days} day`.concat(days > 1 ? "s" : "");
    }
    case formatSec.gte(3600): {
      const hours = formatSec.div(3600).round(0, 0).toNumber();
      return `${hours} hour`.concat(hours > 1 ? "s" : "");
    }
    case formatSec.gte(60): {
      const mins = formatSec.div(60).round(0, 0).toNumber();
      return `${mins} minute`.concat(mins > 1 ? "s" : "");
    }
    default:
      return `${formatSec.toFixed()} seconds`;
  }
};
