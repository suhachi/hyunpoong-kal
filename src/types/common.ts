import { Timestamp, FieldValue } from "firebase/firestore";

export type FirestoreTimestamp = Timestamp | FieldValue | { seconds: number; nanoseconds: number };
