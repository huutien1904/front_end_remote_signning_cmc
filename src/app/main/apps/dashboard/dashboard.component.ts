import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { colors } from 'app/colors.const';
import { Keypair } from 'app/main/models/Keypair';
import { Organization } from 'app/main/models/Organization';
import { PagedData } from 'app/main/models/PagedData';
import { Personal } from 'app/main/models/Personal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrganizationListService } from '../identity-provider/subscribers/organizations/organization-list/organization-list.service';
import { PersonalService } from '../identity-provider/subscribers/personals/personal.service';
import { KeypairListService } from '../token-management/keypair/keypair-list/keypair-list.service';
import { SubscriberCertificateListService } from '../token-management/subscriber-certificate/subscriber-certificate-list/subscriber-certificate-list.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexDataLabels,
  ApexXAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexPlotOptions,
  ApexYAxis,
  ApexFill,
  ApexMarkers,
  ApexTheme,
  ApexNonAxisChartSeries,
  ApexLegend,
  ApexResponsive,
  ApexStates
} from 'ng-apexcharts';
import { CoreConfigService } from '@core/services/config.service';

export interface ChartOptions {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  grid?: ApexGrid;
  stroke?: ApexStroke;
  legend?: ApexLegend;
  title?: ApexTitleSubtitle;
  colors?: string[];
  tooltip?: ApexTooltip;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  fill?: ApexFill;
  labels?: string[];
  markers: ApexMarkers;
  theme: ApexTheme;
}

