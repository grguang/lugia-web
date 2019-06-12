/**
 *
 * create by liangguodong on 2018/8/27
 *
 * @flow
 */
import '../common/shirm';
import * as React from 'react';
import Widget from '../consts/index';
import type { AvatarSize, AvatarShape } from '../css/avatar';
import { LargeHeight, SmallHeight, DefaultHeight } from '../css/avatar';
import Icon from '../icon';
import ThemeHoc from '@lugia/theme-hoc';
import KeyBoardEventAdaptor from '../common/KeyBoardEventAdaptor';
import CSSComponent, { css } from '../theme/CSSProvider';
import { ObjectUtils } from '@lugia/type-utils';
import colorsFunc from '../css/stateColor';
import { units } from '@lugia/css';

const { px2remcss } = units;
const { borderColor } = colorsFunc();
const BaseAvatar = CSSComponent({
  tag: 'div',
  className: 'baseAvatar',
  normal: {
    selectNames: [['color'], ['width'], ['height'], ['background'], ['margin'], ['padding']],
    getCSS(themeMeta: Object, themeProps: Object) {
      const { propsConfig } = themeProps;
      const { width, height } = themeMeta;
      const { size, src, icon, shape } = propsConfig;
      const theBackgroundColor = src || icon ? '' : borderColor;
      const theSize =
        size === 'large' ? LargeHeight : size === 'small' ? SmallHeight : DefaultHeight;
      const theWidth = ObjectUtils.isNumber(width) ? px2remcss(width) : theSize;
      const theHeight = ObjectUtils.isNumber(height) ? px2remcss(height) : theSize;
      const theBorderRadius = shape === 'circle' ? '50%' : '10%';
      return `border-radius:${theBorderRadius};width :${theWidth};height:${theHeight}; line-height: ${theSize};background-color:${theBackgroundColor};`;
    },
  },
  css: css`
    font-variant: tabular-nums;
    color: rgba(0, 0, 0, 0.65);
    box-sizing: border-box;
    display: inline-block;
    text-align: center;
    white-space: nowrap;
    position: relative;
    background-color: ${borderColor};
  `,
});
const AvatarIcon: Object = CSSComponent({
  extend: Icon,
  className: 'avatarIcon',
  normal: {
    selectNames: [['color']],
    getCSS(themeMeta: Object, themeProps: Object) {
      const { propsConfig } = themeProps;
      const { size } = propsConfig;
      const theFontSize = size === 'large' ? '2.2em' : size === 'small' ? '1.2em' : '1.8em';
      return `font-size:${theFontSize};`;
    },
  },
  css: css`
    display: inline-block;
    font-style: normal;
    text-align: center;
    text-transform: none;
    vertical-align: middle !important;
    color: white;
  `,
});

const Name = CSSComponent({
  tag: 'span',
  className: 'avatarName',
  normal: {
    selectNames: [['color'], ['width'], ['height']],
    getCSS(themeMeta: Object, themeProps: Object) {
      const { propsConfig } = themeProps;
      const { width, height } = themeMeta;
      const { size } = propsConfig;
      const theSize =
        size === 'large' ? LargeHeight : size === 'small' ? SmallHeight : DefaultHeight;
      const theWidth = ObjectUtils.isNumber(width) ? px2remcss(width) : theSize;
      const theHeight = ObjectUtils.isNumber(height) ? px2remcss(height) : theSize;
      return `width :${theWidth};height:${theHeight};`;
    },
  },
  css: css`
    user-select: none;
    color: white;
  `,
});
const Picture = CSSComponent({
  tag: 'img',
  className: 'avatarPicture',
  normal: {
    selectNames: [['color'], ['width'], ['height']],
    getCSS(themeMeta: Object, themeProps: Object) {
      const { propsConfig } = themeProps;
      const { width, height } = themeMeta;
      const { size, shape } = propsConfig;
      const theSize =
        size === 'large' ? LargeHeight : size === 'small' ? SmallHeight : DefaultHeight;
      const theBorderRadius = shape === 'circle' ? '50%' : '10%';
      const theWidth = ObjectUtils.isNumber(width) ? px2remcss(width) : theSize;
      const theHeight = ObjectUtils.isNumber(height) ? px2remcss(height) : theSize;
      return `width :${theWidth};height:${theHeight};border-radius:${theBorderRadius};`;
    },
  },
  css: css`
    vertical-align: middle;
  `,
});

type AvatarProps = {
  viewClass?: string,
  shape?: AvatarShape,
  size?: AvatarSize,
  src?: string,
  icon?: string,
  name: string,
  getTheme: Function,
  themeProps: Object,
};
type AvatarState = {};

class AvatarBox extends React.Component<AvatarProps, AvatarState> {
  static defaultProps = {
    viewClass: Widget.Avatar,
    shape: 'circle',
    size: 'default',
  };
  static displayName = Widget.Avatar;

  getChildren() {
    const { src, icon, name, size, shape, themeProps } = this.props;
    themeProps.propsConfig = { size, shape, src, icon };
    if (src !== undefined && src !== null) {
      return <Picture src={src} shape={shape} themeProps={themeProps} />;
    } else if (icon !== undefined && icon !== null) {
      return <AvatarIcon size={size} iconClass={icon} shape={shape} themeProps={themeProps} />;
    }
    let finalName = name + '';
    finalName = finalName.length > 5 ? finalName.substr(0, 5) : finalName;
    return (
      <Name size={size} themeProps={themeProps}>
        {finalName}
      </Name>
    );
  }
  getAvatar() {
    const { props } = this;
    const { themeProps, size, shape, src, icon } = props;
    themeProps.propsConfig = { size, shape, src, icon };
    return (
      <BaseAvatar {...props} themeProps={themeProps}>
        {this.getChildren()}
      </BaseAvatar>
    );
  }
  render() {
    return this.getAvatar();
  }
}
const Avatar = ThemeHoc(KeyBoardEventAdaptor(AvatarBox), Widget.Avatar);
export default Avatar;
