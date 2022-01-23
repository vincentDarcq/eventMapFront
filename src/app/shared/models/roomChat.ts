export class RoomChat {
  _id: string
  roomName: string;

  constructor(id?: string, roomName?: string, destinataire?: string) {
    this._id = id;
    this.roomName = roomName;
  }
}