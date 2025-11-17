/**
 * 分享配置
 * @param  {String} title  [Title]
 * @param  {String} path   [Path]
 * @return {Object}        [Share Config]
 */

let shareConfig = (option = {}) => {
  let title = '十一开发者中心',
      path = '/pages/home/home';

  if (option.title && option.title != '') {
      title = option.title;
  }

  if (option.path && option.path != '') {
      path = option.path;
  }

  return {
      title: title,
      path: path
  }
}
      /**
   * 本源码由十一云二改提供
   * 不懂的看：“http://shop.ajouter.top/ 在线指导文档”
   *  去水印接口一块钱 永久使用 
   * 步数接口一块钱   永久使用
   * 
   */
module.exports = {
  shareConfig: shareConfig
};