export interface ChartOptions2 {
  // Apex-non-axis-chart-series
  series?: ApexNonAxisChartSeries;
  chart?: ApexChart;
  stroke?: ApexStroke;
  tooltip?: ApexTooltip;
  dataLabels?: ApexDataLabels;
  fill?: ApexFill;
  colors?: string[];
  legend?: ApexLegend;
  labels?: any;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  markers?: ApexMarkers[];
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  states?: ApexStates;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [OrganizationListService, PersonalService, KeypairListService, SubscriberCertificateListService]
})
export class DashboardComponent implements OnInit {
  @ViewChild('apexLineChartRef') apexLineChartRef: any;
  @ViewChild('apexDonutChartRef') apexDonutChartRef: any;
  private _unsubscribeAll: Subject<any>;
  public numberPersonal: number = 0;
  public numberOrganization: number = 0;
  public numberKeypair: number = 0;
  public numberSubscriberCertificate: number = 0;
  public subcriberChart1: Partial<ChartOptions>;
  public subcriberChart2: Partial<ChartOptions2>;
  public subscriberCertificateChart: Partial<ChartOptions>;
  public keypairChart: Partial<ChartOptions>;
  public requestChart1: Partial<ChartOptions>;
  public requestChart2: Partial<ChartOptions2>;
  // tr???ng th??i cho user
  public requestChartKeyUser: Partial<ChartOptions2>;
  public requestChartCertificate: Partial<ChartOptions2>;
  public requestChartSubscriber:Partial<ChartOptions2>;
  public requestChartSignatures: Partial<ChartOptions2>;
  // end tr???ng th??i cho user
  public certificateRequestChart: Partial<ChartOptions>;
  public hsmChart: Partial<ChartOptions>;
  public isMenuToggled = false;
  public user: boolean = false
  public admin: boolean = false
  public superadmin: boolean = false
  //get currentUser 
  private readonly currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );
  public fullName = this.currentUser.firstName + " " + this.currentUser.middleName + " " + this.currentUser.lastName
  public username = this.currentUser.username
  public email = this.currentUser.email

  constructor(
    private _organizationListService: OrganizationListService,
    private _personalService: PersonalService,
    private _keypairService: KeypairListService,
    private _subscriberCertificateService: SubscriberCertificateListService,
    private _coreConfigService: CoreConfigService
  ) {
    this._unsubscribeAll = new Subject();



    this.subcriberChart1 = {
      series: [
        {
          data: [230, 255, 278, 321, 352, 385]
        }
      ],
      chart: {
        height: 400,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      markers: {
        strokeWidth: 7,
        strokeOpacity: 1,
        strokeColors: [colors.solid.white],
        colors: [colors.solid.primary]
      },
      colors: [colors.solid.primary],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      xaxis: {
        categories: [
          '06/2021',
          '07/2021',
          '08/2021',
          '09/2021',
          '10/2021',
          '11/2021',
        ]
      },
      tooltip: {
        custom: function (data) {
          return (
            '<div class="px-1 py-50">' +
            '<span>' +
            data.series[data.seriesIndex][data.dataPointIndex] +
            ' thu?? bao</span>' +
            '</div>'
          );
        }
      }
    };

    this.subcriberChart2 = {
      series: [305, 80],
      chart: {
        height: 350,
        type: 'donut'
      },
      colors: [
        colors.solid.danger,
        colors.solid.warning
      ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: '2rem',
                fontFamily: 'Montserrat'
              },
              value: {
                fontSize: '1rem',
                fontFamily: 'Montserrat',
                formatter: function (val) {
                  return val;
                }
              },
              total: {
                show: true,
                fontSize: '1.5rem',
                label: 'T???ng s??? thu?? bao',
                formatter: function (w: any) {
                  const arr: any[] = w.config.series
                  return arr.reduce((a, b) => a + b, 0);
                }
              }
            }
          }
        }
      },
      legend: {
        show: true,
        position: 'bottom'
      },
      labels: ['Thu?? bao t??? ch???c', 'Thu?? bao c?? nh??n'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };

    this.subscriberCertificateChart = {
      series: [
        {
          data: [127, 150, 230, 305, 356, 412]
        }
      ],
      chart: {
        height: 400,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      markers: {
        strokeWidth: 7,
        strokeOpacity: 1,
        strokeColors: [colors.solid.white],
        colors: [colors.solid.success]
      },
      colors: [colors.solid.success],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      xaxis: {
        categories: [
          '06/2021',
          '07/2021',
          '08/2021',
          '09/2021',
          '10/2021',
          '11/2021',
        ]
      },
      tooltip: {
        custom: function (data) {
          return (
            '<div class="px-1 py-50">' +
            '<span>' +
            data.series[data.seriesIndex][data.dataPointIndex] +
            ' ch???ng th?? s???</span>' +
            '</div>'
          );
        }
      }
    };

    this.keypairChart = {
      series: [
        {
          data: [103, 116, 140, 192, 205, 225]
        }
      ],
      chart: {
        height: 400,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      markers: {
        strokeWidth: 7,
        strokeOpacity: 1,
        strokeColors: [colors.solid.white],
        colors: [colors.solid.info]
      },
      colors: [colors.solid.info],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      xaxis: {
        categories: [
          '06/2021',
          '07/2021',
          '08/2021',
          '09/2021',
          '10/2021',
          '11/2021',
        ]
      },
      tooltip: {
        custom: function (data) {
          return (
            '<div class="px-1 py-50">' +
            '<span>' +
            data.series[data.seriesIndex][data.dataPointIndex] +
            ' c???p kh??a</span>' +
            '</div>'
          );
        }
      }
    };
    // tr???ng th??i k?? s??? cho admin || super admin
    this.requestChart1 = {
      series: [
        {
          data: [190, 230, 190, 170, 220, 300]
        }
      ],
      chart: {
        height: 400,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      markers: {
        strokeWidth: 7,
        strokeOpacity: 1,
        strokeColors: [colors.solid.white],
        colors: [colors.solid.warning]
      },
      colors: [colors.solid.warning],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      xaxis: {
        categories: [
          '06/2021',
          '07/2021',
          '08/2021',
          '09/2021',
          '10/2021',
          '11/2021',
        ]
      },
      tooltip: {
        custom: function (data) {
          return (
            '<div class="px-1 py-50">' +
            '<span>' +
            data.series[data.seriesIndex][data.dataPointIndex] +
            ' l???n</span>' +
            '</div>'
          );
        }
      }
    };
    
    this.requestChart2 = {
      series: [1360, 80, 160],
      chart: {
        height: 350,
        type: 'donut'
      },
      colors: [
        colors.solid.success,
        colors.solid.danger,
        colors.solid.warning
      ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: '2rem',
                fontFamily: 'Montserrat'
              },
              value: {
                fontSize: '1rem',
                fontFamily: 'Montserrat',
                formatter: function (val) {
                  return val;
                }
              },
              total: {
                show: true,
                fontSize: '1.5rem',
                label: 'T???ng s??? l???n k??',
                formatter: function (w: any) {
                  const arr: any[] = w.config.series
                  return arr.reduce((a, b) => a + b, 0);
                }
              }
            }
          }
        }
      },
      legend: {
        show: true,
        position: 'bottom'
      },
      labels: ['Th??nh c??ng', 'Th???t b???i', '??ang x??? l??'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };

    // tr???ng th??i c???p kh??a cho user
    this.requestChartKeyUser = {
      series: [100, 30],
      chart: {
        height: 350,
        type: 'donut'
      },
      colors: [
        colors.solid.success,
        colors.solid.danger,
        // colors.solid.warning
      ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: '2rem',
                fontFamily: 'Montserrat'
              },
              value: {
                fontSize: '1rem',
                fontFamily: 'Montserrat',
                formatter: function (val) {
                  return val;
                }
              },
              total: {
                show: true,
                fontSize: '1.5rem',
                label: 'T???ng s??? c???p kh??a',
                formatter: function (w: any) {
                  const arr: any[] = w.config.series
                  return arr.reduce((a, b) => a + b, 0);
                }
              }
            }
          }
        }
      },
      legend: {
        show: true,
        position: 'bottom'
      },
      labels: ['C??n ho???t ?????ng', '???? thu h???i'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
    // tr???ng th??i y??u c???u ch???ng th???c cho user
    this.requestChartCertificate = {
      series: [150, 20],
      chart: {
        height: 350,
        type: 'donut'
      },
      colors: [
        colors.solid.success,
        colors.solid.warning,
        // colors.solid.warning
      ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: '2rem',
                fontFamily: 'Montserrat'
              },
              value: {
                fontSize: '1rem',
                fontFamily: 'Montserrat',
                formatter: function (val) {
                  return val;
                }
              },
              total: {
                show: true,
                fontSize: '1rem',
                label: 'Y??u c???u ch???ng th???c',
                formatter: function (w: any) {
                  const arr: any[] = w.config.series
                  return arr.reduce((a, b) => a + b, 0);
                }
              }
            }
          }
        }
      },
      legend: {
        show: true,
        position: 'bottom'
      },
      labels: ['Y??u c???u ch???ng th???c ???? g???i', 'Y??u c???u ch???ng th???c ch??a g???i'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
    // tr???ng th??i ch???ng th?? s??? cho user
    this.requestChartSubscriber = {
      series: [30, 70,100,40],
      chart: {
        height: 350,
        type: 'donut'
      },
      colors: [
        colors.solid.danger,
        colors.solid.warning,
        colors.solid.success,
        colors.solid.info,

      ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: '2rem',
                fontFamily: 'Montserrat'
              },
              value: {
                fontSize: '1rem',
                fontFamily: 'Montserrat',
                formatter: function (val) {
                  return val;
                }
              },
              total: {
                show: true,
                fontSize: '1rem',
                label: 'Ch???ng th?? s???',
                formatter: function (w: any) {
                  const arr: any[] = w.config.series
                  return arr.reduce((a, b) => (a+b), 0);
                }
              }
            }
          }
        }
      },
      legend: {
        show: true,
        position: 'bottom'
      },
      labels: ['Ch???ng th?? s??? h???t h???n', 'Ch???ng th?? s??? thu h???i',"Ch???ng th?? s??? c??n hi???u l???c","Ch???ng th?? s??? s???p h???t h???n"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
    // tr???ng th??i c???p kh??a cho admin ,superadmin 
    this.certificateRequestChart = {
      series: [
        {
          data: [146, 241, 278, 298, 310, 315]
        }
      ],
      chart: {
        height: 400,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      markers: {
        strokeWidth: 7,
        strokeOpacity: 1,
        strokeColors: [colors.solid.white],
        colors: [colors.solid.danger]
      },
      colors: [colors.solid.danger],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      xaxis: {
        categories: [
          '06/2021',
          '07/2021',
          '08/2021',
          '09/2021',
          '10/2021',
          '11/2021',
        ]
      },
      tooltip: {
        custom: function (data) {
          return (
            '<div class="px-1 py-50">' +
            '<span>' +
            data.series[data.seriesIndex][data.dataPointIndex] +
            ' y??u c???u</span>' +
            '</div>'
          );
        }
      }
    };

    this.hsmChart = {
      series: [
        {
          data: [100, 150, 200, 250, 300, 360]
        }
      ],
      chart: {
        height: 400,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      markers: {
        strokeWidth: 7,
        strokeOpacity: 1,
        strokeColors: [colors.solid.white],
        colors: [colors.solid.secondary]
      },
      colors: [colors.solid.secondary],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      xaxis: {
        categories: [
          '06/2021',
          '07/2021',
          '08/2021',
          '09/2021',
          '10/2021',
          '11/2021',
        ]
      },
      tooltip: {
        custom: function (data) {
          return (
            '<div class="px-1 py-50">' +
            '<span>' +
            data.series[data.seriesIndex][data.dataPointIndex] +
            ' thi???t b???</span>' +
            '</div>'
          );
        }
      }
    };
  }

  ngOnInit() {
    //this.getNumberPersonal();
    //this.getNumberOrganization();
    //this.getNumberKeypair();
    //this.getNumberSubcriberCertificate();
    console.log(this.currentUser.role)
    // this.currentUser.role.map((item) => {
      // if(item === "ROLE_SUPER_ADMIN"){
      //   this.superadmin = true
      // }
      // if(item === "ROLE_ADMIN"){
      //   this.admin = true
      // }
      // if (item === "ROLE_USER") {
      //   this.user = true
      // }
    // })
    if(this.currentUser.role.indexOf("ROLE_SUPER_ADMIN")>=0){
      this.superadmin = true;
      return;
    }
    if(this.currentUser.role.indexOf("ROLE_ADMIN")>=0){
      this.admin = true;
      return;
    }
    if(this.currentUser.role.indexOf("ROLE_USER")>=0){
      this.user = true;
      return;
    }
    console.log(this.user)
  }

  getNumberOrganization() {
    const pagedData = new PagedData<Organization>();
    pagedData.size = 1;
    pagedData.currentPage = 0;
    this._organizationListService
      .searchOrganizations(pagedData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.numberOrganization = response.data.totalItems;
      });
  }

  getNumberPersonal() {
    const pagedData = new PagedData<Personal>();
    pagedData.size = 1;

    pagedData.currentPage = 0;
    this._personalService
      .getListPersonals(pagedData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.numberPersonal = response.data.totalItems;
      });
  }

  getNumberKeypair() {
    const pagedData = new PagedData<Keypair>();
    pagedData.size = 1;
    pagedData.currentPage = 0;
    // this._keypairService
    //   .getData(pagedData, '')
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((response: any) => {
    //     this.numberKeypair = response.data.length
    //   });
  }

  getNumberSubcriberCertificate() {
    // this._subscriberCertificateService
    //   .getListSubscriberCertificates(0, 1)
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((response: any) => {
    //     this.numberSubscriberCertificate = response.data.totalItems
    //   })
    this.numberSubscriberCertificate = 100;
  }

  ngAfterViewInit() {
    // Subscribe to core config changes
    this._coreConfigService.getConfig().subscribe(config => {
      // If Menu Collapsed Changes
      if (config.layout.menu.collapsed === true || config.layout.menu.collapsed === false) {
        setTimeout(() => {
          // Get Dynamic Width for Charts
          this.isMenuToggled = true;
          this.subcriberChart1.chart.width = this.apexLineChartRef?.nativeElement.offsetWidth;
          this.subcriberChart2.chart.width = this.apexDonutChartRef?.nativeElement.offsetWidth;
          this.subscriberCertificateChart.chart.width = this.apexLineChartRef?.nativeElement.offsetWidth;
          this.keypairChart.chart.width = this.apexLineChartRef?.nativeElement.offsetWidth;
          this.requestChart1.chart.width = this.apexLineChartRef?.nativeElement.offsetWidth;
          this.requestChart2.chart.width = this.apexDonutChartRef?.nativeElement.offsetWidth;
          this.requestChartKeyUser.chart.width = this.apexDonutChartRef?.nativeElement.offsetWidth;
          this.requestChartCertificate.chart.width = this.apexDonutChartRef?.nativeElement.offsetWidth;
          this.requestChartSubscriber.chart.width = this.apexDonutChartRef?.nativeElement.offsetWidth;
          this.certificateRequestChart.chart.width = this.apexLineChartRef?.nativeElement.offsetWidth;
          this.hsmChart.chart.width = this.apexLineChartRef?.nativeElement.offsetWidth;
        }, 1300);
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
