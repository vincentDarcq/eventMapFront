export class MessageChat {
  _id: string
  message: string
  user: string
  friend: string
  createdAt: string
  roomName: string

  constructor(_id?: string, message?: string, user?: string, friend?: string, createdAt?: string) {
    this._id = _id;
    this.message = message;
    this.user = user;
    this.friend = friend;
    this.createdAt = createdAt;
  }
}