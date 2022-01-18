import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubscriberCertificateService } from '../subscriber-certificate.service';
import * as x509 from "@peculiar/x509";
import * as forge from 'node-forge';

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
  public subscriberCertificateId :any
  public test = "-----BEGIN CERTIFICATE-----MIID9zCCAt+gAwIBAgIURrpZVj/FK9ScLBAqPlpLT9a2nK4wDQYJKoZIhvcNAQELBQAwaDERMA8GA1UEAwwIU2VydmVyQ0ExDDAKBgNVBAsMA0NNQzEUMBIGA1UECgwLQ01DIGNvbXBhbnkxDzANBgNVBAcMBmhhIG5vaTERMA8GA1UECAwIY2F1IGdpYXkxCzAJBgNVBAYTAlZOMB4XDTIxMTIwNzA3NTU0NloXDTIzMTIwNzA3NTU0NlowgYExIDAeBgNVBAMMF25nbWR1YzUgbmdtZHVjNSBuZ21kdWM1MQswCQYDVQQLDAJoaDEMMAoGA1UECgwDQ01DMSEwHwYDVQQHDBhCYSDEkMOsbmggUGjDumMgWMOhIHNkc2QxEjAQBgNVBAgMCUjDoCBO4buZaTELMAkGA1UEBhMCVk4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQClB4Y1jaJ0X9pR8BS73mIB6R8l9KDb6k+R/XmEw5Itw0JC7yZfN2ug8xXXVbz/N118xeqAUebko+ZpYHHQWP1rP50soY6OxM3eado6uQLeTuBn73IQeY/rpeIQ8wLZV3193a7R9JrnUVdmzcuOvJmBxyAS6D1/GM+1geRRk1Qi3q7emLqkjIDKYyToag5IU3IV00JrNvJX2WjY4BZpzLjGThKi4apOI+rRuTeDqgFil046CnSZ+vhivbafTjmfRB75pCKxfMWN/3Gu48LHWdYV+r0hgIFigHGREbm4Biwyq708FXPEtNGmHAolXqaI2kXkH3CvTjBbPHwimmDhYocHAgMBAAGjfzB9MAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAU2DgDsoU5a69i1NYxs52f0XtO3kYwHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUFBwMEMB0GA1UdDgQWBBRvrzN+LZoKNrcEYF5I7isG4su18jAOBgNVHQ8BAf8EBAMCBeAwDQYJKoZIhvcNAQELBQADggEBAFkKXkD2pXw96rlxBGOit6jmqNGkeiPjAymDo0F+H35XCOa4ODz19eYyRjPS4ptTtOnTBHEI6dNvOFwgVsRg1EzS0G0X3FDbg0cxKrAsHstcgdkMK7IxXOzvoBA5n+PhaJfPBxZvdSle+MATGxhWKUJ9v16yyhNgp0HT80qW/Raea9aTYcvuEqhhQDHdhl3JNfGcWOp5MqyDQq6hksTciGnnGIOse6XI0aZt4RcIJ3l26L93W+yxKSMM5bXfyn4vqQXmBTMQLGDT5zRvoocWyL17ErgiUuuUOQLv/+yEz6lrSZzHHnk92VfYHiRPFXnwAPbh3YEKzluDi5dRENBPd4o=-----END CERTIFICATE-----"
  // biến thông tin chứng thư số 
  public version :any
  public serialNumber:any
  public sigAlgName:any
  public issuerDN:any
  public subject:any
  public algorithmPublicKey:any
  public sizePublicKey:any

  public createdAt:any
  public updatedAt:any
  // private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _subscriberCertificateService:SubscriberCertificateService,
    

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
    .subscribe((res:any) => {
      console.log(res)
      this.updatedAt = res.data.updatedAt
      this.createdAt = res.data.createdAt
      // this.data = res.data
      this.subscriberCertificateId = res.data.subscriberCertificateId
      let cer = res.data.certificateContent
      console.log(cer)
      let read = '-----BEGIN CERTIFICATE-----\r\n' +
            cer +
            '\r\n-----END CERTIFICATE-----\r\n'
      this.readCertificate(read);
      // console.log(res)
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
    this.version = this.dataFromNodeForge.version
    
    
    // this.issuerDN = this.dataFromNodeForge.subject
    this.dataFromX509 = new x509.X509Certificate(certPem);
    //  lấy dữ liệu từ chứng thư số
    this.sigAlgName = this.dataFromX509.signatureAlgorithm.name
    console.log(this.dataFromX509)
    this.serialNumber = this.dataFromX509.serialNumber
    this.issuerDN = this.dataFromX509.issuer
    this.subject = this.dataFromX509.subject
    this.algorithmPublicKey = this.dataFromX509.publicKey.algorithm.name
    this.sizePublicKey = this.dataFromX509.publicKey.algorithm.modulusLength

    //Đọc signatureParameters
    this.signatureParameters = this.dataFromNodeForge.signatureParameters
    if(Object.keys(this.signatureParameters).length == 0) //(*)
    {
      this.signatureParameters = "05 00"
    }
    else {
      this.signatureParameters = JSON.stringify(this.signatureParameters) //(**)
    }
    if(this.dataFromNodeForge.extensions.length > 0){
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
    }

    


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
    if(this.dataFromNodeForge.extensions.length > 0){
      if(this.dataFromNodeForge.extensions[2].clientAuth) this.extKeyUsage += "Client Authentication (1.3.6.1.5.5.7.3.2) "
      // if(this.dataFromNodeForge.extensions[2].critical) this.extKeyUsage += "Critical "
      if(this.dataFromNodeForge.extensions[2].emailProtection) this.extKeyUsage += "Secure Email (1.3.6.1.5.5.7.3.4) "
      //Tham khả IDO tại: https://oidref.com/1.3.6.1.5.5.7.3.2
    }
   


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
  createCertificateFile(certificateBase64) {
    return "-----BEGIN CERTIFICATE-----\r\n" +
        atob(certificateBase64) +
        "\r\n-----END CERTIFICATE-----\r\n"
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
