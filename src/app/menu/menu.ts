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
    title: 'Quản lý người dùng',
    translate: 'MENU.IDENTITY_PROVIDER.SECTION',
    type: 'section',
    children: [
      {
        id: 'users',
        title: 'Tài khoản',
        translate: 'MENU.IDENTITY_PROVIDER.USERS.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'users',
        children: [
          {
            id: 'user-list',
            title: 'Danh sách',
            translate: 'MENU.IDENTITY_PROVIDER.USERS.LIST',
            type: 'item',
            icon: 'circle',
            url: 'apps/ip/users/user/user-list'
          },
          {
            id: 'user-view',
            title: 'Chi tiết',
            translate: 'MENU.IDENTITY_PROVIDER.USERS.VIEW',
            type: 'item',
            icon: 'circle',
            url: 'apps/ip/users/user/user-view'
          },
          {
            id: 'user-edit',
            title: 'Chỉnh sửa',
            translate: 'MENU.IDENTITY_PROVIDER.USERS.EDIT',
            type: 'item',
            icon: 'circle',
            url: 'apps/ip/users/user/user-edit'
          }
        ]
      },
      {
        id: 'subscribers',
        title: 'Thuê bao',
        translate: 'MENU.IDENTITY_PROVIDER.SUBSCRIBERS.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'codepen',
        children: [
          {
            id: 'personals',
            title: 'Thuê bao cá nhân',
            translate: 'MENU.IDENTITY_PROVIDER.SUBSCRIBERS.PERSONALS.COLLAPSIBLE',
            type: 'collapsible',
            icon: 'plus',
            children: [
              {
                id: 'personals-list',
                title: 'Danh sách',
                translate: 'MENU.IDENTITY_PROVIDER.SUBSCRIBERS.PERSONALS.LIST',
                type: 'item',

                icon: 'circle',
                url: 'apps/ip/subscribers/personals/personal-list'
              },
              {
                id: 'personals-view',
                title: 'Chi tiết',
                translate: 'MENU.IDENTITY_PROVIDER.SUBSCRIBERS.PERSONALS.VIEW',
                type: 'item',
                icon: 'circle',
                url: 'apps/ip/subscribers/personals/personal-view'
              },
              {
                id: 'personal-edit',
                title: 'Chỉnh sửa',
                translate: 'MENU.IDENTITY_PROVIDER.SUBSCRIBERS.PERSONALS.EDIT',
                type: 'item',
                icon: 'circle',
                url: 'apps/ip/subscribers/personals/personal-edit'
              }
            ]
          },
          {
            id: 'organizations',
            title: 'Thuê bao tổ chức',
            translate: 'MENU.IDENTITY_PROVIDER.SUBSCRIBERS.ORGANIZATIONS.COLLAPSIBLE',
            type: 'collapsible',
            icon: 'plus',
            children: [
              {
                id: 'organizations-list',
                title: 'Danh sách',
                translate: 'MENU.IDENTITY_PROVIDER.SUBSCRIBERS.ORGANIZATIONS.LIST',
                type: 'item',
                icon: 'circle',
                url: 'apps/ip/subscribers/organizations/organization-list'
              },
              {
                id: 'organizations-view',
                title: 'Chi tiết',
                translate: 'MENU.IDENTITY_PROVIDER.SUBSCRIBERS.ORGANIZATIONS.VIEW',
                type: 'item',
                icon: 'circle',
                url: 'apps/ip/subscribers/organizations/organization-view'
              },
              {
                id: 'organization-edit',
                title: 'Chỉnh sửa',
                translate: 'MENU.IDENTITY_PROVIDER.SUBSCRIBERS.ORGANIZATIONS.EDIT',
                type: 'item',
                icon: 'circle',
                url: 'apps/ip/subscribers/organizations/organization-edit'
              }
            ]
          }
        ]
      },
    ]
  },
  {
    id: 'token-management',
    title: 'Quản lý khóa/Chứng thư số',
    translate: 'MENU.TOKEN_MANAGEMENT.SECTION',
    type: 'section',
    children: [
      {
        id: 'key-pair',
        title: 'Khóa',
        translate: 'MENU.TOKEN_MANAGEMENT.KEY_PAIR.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'key',
        children: [
          {
            id: 'key-pair-list',
            title: 'Danh sách khóa',
            translate: 'MENU.TOKEN_MANAGEMENT.KEY_PAIR.LIST',
            type: 'item',
            icon: 'circle',
            url: '/apps/tm/keypair/keypair-list',

          },
          {
            id: 'key-pair-view',
            title: 'Chi tiết khóa',
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
        ]
      },
      {
        id: 'certificate-request',
        title: 'Chứng thư số',
        translate: 'MENU.TOKEN_MANAGEMENT.SUBSCRIBER_CERTIFICATE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'file-text',
        children: [
          {
            id: 'certificate-request-list',
            title: 'Danh sách chứng thư số',
            translate: 'MENU.TOKEN_MANAGEMENT.SUBSCRIBER_CERTIFICATE.LIST',
            type: 'item',
            icon: 'circle',
            url: '/apps/tm/certificate-request/certificate-request-list'
          },
          {
            id: 'certificate-request-view',
            title: 'Chi tiết chứng thư số',
            translate: 'MENU.TOKEN_MANAGEMENT.SUBSCRIBER_CERTIFICATE.VIEW',
            icon: 'circle',
            type: 'item',
            url: '/apps/tm/certificate-request/certificate-request-view'
          }
        ]
      },
      {
        id: 'subscriber-certificate',
        title: 'Yêu cầu chứng thực',
        translate: 'MENU.TOKEN_MANAGEMENT.CERTIFICATE_REQUEST.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'send',
        children: [
          {
            id: 'subscriber-certificate-list',
            title: 'Danh sách',
            translate: 'MENU.TOKEN_MANAGEMENT.CERTIFICATE_REQUEST.LIST',
            type: 'item',
            url: '/apps/tm/subscriber-certificate/subscriber-certificate-list'
          },
          {
            id: 'subscriber-certificate-view',
            title: 'Chi tiết yêu cầu',
            translate: 'MENU.TOKEN_MANAGEMENT.CERTIFICATE_REQUEST.VIEW',
            type: 'item',
            url: '/apps/tm/subscriber-certificate/subscriber-certificate-view'
          }
        ]
      }
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
        title: 'Thiết lập cấu hình',
        translate: 'MENU.SYSTEM_MANAGEMENT.SYSTEM',
        type: 'item',
        icon: 'settings',
        url: 'apps/system-management/configuration'
      },
      {
        id: 'monitorlog',
        title: 'Nhật ký',
        translate: 'MENU.SYSTEM_MANAGEMENT.LOG',
        type: 'item',
        icon: 'monitor',
        url: 'apps/system-management/monitorlog'
      }
    ]
  }
]
