import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-keypair-list",
  templateUrl: "./keypair-list.component.html",
  styleUrls: ["./keypair-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class KeypairListComponent implements OnInit {
  //Public Properties
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public today = this.calendar.getToday();
  public cryptoSystem = [
    {
      id: 1,
      name: "RSA",
      param: [1024, 1536, 2048, 3072, 4096, 6144, 8192],
    },
    {
      id: 2,
      name: "ECDSA",
      param: [
        "brainpoolP160r1",
        "brainpoolP160t1",
        "brainpoolP192r1",
        "brainpoolP192t1",
        "brainpoolP224r1",
        "brainpoolP224t1",
        "brainpoolP256r1",
        "brainpoolP256t1",
        "brainpoolP384t1",
        "brainpoolP384r1",
        "brainpoolP521t1",
        "brainpoolP521r1",
      ],
    },
  ];

  formListKeyPair: FormGroup;
  public sizePage=[5,10,15,20];
  public moreOption = true;
  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), "d", 10);
  }
  ngOnInit(): void {
    this.formListKeyPair = this.fb.group({
      aliasKeypair: ["", Validators.required],
      cryptoSystemName: [this.cryptoSystem[0], Validators.required],
      cryptoSystemParam: [this.cryptoSystem[0].param[0], Validators.required],
      sizePage: [this.sizePage[1]],
      fromDate: [null],
      toDate: [null],
    });
  }

  public changeCryptoSystemName(event: Event): void {
    console.log(this.formListKeyPair.get('cryptoSystemParam').setValue(this.formListKeyPair.get('cryptoSystemName').value.param[0]));
    console.log(this.formListKeyPair.value);
  }

  onSubmit() {
    console.log(this.fb.control);
    alert(this.formListKeyPair.get("fromDate"));
    console.log(this.formListKeyPair.get("fromDate").value);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

}
