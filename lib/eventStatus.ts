export type EventStatus = "upcoming" | "ongoing" | "ended";

export function getEventStatus(startsAt: string, endsAt: string | null): EventStatus {
  const now = new Date();
  const start = new Date(startsAt);
  const end = endsAt ? new Date(endsAt) : null;

  if (now < start) return "upcoming";
  if (end && now > end) return "ended";
  if (!end && now > start) {
    // No end time given — treat it as ended once the day has passed.
    const startOfNextDay = new Date(start);
    startOfNextDay.setHours(24, 0, 0, 0);
    return now > startOfNextDay ? "ended" : "ongoing";
  }
  return "ongoing";
}

export const eventStatusStyles: Record<EventStatus, string> = {
  upcoming: "bg-blue-100 text-blue-700",
  ongoing: "bg-green-100 text-green-700",
  ended: "bg-gray-100 text-gray-500",
};

export const eventStatusLabels: Record<EventStatus, string> = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  ended: "Ended",
};