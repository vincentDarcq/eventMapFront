import { LeftTime } from './left-time'

export class Event {
  _id: string
  name: string
  dateDebut: Date
  dateDebutString: string
  beginTime: string
  endTime: string
  dateFin: Date
  dateFinString: string
  space_and_time: string
  pricing_info: string
  type: string
  description: string
  lieu: string
  latitude: number
  longitude: number
  createur: string
  emailCreateur: string
  timeLeft: LeftTime
  scope: string
  invites: Array<string>
  image1: string
  image2: string
  image3: string
  imageUrl: string
  formData: FormData
  createByOwner: Boolean

  constructor(
    id?: string,
    name?: string,
    dateDebut?: Date,
    beginTime?: string,
    dateFin?: Date,
    endTime?: string,
    type?: string,
    description?: string,
    lieu?: string,
    latitude?: number,
    longitude?: number,
    createur?: string,
    emailCreateur?: string,
    timeLeft?: LeftTime,
    createByOwner?: Boolean
  ) {
    this._id = id;
    this.name = name;
    this.dateDebut = dateDebut;
    this.beginTime = beginTime;
    this.dateFin = dateFin;
    this.endTime = endTime;
    this.type = type;
    this.description = description;
    this.lieu = lieu;
    this.latitude = latitude;
    this.longitude = longitude;
    this.createur = createur;
    this.emailCreateur = emailCreateur;
    this.timeLeft = timeLeft;
    this.createByOwner = createByOwner
  }

  public setName(name: string) {
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  public setDateDebut(dateDebut: Date) {
    this.dateDebut = new Date(dateDebut);
  }

  public getDateDebut() {
    return this.dateDebut;
  }

  public setDateDebutString(dateDebutString: string) {
    this.dateDebutString = dateDebutString;
  }

  public getDateDebutString() {
    return this.dateDebutString;
  }

  public setDateFin(dateFin: Date) {
    if (dateFin !== null) {
      this.dateFin = new Date(dateFin);
    } else {
      this.dateFin = null;
    }
  }

  public getDateFin() {
    return this.dateFin;
  }

  public setDateFinString(dateFinString: string) {
    this.dateFinString = dateFinString;
  }

  public getDateFinString() {
    return this.dateFinString;
  }

  public setType(type: string) {
    this.type = type;
  }

  public getType() {
    return this.type;
  }

  public setDescription(description: string) {
    this.description = description;
  }

  public getDescription() {
    return this.description;
  }

  public setLieu(lieu: string) {
    this.lieu = lieu;
  }

  public getLieu() {
    return this.lieu;
  }

  public setLatitude(latitude: number) {
    this.latitude = latitude;
  }

  public getLatitude() {
    return this.latitude;
  }

  public setLongitude(longitude: number) {
    this.longitude = longitude;
  }

  public getLongitude() {
    return this.longitude;
  }

  public setCreateur(createur: string) {
    this.createur = createur;
  }

  public getCreateur() {
    return this.createur;
  }

  public setCreateByOwner(create: boolean) {
    this.createByOwner = create;
  }

  public getCreateByOwner() {
    return this.createByOwner;
  }

  public setEmailCreateur(email: string) {
    this.emailCreateur = email;
  }

  public getEmailCreateur() {
    return this.emailCreateur;
  }

  public setScope(scope: string) {
    this.scope = scope;
  }

  public getScope() {
    return this.scope;
  }

  public setImageUrl(imageUrl: string) {
    this.imageUrl = imageUrl;
  }

  public getImageUrl() {
    return this.imageUrl;
  }

  public setSpaceAndTime(space_and_time: string) {
    this.space_and_time = space_and_time;
  }

  public getSpaceAndTime() {
    return this.space_and_time;
  }

  public setInvites(invites: Array<string>) {
    this.invites = invites;
  }

  public getInvites() {
    return this.invites;
  }

  public setPricingInfo(pricingInfo: string) {
    this.pricing_info = pricingInfo;
  }

  public getPricingInfo() {
    return this.pricing_info;
  }

  public setTimeLeft(timeLeft: LeftTime) {
    this.timeLeft = timeLeft;
  }

  public getTimeLeft() {
    return this.timeLeft;
  }

}
