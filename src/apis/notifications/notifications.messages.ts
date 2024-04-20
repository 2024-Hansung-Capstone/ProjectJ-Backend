import { Notification } from './entities/notification.entity';

export class NotificationMessages {
  /**
   * 알림 메시지 생성 메서드
   * 알림 코드에 따라 알림 메시지를 생성합니다.
   * @param notification 메시지를 조회할 알림 정보
   * @returns 생성된 알림 메시지
   */
  async getMessage(notification: Notification): Promise<string> {
    let message = '';
    try {
      switch (notification.code) {
        case '100':
          message = `${notification.user.name}님의 신규 회원가입을 환영합니다!`;
          break;
        case '200':
          message = `${notification.like.user.name}님이 '${notification.used_product.title}' 제품을 찜하였습니다.`;
          break;
        case '201':
          message = `내가 찜한 '${notification.used_product.title}'의 가격이 ${notification.used_product.price}원으로 변동되었습니다.`;
          break;
        case '202':
          message = `게시글 '${notification.board.title}'에 ${notification.like.user.name}님이 좋아요를 눌렀습니다.`;
          break;
        case '203':
          message = `'${notification.board.title}' 게시글에 단 내 댓글에 ${notification.like.user.name}님이 좋아요를 눌렀습니다.`;
          break;
        case '300':
          message = `게시글 '${notification.board.title}'에 ${notification.reply.user.name}님이 댓글을 남겼습니다.`;
          break;
        case '400':
          message = `'${notification.letter.sender.name}님이 ${notification.letter.category} 카테고리에서 쪽지를 보냈습니다.`;
          break;
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
