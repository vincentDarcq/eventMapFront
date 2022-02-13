import { Injectable } from '@angular/core';
import * as openpgp from 'openpgp';

@Injectable({
  providedIn: 'root'
})
export class OpenpgpService {

  private passPhrase: string = "bhibaibbhlnkkjugyvgpmaqmpa;wjouzeibvikap^kojiuezgheaj:a"

  constructor() { }

  public generateKeys(name: string, email: string) {
    return openpgp.generateKey({
      userIDs: [{ name: name, email: email }],
      curve: "ed25519",
      passphrase: this.passPhrase,
    }).then(function (keyPair) {
      return keyPair;
    });
  }

  public async encryptMessage(message: string, publicKey: string): Promise<string> {
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }),
      encryptionKeys: await openpgp.readKey({ armoredKey: publicKey }),
    });
    return encrypted;
  }

  public async decryptMessage(priK: string, messageEncrypted: string) {

    const privateKey = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: priK }),
      passphrase: this.passPhrase
    });
    const message = await openpgp.readMessage({
      armoredMessage: messageEncrypted
    })

    const decrypt = await openpgp.decrypt({
      message: message,
      decryptionKeys: privateKey
    });

    return decrypt.data;
  }
}
