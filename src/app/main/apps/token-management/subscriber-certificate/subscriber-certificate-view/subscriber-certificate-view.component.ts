import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubscriberCertificateService } from '../subscriber-certificate.service';
import * as x509 from "@peculiar/x509";

@Component({
  selector: 'app-subscriber-certificate-view',
  templateUrl: './subscriber-certificate-view.component.html',
  styleUrls: ['./subscriber-certificate-view.component.scss']
})
export class SubscriberCertificateViewComponent implements OnInit {
  // public
  public url = this.router.url;
  public dataFromNodeForge : any
  public dataFromX509 : any
  public isReadCert = false
  public modulus : any = ""
  public signatureParameters : any
  public keyUsage : any = ""
  public basicConstraints : any = ""
  public thumbprint : any = ""
  public extKeyUsage : any = ""
  public data:any
  // private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _subscriberCertificateService:SubscriberCertificateService
  ) { 
    
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.getSubscriberCertificateView();
  }
  getSubscriberCertificateView(){
    const routerParams = this.route.snapshot.paramMap
    const id = routerParams.get('id')
    console.log(id)
    this._subscriberCertificateService.getSubscriberCertificateById(id)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res) => {
      this.data = res.data
      console.log(res)
    })
  }
  // readCertificate(cer): any[] {
  //   //decode
  //   let read: any = forge.pki.certificateFromPem(
  //     '-----BEGIN CERTIFICATE-----\r\n' +
  //       cer +
  //       '\r\n-----END CERTIFICATE-----\r\n'
  //   );

  //   //get attributes
  //   read = read.subject.attributes;

  //   //dich tieng Viet
  //   let res: any[] = JSON.parse(forge.util.decodeUtf8(JSON.stringify(read)));
  //   console.log(res)
  //   return res;
  // }

  readCertificate(certPem) {
    console.log(certPem)
    this.isReadCert = false

    //Đọc chứng thư số ra dạng JSON theo 2 cách dùng Node-Force & X509
    var forge = require('node-forge');
    this.dataFromNodeForge = forge.pki.certificateFromPem(certPem);
    console.log(this.dataFromNodeForge)
    this.dataFromX509 = new x509.X509Certificate(certPem);
    console.log(this.dataFromX509)

    //Đọc signatureParameters
    this.signatureParameters = this.dataFromNodeForge.signatureParameters
    if(Object.keys(this.signatureParameters).length == 0) //(*)
    {
      this.signatureParameters = "05 00"
    }
    else {
      this.signatureParameters = JSON.stringify(this.signatureParameters) //(**)
    }

    //Đọc keyUsage
    if(this.dataFromNodeForge.extensions[4].cRLSign) this.keyUsage += "CRL Signing, "
    // if(this.dataFromNodeForge.extensions[4].critical) this.keyUsage += "Critical, "
    if(this.dataFromNodeForge.extensions[4].dataEncipherment) this.keyUsage += "Data Encipherment, "
    if(this.dataFromNodeForge.extensions[4].decipherOnly) this.keyUsage += "Decipher Only, "
    if(this.dataFromNodeForge.extensions[4].digitalSignature) this.keyUsage += "Digital Signature, "
    if(this.dataFromNodeForge.extensions[4].encipherOnly) this.keyUsage += "Encipher Only, "
    if(this.dataFromNodeForge.extensions[4].keyAgreement) this.keyUsage += "Key Agreement, "
    if(this.dataFromNodeForge.extensions[4].keyCertSign) this.keyUsage += "Key CertSign, "
    if(this.dataFromNodeForge.extensions[4].keyEncipherment) this.keyUsage += "Key Encipherment, "
    if(this.dataFromNodeForge.extensions[4].nonRepudiation) this.keyUsage += "Non Repudiation, "

    //Đọc basicConstraints
    //Nếu ca = false thì Subject Type là End Entity nếu không là CA
    if(this.dataFromX509.extensions[0].ca) this.basicConstraints += "Subject Type=CA, "
    else this.basicConstraints += "Subject Type=End Entity, "
    if(this.dataFromX509.extensions[0].pathLength==undefined) this.basicConstraints += "Path Length Constraint=None"
    else this.basicConstraints += "Path Length Constraint="+this.dataFromX509.extensions[0].pathLength


    //Đọc @thumbprint
    var certAsn1 = forge.pki.certificateToAsn1(this.dataFromNodeForge);
    var certDer = forge.asn1.toDer(certAsn1).getBytes();
    //SHA-1 on certificate binary data
    var md =  forge.md.sha1.create();
    md.start();
    md.update(certDer);
    var digest = md.digest();
    this.thumbprint = digest.toHex();

    //Đọc extKeyUsage
    //Tham khả IDO tại: https://oidref.com/1.3.6.1.5.5.7.3.2
    if(this.dataFromNodeForge.extensions[2].clientAuth) this.extKeyUsage += "Client Authentication (1.3.6.1.5.5.7.3.2) "
    // if(this.dataFromNodeForge.extensions[2].critical) this.extKeyUsage += "Critical "
    if(this.dataFromNodeForge.extensions[2].emailProtection) this.extKeyUsage += "Secure Email (1.3.6.1.5.5.7.3.4) "


    //Đọc modulus
    for (let i = 0; i < this.dataFromNodeForge.publicKey.n.toByteArray().length; i++) {
      var hex = (this.dataFromNodeForge.publicKey.n.toByteArray()[i] >>> 0).toString(16).slice(-2)
      if (hex.length < 2) {
        hex = "0" + hex
      }
      if (this.modulus == "") {
        this.modulus = hex
        // modulus = rgbToHex(csr.publicKey.n.toByteArray()[i])
      } else {
        this.modulus = this.modulus + ":" + hex
        // modulus = modulus + ":" + rgbToHex(csr.publicKey.n.toByteArray()[i])
      }
    }

    //Trạng thái đã đọc xong chứng thư số
    this.isReadCert = true
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
