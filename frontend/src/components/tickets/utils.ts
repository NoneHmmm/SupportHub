/**
 * Shared utility functions for ticket components.
 */

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins}m trước`;
  if (diffHours < 24) return `${diffHours}h trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getUserAvatar(
  user?:
    | string
    | { _id: string; fullName: string; email: string; avatar?: string },
): { initials: string; avatar?: string; name: string } {
  if (!user || typeof user === "string")
    return {
      initials: "?",
      name: typeof user === "string" ? user : "Người dùng",
    };
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return { initials, avatar: user.avatar, name: user.fullName };
}

export function getUserDisplayName(
  user?:
    | string
    | { _id: string; fullName: string; email: string; avatar?: string },
): string {
  if (!user) return "—";
  if (typeof user === "string") return user;
  return user.fullName;
}
