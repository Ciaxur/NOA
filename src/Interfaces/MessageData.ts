/** Status Type */
export type Status = "Online" | "Offline" | "Busy" | "Away";

/** Message Data Structure */
export interface MessageData {
    UID:        string;             // Unique ID Per Client
    message:    string;             // Message Data
    username:   string;             // Username of Client
    status:     string;             // User's Status
}


/** Code Type */
type IPC_Code =
    "initialize" |                  // Client When Initialized
    "chat-message-tigger" |         // Chat-Message Triggered
    "chat-user-change" |            // Client Username Changed
    "chat-status-change" |          // Client Status Changed
    "browserwindow-change";         // Browser Window Event "Change"

/** IPC Communication Structure */
export interface MsgStructIPC {
    from:       string;             // From which IPC Recieved
    code:       IPC_Code;           // Code for IPC to Check
    message: string | {             // String or Object
        minimized: boolean;         // Window's Minimized State
        focused: boolean;           // Window's Focus State
        status: Status;
        message?: string;           // Extra Message Text
    };             // Message Contained
}