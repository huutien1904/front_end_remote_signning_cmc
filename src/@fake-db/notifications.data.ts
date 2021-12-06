export class NotificationsFakeData {
  public static data = {
    messages: [
      {
        image: 'assets/images/portrait/small/avatar-s-11.jpg',
        heading: '<span class="font-weight-bolder">Chúc mừng sinh nhật 🎉</span> Hưng!',
        text: 'Chúc bạn có một ngày sinh nhật vui vẻ.'
      },
      {
        image: 'assets/images/portrait/small/avatar-s-11.jpg',
        heading: '<span class="font-weight-bolder">Bạn ký thành công 3 </span>  tài liệu.',
        text: '3 tài liệu được ký thành công, kiểm tra'
      },
      {
        image: 'assets/images/portrait/small/avatar-s-11.jpg',
        heading: '<span class="font-weight-bolder">Bạn được yêu cầu ký 2 tài liệu 👋</span> kiểm tra.',
        text: 'Tài liệu cập nhật'
      }
    ],
    systemMessages: [
      {
        icon: 'x',
        heading: '<span class="font-weight-bolder">Server bị bị lỗi</span> đột ngột',
        text: 'Server CA bị lỗi do sử dụng tài nguyên lớn.'
      },
      {
        icon: 'check',
        heading: '<span class="font-weight-bolder">Báo cáo hệ thống</span> đã được tạo',
        text: 'Báo cáo hệ thống ngày hôm nay được tạo.'
      },
      {
        icon: 'alert-triangle',
        heading: '<span class="font-weight-bolder">Bộ nhớ cao</span> usage',
        text: 'Server SSA đăng dùng quá nhiều memory.'
      }
    ],
    system: true
  };
}
