import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  SelectionType,
  DatatableComponent,
  ColumnMode,
} from "@swimlane/ngx-datatable";
import { PersonalListService } from "app/main/apps/identity-provider/subscribers/personals/personal-list/personal-list.service";
import { Keypair } from "app/main/models/Keypair";
import { PagedData } from "app/main/models/PagedData";
import { Personal } from "app/main/models/Personal";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { KeypairService } from "../../keypair/keypair.service";
import { SubscriberCertificateListService } from "../subscriber-certificate-list/subscriber-certificate-list.service";

@Component({
  selector: "app-subscriber-certificate-create",
  templateUrl: "./subscriber-certificate-create.component.html",
  styleUrls: ["./subscriber-certificate-create.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [KeypairService, PersonalListService],
})
export class SubscriberCertificateCreateComponent implements OnInit {
  public contentHeader: object;
  minDate: Date;
  maxDate: Date;
  //Table of personal data
  public pagedData = new PagedData<Personal>();
  public pagedKeypairData = new PagedData<Keypair>();
  public rowsKeypairData = new Array<Keypair>();
  public rowsData = new Array<Personal>();
  public selected = [];
  public SelectionType = SelectionType;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  public isLoading: boolean = false;
  public isKeypairListLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public moreOption = true;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  gender: string[] = ["Nam", "Nữ"];
  public keypairSelected: Keypair;
  public modalRef;
  // Private
  private _unsubscribeAll: Subject<any>;
  public formListPersonal: FormGroup;
  public formUploadCert: FormGroup;
  /**
   *
   * @param _userListService
   * @param _coreSidebarService
   * @param _coreConfigService
   * @param modalService
   * @param fb
   * @param dateAdapter
   */
  constructor(
    private _userListService: PersonalListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private _subscriberCertificateService: SubscriberCertificateListService,
    private modalService: NgbModal,
    private _keypairService: KeypairService,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private toastr: ToastrService
  ) {
    this._unsubscribeAll = new Subject();
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 4, 0, 1);
    this.maxDate = new Date(currentYear + 2, 11, 31);
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.dateAdapter.setLocale(config.app.appLanguage);
      });
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.formListPersonal = this.fb.group({
      inputPersonal: [null, Validators.required],
      fromDate: [null],
      toDate: [null],
      sizePage: [this.sizePage[3]],
      gender: [],
      birthday: [],
    });
    this.formUploadCert = this.fb.group({
      fileSource: [null, Validators.required],
      certificate: ["", Validators.required],
      keypairId: [null, Validators.required],
      certificateRequestId: [null, Validators.required],
      caId: [null],
    });
    this.pagedData.size = this.sizePage[3];
    this.pagedData.currentPage = 0;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
    this.contentHeader = {
      headerTitle: 'Nhập chứng thư số',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Quản lý cặp khóa',
            isLink: false
          },
          {
            name: 'Nhập chứng thư số',
            isLink: true,
            link: '/apps/equipment-management/subscriber-certificate-create'
          }
        ]
      }
    };
  }
  changePage() {
    this.pagedData.size = this.formListPersonal.get("sizePage").value;
    this.setPage({ offset: 0, pageSize: this.pagedData.size });
  }

  //Set Table View
  setPage(pageInfo) {
    console.log("lololo");
    console.log(pageInfo);
    this.isLoading = true;
    this.pagedData.currentPage = pageInfo.offset;
    this.pagedData.size = pageInfo.pageSize;
    this._userListService
      .getListPersonals(this.pagedData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((personalList) => ({
          ...personalList,
          personalFirstName:
            personalList.personalFirstName +
            " " +
            personalList.personalMiddleName +
            " " +
            personalList.personalLastName,
        }));
        this.isLoading = false;
      });
  }

  /**
   * For ref only, log selected values
   *
   * @param selected
   */
  onSelect({ selected }, modal) {
    this.openKeypairList(modal);
    console.log(selected);
    this.pagedKeypairData.size = this.sizePage[0];
    this.pagedKeypairData.currentPage = 0;
    console.log(selected[0].subscriberId);

    this.setKeypairListPage(selected[0].subscriberId, {
      offset: 0,
      pageSize: 5,
    });
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  setKeypairListPage(subscriberId: string, pageInfo) {
    console.log(pageInfo);
    this.isKeypairListLoading = true;
    this.pagedKeypairData.currentPage = pageInfo.offset;
    this.pagedKeypairData.size = pageInfo.pageSize;
    this._keypairService
      .getKeypairList(subscriberId, this.pagedKeypairData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log("pagedData", pagedData);
        this.pagedKeypairData = pagedData.data;
        this.rowsKeypairData = pagedData.data.data;
        this.isKeypairListLoading = false;
      });
  }

  openUploadCert(modal, row) {
    this.formUploadCert.reset();
    this.keypairSelected = row;
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      size: "lg",
    });
  }
  openKeypairList(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: "xl",
    });
  }

  closeModal(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onSubmit() {
    console.log(this.formListPersonal);
  }
  onFileChange(event) {
    console.log(event);
    if (event.target.files.length > 0) {
      console.log(event.target.files);
      const file = event.target.files[0];
      this.formUploadCert.patchValue({
        fileSource: file,
      });
      console.log(this.formUploadCert.get("fileSource"));
    }
  }
  onSubmitCert(): boolean {
    this.formUploadCert
      .get("keypairId")
      .patchValue(this.keypairSelected.keypairId);
    this.formUploadCert
      .get("certificateRequestId")
      .patchValue(
        this.keypairSelected.certificateRequests[0].certificateRequestId
      );
    this.formUploadCert.get("caId").patchValue("cacertificate_00001");
    if (this.formUploadCert.invalid) {
      return;
    }
    this._subscriberCertificateService
      .updateCert(this.formUploadCert)
      .subscribe(
        (res) => {
          console.log(res.result);
          if (res.result === true) {
            this.toastr.success(
              "👋 Bạn đã cập nhật chứng thư số",
              "Thành công",
              {
                positionClass: "toast-top-center",
                toastClass: "toast ngx-toastr",
                closeButton: true,
              }
            );
            this.modalRef.close();
            this.keypairSelected.keypairStatus.keypairStatus =
              "Đã được lưu trữ chứng thực";
          } else {
            this.toastr.error("👋Chứng thư số cập nhật", "Thất bại", {
              positionClass: "toast-top-center",
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          }
        },
        (error) => {
          alert("Chứng thư số không đúng. Vui lòng thử lại");
          return false;
        }
      );
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
