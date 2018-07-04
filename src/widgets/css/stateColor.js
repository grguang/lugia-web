/**
 * by wangcuixia
 * @flow
 * **/

import changeColor from './utilsColor';
import type { CommonCSS } from '@lugia/lugia-web';

type StateColor = CommonCSS & {
  normalColor: string,
  hoverColor: string,
  mouseDownColor: string,
  disabledColor: string,
  spiritColor: string,
  disabledSpiritBackgroundColor: string,
  disabledSpiritFontAndBorderColor: string,
};

const DefaultCommonStyle = {
  themeColor: '#684fff', //主题色
  successColor: '#56c22d', //成功色
  warningColor: '#f8ac30', //警告色
  dangerColor: '#f22735', //危险色
  blackColor: '#333333', //黑色
  darkGreyColor: '#666666', //深灰色
  mediumGreyColor: '#999999', //中灰色
  lightGreyColor: '#cccccc', //浅灰色
  superLightColor: '#e8e8e8', //超浅色
  disableColor: '#f2f2f2', //禁止色
  defaultColor: '#ffffff', //默认白色色
  borderColor: '#cccccc', //边框色
  borderDisableColor: '#e8e8e8', //边框禁止色
  borderSize: '1px', //边框大小
  boxShadowOpacity: '20%', //边框透明度
  hShadow: '0', //边框水平偏移值（X）
  vShadow: '0', //边框竖直偏移值（Y）
  shadowSpread: '6px', //边框大小
  borderRadius: '4px', //圆角通用
  circleBorderRadius: '50%', //圆角-特殊
  transitionTime: '0.3s', //过渡时间
  rulesColor: '#fff', //分割线颜色
  rulesSize: '1px', //分割线大小
  rulesOpacity: '40%', //分割线透明度
  padding: '10px', //元素左右padding
  paddingToText: '6px', //文字到元素的距离
  marginToSameElement: '10px', //同级元素与元素之间距离
  marginToDifferentElement: '30px', //元素组之间距离
  marginToPeerElementForY: '10px', //同级元素竖向间距
  marginToSameElementForY: '6px', //竖向文字到元素距离
  marginToSonElement: '16px', //主从关系元素间距
};
let CommonStyle = {};
export function replaceStyle(theme: CommonCSS) {
  let SaveStyle = {};
  SaveStyle = JSON.parse(JSON.stringify(DefaultCommonStyle));
  if (theme) {
    Object.keys(theme).forEach(trait => {
      if (trait && theme[trait]) {
        SaveStyle[trait] = theme[trait];
      }
    });
  }
  CommonStyle = { ...SaveStyle };
}

export function colorsFactory(changeColor: Function) {
  const func = (themeColor?: string): StateColor => {
    if (!themeColor) {
      themeColor = CommonStyle.themeColor || DefaultCommonStyle.themeColor;
    }
    return {
      normalColor: changeColor(themeColor).color,
      hoverColor: changeColor(themeColor, 20).color,
      mouseDownColor: changeColor(themeColor, 0, 20).color,
      disabledColor: changeColor(themeColor, 45).color,
      spiritColor: changeColor(themeColor, 0, 0, 5).rgba,
      disabledSpiritBackgroundColor: changeColor(themeColor, 0, 0, 1.5).rgba,
      disabledSpiritFontAndBorderColor: changeColor(themeColor, 0, 0, 30).rgba,
      ...CommonStyle,
    };
  };
  func.__changeColor__ = changeColor;
  return func;
}

const colorsFunc = colorsFactory(changeColor);
export default colorsFunc;
