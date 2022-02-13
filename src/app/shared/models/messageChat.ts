export class MessageChat {
  message: string
  user: string
  friend: string
  createdAt: string
  pri: string

  constructor(message?: string, user?: string, friend?: string, createdAt?: string, pri?: string) {
    this.message = message;
    this.user = user;
    this.friend = friend;
    this.createdAt = createdAt;
    this.pri = pri;
  }
}