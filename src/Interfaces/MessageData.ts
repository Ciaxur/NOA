/** Status Type */
export type Status = "Online" | "Offline" | "Busy" | "Away";

/** Message Data Structure */
export interface MessageData {
    UID:        string;             // Unique ID Per Client
    message:    string;             // Message Data
    username:   string;             // Username of Client
    status:     string;             // User's Status
}