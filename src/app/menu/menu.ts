import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'collapsible',
    // role: ['Admin'], //? To hide collapsible based on user role
    icon: 'home',
    badge: {
      title: '1',
      translate: 'MENU.DASHBOARD.BADGE',
      classes: 'badge-light-warning badge-pill'
    },
    children: [
      {
        id: 'analytics',
        title: 'Analytics',
        translate: 'MENU.DASHBOARD.ANALYTICS',
        type: 'item',
        icon: 'circle',
        url: 'apps/dashboard'
      }
    ]
  },
  {
    id: 'identity-provider',
    title: 'Quản lý thuê bao',
    translate: 'MENU.IDENTITY_PROVIDER.SECTION',
    type: 'section',
    children: [
      {
        id:'profile',
        title: 'Hồ sơ',
        type: 'item',
        icon: 'user',
        translate: 'MENU.IDENTITY_PROVIDER.PROFILE',
        url: '/apps/ip/users/profile',
      },
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
        type :'collapsible',
        children: [
          {
            id: 'key-pair-list',
            title: 'Danh sách khóa',
            translate: 'MENU.TOKEN_MANAGEMENT.KEY_PAIR.LIST',
            type: 'item',
            url: '/apps/tm/keypair/keypair-list',
          },
          {
            id: 'key-pair-view',
            title: 'Chi tiết khóa',
            translate: 'MENU.TOKEN_MANAGEMENT.KEY_PAIR.VIEW',
            type: 'item',
            url: '/apps/tm/keypair/keypair-view',
          }
        ]
      },
      {
        id:'certificate-request',
        title:'Chứng thư số',
        translate: 'MENU.TOKEN_MANAGEMENT.SUBSCRIBER_CERTIFICATE.COLLAPSIBLE',
        type: 'collapsible',
        children :[
          {
            id : 'certificate-request-list',
            title: 'Danh sách chứng thư số',
            translate: 'MENU.TOKEN_MANAGEMENT.SUBSCRIBER_CERTIFICATE.LIST',
            type : 'item',
            url : '/apps/tm/certificate-request/certificate-request-list'
          },
          {
            id : 'certificate-request-view',
            title: 'Chi tiết chứng thư số',
            translate: 'MENU.TOKEN_MANAGEMENT.SUBSCRIBER_CERTIFICATE.VIEW',
            type: 'item',
            url: '/apps/tm/certificate-request/certificate-request-view'
          }
        ]
      },
      {
        id:'subscriber-certificate',
        title:'Yêu cầu chứng thực',
        translate: 'MENU.TOKEN_MANAGEMENT.CERTIFICATE_REQUEST.COLLAPSIBLE',
        type: 'collapsible',
        children :[
          {
            id : 'subscriber-certificate-list',
            title: 'Danh sách',
            translate: 'MENU.TOKEN_MANAGEMENT.CERTIFICATE_REQUEST.LIST',
            type : 'item',
            url : '/apps/tm/subscriber-certificate/subscriber-certificate-list'
          },
          {
            id : 'subscriber-certificate-view',
            title: 'Chi tiết yêu cầu',
            translate: 'MENU.TOKEN_MANAGEMENT.CERTIFICATE_REQUEST.VIEW',
            type: 'item',
            url: '/apps/tm/subscriber-certificate/subscriber-certificate-view'
          }
        ]
      }
    ]
  }
]
