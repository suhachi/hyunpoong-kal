import { Timestamp } from "firebase/firestore";

export type FirestoreTimestamp = Timestamp | { seconds: number; nanoseconds: number };
