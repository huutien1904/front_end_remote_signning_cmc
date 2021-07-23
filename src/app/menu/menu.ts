import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
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
    title: 'Quản lý cặp khóa',
    translate: 'MENU.TOKEN_MANAGEMENT.SECTION',
    type: 'section'
  }
]
