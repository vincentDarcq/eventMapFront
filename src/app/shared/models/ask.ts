export class Ask{
  id: string
  demandeur: string;
  destinataire: string;

  constructor(id?: string, demandeur?: string, destinataire?: string){
    this.id = id;
    this.demandeur = demandeur;
    this.destinataire = destinataire;
  }
}