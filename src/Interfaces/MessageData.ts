/** Status Type */
export type Status = "Online" | "Offline" | "Busy" | "Away";

/** Message Data Structure */
export interface MessageData {
    UID:        String;             // Unique ID Per Client
    message:    String;             // Message Data
    username:   String;             // Username of Client
    status:     Status;             // User's Status
}