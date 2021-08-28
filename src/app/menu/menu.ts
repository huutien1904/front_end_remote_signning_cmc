import { MonitorlogComponent } from '../main/apps/system-management/monitorlog/monitorlog.component';
import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    translate: 'MENU.DASHBOARD',
    type: 'item',
    icon: 'pie-chart',
    url: 'apps/dashboard'
  },
  {
    id: 'identity-provider',
    title: 'Quản lý thuê bao',
    translate: 'MENU.SUBSCRIPTION_MANAGEMENT.SECTION',
    type: 'section',
    children: [
      {
        id: 'subcription-management',
        title: 'Tìm kiếm',
        translate: 'MENU.SUBSCRIPTION_MANAGEMENT.SEARCH',
        type: 'item',
        icon: 'search',
        url: 'apps/ip/subscribers-search',
        
      },
      {
        id: 'subcription-management',
        title: 'Tạo thuê bao',
        translate: 'MENU.SUBSCRIPTION_MANAGEMENT.CREATE_NEW_SUBSCRIPTIONS',
        type: 'item',
        icon: 'user-plus',
        url: 'apps/ip/subscribers-create',
        
      },
    ]
  },
  {
    id: 'token-management',
    title: 'Quản lý cặp khóa',
    translate: 'MENU.TOKEN_MANAGEMENT.SECTION',
    type: 'section',
    children: [
      {
        id: 'search',
        title: 'Tìm kiếm',
        type: 'item',
        icon: 'search',
        url: '/apps/tm/search'
      },
      // {
      //   id: 'key-pair-list',
      //   title: 'Tạo cặp khóa',
      //   translate: 'MENU.TOKEN_MANAGEMENT.KEY_PAIR.LIST',
      //   type: 'item',
      //   icon: 'file-text',
      //   url: '/apps/tm/keypair/keypair-list'
      // },
        /*children: [
          {
            id: 'key-pair-list',
            title: 'Danh sách',
            translate: 'MENU.TOKEN_MANAGEMENT.KEY_PAIR.LIST',
            type: 'item',
            icon: 'circle',
            url: '/apps/tm/keypair/keypair-list',

          },
          {
            id: 'key-pair-view',
            title: 'Chi tiết',
            translate: 'MENU.TOKEN_MANAGEMENT.KEY_PAIR.VIEW',
            type: 'item',
            icon: 'circle',
            url: '/apps/tm/keypair/keypair-view',
          },
          {
            id: 'key-pair-template',
            title: 'Mẫu cặp khóa',
            translate: 'MENU.TOKEN_MANAGEMENT.KEY_PAIR.TEMPLATE',
            type: 'item',
            icon: 'circle',
            url: '/apps/tm/keypair/keypair-template',
          }
        ]*/
      {
        id: 'certificate-request-list',
        title: 'Tạo yêu cầu chứng thực',
        translate: 'MENU.TOKEN_MANAGEMENT.SUBSCRIBER_CERTIFICATE.LIST',
        type: 'item',
        icon: 'file-text',
        url: '/apps/tm/certificate-request/certificate-request-create'
      },
        /*children: [
          {
            id: 'certificate-request-list',
            title: 'Danh sách',
            translate: 'MENU.TOKEN_MANAGEMENT.SUBSCRIBER_CERTIFICATE.LIST',
            type: 'item',
            icon: 'circle',
            url: '/apps/tm/certificate-request/certificate-request-list'
          },
          {
            id: 'certificate-request-view',
            title: 'Chi tiết',
            translate: 'MENU.TOKEN_MANAGEMENT.SUBSCRIBER_CERTIFICATE.VIEW',
            icon: 'circle',
            type: 'item',
            url: '/apps/tm/certificate-request/certificate-request-view'
          }
        ]*/
      {
        id: 'subscriber-certificate-list',
        title: 'Nhập chứng thư số',
        translate: 'MENU.TOKEN_MANAGEMENT.CERTIFICATE_REQUEST.LIST',
        icon: 'file-text',
        type: 'item',
        url: '/apps/tm/subscriber-certificate/subscriber-certificate-list'
      }
        /*children: [
          {
            id: 'subscriber-certificate-list',
            title: 'Danh sách',
            translate: 'MENU.TOKEN_MANAGEMENT.CERTIFICATE_REQUEST.LIST',
            type: 'item',
            url: '/apps/tm/subscriber-certificate/subscriber-certificate-list'
          },
          {
            id: 'subscriber-certificate-view',
            title: 'Chi tiết',
            translate: 'MENU.TOKEN_MANAGEMENT.CERTIFICATE_REQUEST.VIEW',
            type: 'item',
            url: '/apps/tm/subscriber-certificate/subscriber-certificate-view'
          }
        ]*/
    ]
  },
  {
    id: 'equipment-management',
    title: 'Quản lý thiết bị',
    translate: 'MENU.EQUIPMENT_MANAGEMENT.SECTION',
    type: 'section',
    children: [
      {
        id: "hsm-management",
        title: 'Thiết bị HSM',
        translate: 'MENU.EQUIPMENT_MANAGEMENT.HSM',
        type: 'item',
        icon: 'tool',
        url: '/apps/equipment-management/hsm'
      },
      {
        id: "token-management",
        title: 'Token',
        translate: 'MENU.EQUIPMENT_MANAGEMENT.TOKEN',
        type: 'item',
        icon: 'tablet',
        url: '/apps/equipment-management/token'
      }
    ]
  },
  {
    id: 'system-management',
    title: 'Quản lý hệ thống',
    translate: 'MENU.SYSTEM_MANAGEMENT.SECTION',
    type: 'section',
    children: [
      {
        id: 'configuration',
        title: 'Cấu hình',
        translate: 'MENU.SYSTEM_MANAGEMENT.SYSTEM',
        type: 'item',
        icon: 'settings',
        url: 'apps/system-management/configuration'
      },
      {
        id: 'monitorlog',
        title: 'Xem nhật ký',
        translate: 'MENU.SYSTEM_MANAGEMENT.LOG',
        type: 'item',
        icon: 'monitor',
        url: 'apps/system-management/monitorlog'
      }
    ]
  }
]
