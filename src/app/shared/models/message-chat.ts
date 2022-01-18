export class MessageChat {
  _id: string
  message: string
  type: string
  userId: string
  userName: string
  eventId: string
  createdAt: string

  constructor(_id?: string, message?: string, type?: string, userId?: string, userName?: string, eventId?: string, createdAt?: string) {
    this._id = _id;
    this.message = message;
    this.type = type;
    this.userId = userId;
    this.userName = userName;
    this.eventId = eventId;
    this.createdAt = createdAt;
  }

  setMessage(message?: string, userId?: string, userName?: string, eventId?: string) {
    this.message = message;
    this.userId = userId;
    this.userName = userName;
    this.eventId = eventId;
  }
}