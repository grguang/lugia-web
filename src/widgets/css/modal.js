/**
 * Layout
 * create by guorg
 * @flow
 */
import { px2emcss } from '../css/units';
import colorsFunc from '../css/stateColor';
import styled, { css, keyframes } from 'styled-components';
import type { ThemeType } from '@lugia/lugia-web';
import Icon from '../icon';
import { createGetWidthOrHeight } from '../common/ThemeUtils';
import { getAttributeFromObject } from '../common/ObjectUtils';

type IconType = 'confirm' | 'info' | 'success' | 'warning' | 'error';
type FunctionPropsType = {
  showIcon?: boolean,
  iconType?: IconType,
};
export type ModalProps = {
  title?: string | React.ReactNode,
  children: string | React.ReactNode,
  visible: boolean,
  cancelText?: string,
  okText?: string,
  onOk: Function,
  onCancel: Function,
  confirmLoading?: boolean,
  footer?: string | React.ReactNode,
  maskClosable?: boolean,
  getTheme: Function,
  mask?: boolean,
} & FunctionPropsType;
export type ModalState = {
  visible: boolean,
  closing: boolean,
  opening: boolean,
};
type CSSProps = {
  showIcon: boolean,
  iconType: IconType,
  closing: boolean,
  opening: boolean,
  theme?: ThemeType,
};

const FontSize = 1.4;
const em = px2emcss(FontSize);
const specialEM = px2emcss(1.6);
const {
  themeColor,
  successColor,
  warningColor,
  dangerColor,
  blackColor,
  darkGreyColor,
} = colorsFunc();
export const IconInfo = {
  info: { class: 'lugia-icon-reminder_info_circle', color: themeColor },
  confirm: { class: 'lugia-icon-reminder_question_circle', color: warningColor },
  success: { class: 'lugia-icon-reminder_check_circle', color: successColor },
  error: { class: 'lugia-icon-reminder_close_circle', color: dangerColor },
  warning: { class: 'lugia-icon-reminder_exclamation_circle', color: warningColor },
};

export const Wrap = styled.div`
  display: ${props => (props.visible ? 'block' : 'none')};
  font-size: ${FontSize}rem;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
`;
const getAnimate = (props: CSSProps) => {
  const { closing, opening } = props;
  const OpenKeyframe = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;
  const CloseKeyframe = keyframes`
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  `;
  if (closing) {
    return css`
      animation: ${CloseKeyframe} 0.4s;
    `;
  }
  if (opening) {
    return css`
      animation: ${OpenKeyframe} 0.4s;
    `;
  }
};
export const ModalMask = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 99999;
  ${getAnimate};
`;
export const ModalWrap = styled.div`
  position: fixed;
  right: 0;
  left: 0;
  margin: auto;
  z-index: 99999;
`;

const getWidth = (props: CSSProps) => {
  const { theme = {} } = props;
  const { width } = theme;
  if (width && typeof width === 'number') {
    return createGetWidthOrHeight('width', { fontSize: 1.4 })({ theme });
  }

  return `width: ${em(520)};`;
};

export const Modal = styled.div`
  box-sizing: border-box;
  font-size: ${FontSize}rem;
  position: relative;
  ${getWidth};
  top: ${em(100)};
  margin: 0 auto;
  z-index: 99999;
  ${getAnimate};
`;

const getPadding = (props: CSSProps) => {
  const { theme = {}, showIcon } = props;
  const { padding } = theme;
  const defaultLeft = showIcon ? 50 : 30;
  if (padding) {
    if (typeof padding === 'number') {
      return `padding: ${em(padding)};`;
    }
    const top = getAttributeFromObject(padding, 'top', 30);
    const right = getAttributeFromObject(padding, 'right', 30);
    const bottom = getAttributeFromObject(padding, 'bottom', 30);
    const left = getAttributeFromObject(padding, 'left', defaultLeft);

    return `padding: ${em(top)} ${em(right)} ${em(bottom)} ${em(left)};`;
  }
  return `padding: ${em(30)} ${em(30)} ${em(30)} ${em(defaultLeft)};`;
};

export const ModalContent = styled.div`
  position: relative;
  background-color: #fff;
  border: 0;
  border-radius: ${em(4)};
  box-shadow: 0 ${em(4)} ${em(12)} rgba(0, 0, 0, 0.15);
  ${props => (props.showIcon ? `padding-left: ${em(20)};` : '')};
  ${getPadding};
`;
export const ModalClose = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: ${em(64)};
  height: ${em(64)};
  cursor: pointer;
  text-align: center;
  line-height: ${em(64)};
`;
export const ModalTitle = styled.div`
  padding-bottom: ${specialEM(16)};
  border-radius: ${specialEM(4)} ${specialEM(4)} 0 0;
  background: #fff;
  color: ${blackColor};
  font-size: ${em(16)};
  font-weight: 500;
`;
export const ModalBody = styled.div`
  color: ${darkGreyColor};
  word-wrap: break-word;
`;
export const ModalFooter = styled.div`
  padding-top: ${em(22)};
  border-radius: 0 0 4px 4px;
  & > button {
    margin-left: ${em(14)};
  }
  & > button:first-child {
    margin-left: 0;
  }
`;
export const Icons: Object = styled(Icon)`
  font-size: ${em(16)};
`;
const getIconColor = (props: CSSProps) => {
  const { iconType } = props;
  return `color: ${IconInfo[iconType].color};`;
};
export const BigIcons: Object = styled(Icon)`
  font-size: ${em(20)};
  position: absolute;
  left: ${px2emcss(2)(22)};
  top: ${px2emcss(2)(28)};
  ${getIconColor};
`;
