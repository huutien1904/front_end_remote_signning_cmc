import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubscriberCertificateService } from '../subscriber-certificate.service';
import * as x509 from "@peculiar/x509";
import * as forge from 'node-forge';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscriber-certificate-view',
  templateUrl: './subscriber-certificate-view.component.html',
  styleUrls: ['./subscriber-certificate-view.component.scss']
})
export class SubscriberCertificateViewComponent implements OnInit {
  [x: string]: any;
  // public
  public url = this.router.url;
  public buttonReturn: object;
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
  public exponent
  public dataSubscriberCertificate:string
  // biến thông tin chứng thư số 
  public version :any
  public serialNumber:any
  public sigAlgName:any
  public issuerDN:any
  public subject:any
  public algorithmPublicKey:any
  public sizePublicKey:any
  public personalEmail:any
  public personalFullName:any
  public createdAt:string
  public updatedAt:string
  public userName:string
  // private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _subscriberCertificateService:SubscriberCertificateService,
    private sanitizer: DomSanitizer,

  ) { 
    
    this._unsubscribeAll = new Subject();
    
  }

  ngOnInit() {
    this.buttonReturn = {
      breadcrumbs: {
        links: [
          {
            name:'Quay lại',
            isLink: true,
            link: "/apps/tm/subscriber-certificate/subscriber-certificate-list",
        }
        ]
      }
    };
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
      this.personalEmail = res.data.email
      this.userName = res.data.username
      this.personalFullName = res.data.fullName
      // this.data = res.data
      this.subscriberCertificateId = res.data.subscriberCertificateId
      let cer = res.data.certificateContent
      console.log(cer)

      let read = '-----BEGIN CERTIFICATE-----\r\n' +
            cer +
            '\r\n-----END CERTIFICATE-----\r\n'
      this.dataSubscriberCertificate = read
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

  // download subscriber
  downloadSubscriber(){
    console.log(this.dataSubscriberCertificate)
    const data = this.dataSubscriberCertificate
    console.log(data)
    const blob = new Blob([data], { type: 'crt' });
    this.listFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
  }  
  readCertificate(certPem) {
    console.log(certPem)
    this.isReadCert = false

    //Đọc chứng thư số ra dạng JSON theo 2 cách dùng Node-Force & X509
    var forge = require('node-forge');
    //this.dataFromNodeForge = forge.pki.certificateFromPem(certPem);
    //console.log(this.dataFromNodeForge)
    //this.version = this.dataFromNodeForge.version
    
    
    // this.issuerDN = this.dataFromNodeForge.subject
    this.dataFromX509 = new x509.X509Certificate(certPem);
    //  lấy dữ liệu từ chứng thư số

    this.sigAlgName = this.dataFromX509.signatureAlgorithm.name
    console.log(this.dataFromX509)
    console.log(this.dataFromX509.signatureAlgorithm.name)
    if(this.dataFromX509.signatureAlgorithm.name === "RSASSA-PKCS1-v1_5"){
    this.dataFromNodeForge = forge.pki.certificateFromPem(certPem);
    this.version = this.dataFromNodeForge.version
    console.log(this.dataFromNodeForge)
    this.exponent=this.dataFromNodeForge.publicKey.e.data[0]
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
      console.log(this.extKeyUsage)
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

    }
    this.serialNumber = this.dataFromX509.serialNumber
    this.issuerDN = this.dataFromX509.issuer.replaceAll('2.5.4.9',"Street").replaceAll('2.5.4.20','telephoneNumber').replaceAll('0.9.2342.19200300.100.1.1','uid')
    console.log(this.issuerDN)
    
    
    this.subject = this.dataFromX509.subject.replaceAll('2.5.4.9',"Street").replaceAll('2.5.4.20','telephoneNumber').replaceAll('0.9.2342.19200300.100.1.1','uid')
    this.algorithmPublicKey = this.dataFromX509.publicKey.algorithm.name
    this.sizePublicKey = this.dataFromX509.publicKey.algorithm.modulusLength
    this.signatureHashAlgorithm = this.dataFromX509.signatureAlgorithm.hash.name
    this.validFrom = this.dataFromX509.notBefore
    this.validTo= this.dataFromX509.notAfter
    //Đọc signatureParameters
    // this.signatureParameters = this.dataFromNodeForge.signatureParameters
    // if(Object.keys(this.signatureParameters).length == 0) //(*)
    // {
    //   this.signatureParameters = "05 00"
    // }
    // else {
    //   this.signatureParameters = JSON.stringify(this.signatureParameters) //(**)
    // }
    // if(this.dataFromNodeForge.extensions.length > 0){
    //   //Đọc keyUsage
    //   if(this.dataFromNodeForge.extensions[4].cRLSign) this.keyUsage += "CRL Signing, "
    //   // if(this.dataFromNodeForge.extensions[4].critical) this.keyUsage += "Critical, "
    //   if(this.dataFromNodeForge.extensions[4].dataEncipherment) this.keyUsage += "Data Encipherment, "
    //   if(this.dataFromNodeForge.extensions[4].decipherOnly) this.keyUsage += "Decipher Only, "
    //   if(this.dataFromNodeForge.extensions[4].digitalSignature) this.keyUsage += "Digital Signature, "
    //   if(this.dataFromNodeForge.extensions[4].encipherOnly) this.keyUsage += "Encipher Only, "
    //   if(this.dataFromNodeForge.extensions[4].keyAgreement) this.keyUsage += "Key Agreement, "
    //   if(this.dataFromNodeForge.extensions[4].keyCertSign) this.keyUsage += "Key CertSign, "
    //   if(this.dataFromNodeForge.extensions[4].keyEncipherment) this.keyUsage += "Key Encipherment, "
    //   if(this.dataFromNodeForge.extensions[4].nonRepudiation) this.keyUsage += "Non Repudiation, "
    //   //Đọc basicConstraints
    // //Nếu ca = false thì Subject Type là End Entity nếu không là CA
    // if(this.dataFromX509.extensions[0].ca) this.basicConstraints += "Subject Type=CA, "
    // else this.basicConstraints += "Subject Type=End Entity, "
    // if(this.dataFromX509.extensions[0].pathLength==undefined) this.basicConstraints += "Path Length Constraint=None"
    // else this.basicConstraints += "Path Length Constraint="+this.dataFromX509.extensions[0].pathLength
    // }

    


    //Đọc @thumbprint
    // var certAsn1 = forge.pki.certificateToAsn1(this.dataFromNodeForge);
    // var certDer = forge.asn1.toDer(certAsn1).getBytes();
    // //SHA-1 on certificate binary data
    // var md =  forge.md.sha1.create();
    // md.start();
    // md.update(certDer);
    // var digest = md.digest();
    // this.thumbprint = digest.toHex();

    //Đọc extKeyUsage
    // if(this.dataFromNodeForge.extensions.length > 0){
    //   if(this.dataFromNodeForge.extensions[2].clientAuth) this.extKeyUsage += "Client Authentication (1.3.6.1.5.5.7.3.2) "
    //   // if(this.dataFromNodeForge.extensions[2].critical) this.extKeyUsage += "Critical "
    //   if(this.dataFromNodeForge.extensions[2].emailProtection) this.extKeyUsage += "Secure Email (1.3.6.1.5.5.7.3.4) "
    //   //Tham khả IDO tại: https://oidref.com/1.3.6.1.5.5.7.3.2
    // }
   


    //Đọc modulus
    // for (let i = 0; i < this.dataFromNodeForge.publicKey.n.toByteArray().length; i++) {
    //   var hex = (this.dataFromNodeForge.publicKey.n.toByteArray()[i] >>> 0).toString(16).slice(-2)
    //   if (hex.length < 2) {
    //     hex = "0" + hex
    //   }
    //   if (this.modulus == "") {
    //     this.modulus = hex
    //     // modulus = rgbToHex(csr.publicKey.n.toByteArray()[i])
    //   } else {
    //     this.modulus = this.modulus + ":" + hex
    //     // modulus = modulus + ":" + rgbToHex(csr.publicKey.n.toByteArray()[i])
    //   }
    // }

    //Trạng thái đã đọc xong chứng thư số
    this.isReadCert = true
  }
  createCertificateFile(certificateBase64) {
    return "-----BEGIN CERTIFICATE-----\r\n" +
        atob(certificateBase64) +
        "\r\n-----END CERTIFICATE-----\r\n"
  }

  // delete subscriber certificate
  // delete item subscriber certificate 
  openConfirmDelete() {
    const routerParams = this.route.snapshot.paramMap
    const id = routerParams.get('id')
    this.confirmRemoveRequestCertificate(id);
  }
  confirmRemoveRequestCertificate(subscriberCertificateId) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: "Bạn sẽ không thể hoàn tác điều này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        this.deleteSubscriberCertificate(subscriberCertificateId)
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: "Thoát",
      confirmButtonText: 'Đúng, tôi muốn xóa!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      }
    }).then(function (result: any) {
      console.log(result)
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn đã xóa thành công',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    }

    );

  }
  deleteSubscriberCertificate(id) {
    this._subscriberCertificateService
      .deleteSubscriberCertificateById(id)
      .toPromise()
      .then((res) => {
        if (res.result === true) {
          this.router.navigate(['/apps/tm/subscriber-certificate/subscriber-certificate-list']);
        }
      })
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
