export class NotificationMessages {
  async getMessage(code: string, entity: any): Promise<string> {
    let message = '';
    try {
      switch (code) {
        case '100':
          message = `${entity.name}님의 신규 회원가입을 환영합니다!`;
          break;
        case '200':
          message = `${entity.user.name}님이 ${entity.used_product.title} 제품을 찜하였습니다.`;
          break;
        case '201':
          message = `내가 찜한 ${entity.used_product.title}의 가격이 ${entity.used_product.price}원으로 변동되었습니다.`;
        default:
          message = '알 수 없는 알림입니다.';
          break;
      }
      return message;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
