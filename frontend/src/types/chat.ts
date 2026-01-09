export interface Message {
    id: string
    text: string
    sender: "me" | "other"
    timestamp: Date
}
