import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime } from "./date";
import { Timestamp } from "firebase/firestore";

describe("date utils", () => {
    describe("formatDate", () => {
        it("formats Date object correctly", () => {
            const date = new Date("2025-10-30T14:30:00");
            expect(formatDate(date)).toBe("2025년 10월 30일");
        });

        it("formats string date correctly", () => {
            expect(formatDate("2025-10-30")).toBe("2025년 10월 30일");
        });

        it("formats FTimestamp (seconds/nanoseconds) correctly", () => {
            const timestamp = { seconds: 1761802200, nanoseconds: 0 }; // 2025-10-30 14:30:00 UTC+9 (approx)
            // Note: 1761802200 is 2025-10-30 05:30:00 UTC, which is 14:30 KST
            // But new Date(seconds * 1000) uses local time or UTC depending on implementation.
            // Let's just check if it returns a string with year/month/day.
            const result = formatDate(timestamp);
            expect(result).toMatch(/2025년 10월 30일/);
        });
    });

    describe("formatDateTime", () => {
        it("formats Date object with time", () => {
            const date = new Date("2025-10-30T14:30:00");
            expect(formatDateTime(date)).toBe("2025년 10월 30일 14:30");
        });
    });
});
