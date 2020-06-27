/**
 *
 * create by guorg
 *
 * @flow
 *
 */
import * as React from 'react';
import type { AffixProps, AffixState } from '../css/affix';
import { Affix } from '../css/affix';
import { getElementPosition } from '../utils';

export function getScrollTop(): number {
  let scrollPos;
  if (window.pageYOffset) {
    scrollPos = window.pageYOffset;
  } else if (document.compatMode && document.compatMode != 'BackCompat') {
    scrollPos = document.documentElement && document.documentElement.scrollTop;
  } else if (document.body) {
    scrollPos = document.body.scrollTop;
  }
  return scrollPos || 0;
}

const OffsetBottom = 'offsetBottom';
const OffsetTop = 'offsetTop';

export default class extends React.Component<AffixProps, AffixState> {
  affix: any;
  defaultAffixOffsetTop: number;
  targetDefaultOffsetTop: number;
  contentWidth: number;
  contentHeight: number;

  constructor() {
    super();
    this.state = {
      fixed: false,
    };
  }

  componentDidMount() {
    const { target } = this.props;
    this.contentWidth = this.affix && this.affix.offsetWidth;
    this.contentHeight = this.affix && this.affix.offsetHeight;
    this.defaultAffixOffsetTop = this.affix && getElementPosition(this.affix).y;
    setTimeout(() => {
      if (target && typeof target === 'function') {
        this.targetDefaultOffsetTop = target() && getElementPosition(target()).y;
        target().addEventListener('scroll', this.addTargetListener);

        return;
      }
      this.addWindowListener();
      window.addEventListener('scroll', this.addWindowListener);
    }, 0);
  }

  addWindowListener = () => {
    const { offsetTop = 0, offsetBottom = 0 } = this.props;
    const winHeight = window.innerHeight;
    const scrollTop = getScrollTop();
    const affixTop = this.affix && getElementPosition(this.affix).y;
    const defaultTop = this.defaultAffixOffsetTop;

    this.setFixedForWin({
      offsetTop,
      offsetBottom,
      winHeight,
      scrollTop,
      affixTop,
      defaultTop,
    });
  };
  addTargetListener = () => {
    const {
      offsetTop = 0,
      offsetBottom = 0,
      target = (): Object => {
        return {};
      },
    } = this.props;
    const affixTop = this.affix && getElementPosition(this.affix).y;
    const winHeight = window.innerHeight;
    const targetTop = this.affix && getElementPosition(target()).y;
    const targetScroll = target().scrollTop;
    const targetRect = target().getBoundingClientRect();
    const targetHeight = target().offsetHeight;

    this.setFixedForTarget({
      affixTop,
      targetTop,
      targetScroll,
      offsetTop,
      winHeight,
      offsetBottom,
      targetRect,
      targetHeight,
    });
  };

  setFixed = (fixed: boolean) => {
    const { fixed: stateFixed } = this.state;
    if (stateFixed === fixed) {
      return;
    }
    this.setState({
      fixed,
    });
  };

  setFixedForWin = (param: Object) => {
    const { offsetTop, offsetBottom, winHeight, scrollTop, affixTop, defaultTop } = param;
    const type = this.getOffsetType();
    switch (type) {
      case OffsetTop:
        if (affixTop - scrollTop <= offsetTop) {
          this.offset = offsetTop;
          this.setFixed(true);
        }

        if (defaultTop - scrollTop > offsetTop) {
          this.setFixed(false);
        }
        break;
      case OffsetBottom:
        const nowOffsetTop = this.affix && getElementPosition(this.affix).y;
        const affixHeight = this.affix && this.affix.offsetHeight;
        if (winHeight + scrollTop - nowOffsetTop - affixHeight <= offsetBottom) {
          this.offset = offsetBottom;
          this.setFixed(true);
        }
        if (scrollTop + winHeight - offsetBottom >= defaultTop + affixHeight) {
          this.setFixed(false);
        }
        break;
      default:
    }
  };

  setFixedForTarget(param: Object) {
    const {
      affixTop,
      targetTop,
      targetScroll,
      offsetTop,
      winHeight,
      offsetBottom,
      targetRect,
      targetHeight,
    } = param;
    const type = this.getOffsetType();
    const defaultDistance = this.defaultAffixOffsetTop - this.targetDefaultOffsetTop;
    switch (type) {
      case OffsetTop:
        const fixedTargetOffsetTop = offsetTop + targetScroll;
        if (defaultDistance >= fixedTargetOffsetTop) {
          this.setFixed(false);
          break;
        }

        if (affixTop - targetTop < fixedTargetOffsetTop) {
          this.offset = offsetTop + targetRect.top;
          this.setFixed(true);
          break;
        }

        break;

      case OffsetBottom:
        const docScrollTop = getScrollTop();
        const affixHeight = this.affix && this.affix.offsetHeight;
        const affixBottomInDoc =
          (this.state.fixed ? affixTop + docScrollTop : affixTop) + affixHeight;
        const targetBottomInDoc = targetTop + targetHeight;
        if (affixBottomInDoc - targetBottomInDoc <= offsetBottom + targetScroll) {
          this.offset = winHeight - targetRect.bottom + offsetBottom;
          this.setFixed(true);
        }
        if (this.affix.offsetTop - targetRect.top >= defaultDistance - targetScroll) {
          this.setFixed(false);
        }

        break;
      default:
    }
  }

  getOffsetValue() {
    const { offset } = this;
    return {
      [this.getOffsetType()]: offset,
    };
  }

  getOffsetType = (): 'offsetBottom' | 'offsetTop' => {
    let res = OffsetTop;
    if (this.isInProps(OffsetTop)) {
      return res;
    }
    if (this.isInProps(OffsetBottom)) {
      res = OffsetBottom;
    }
    return res;
  };

  shouldComponentUpdate(nextProps: AffixProps, nextState: AffixState) {
    const { onChange } = this.props;
    if (nextState.fixed !== this.state.fixed) {
      onChange && onChange(nextState.fixed);
    }

    return true;
  }

  componentWillUnmount() {
    const { target } = this.props;
    window.removeEventListener('scroll', this.addWindowListener);
    if (target && typeof target === 'function') {
      target() && target().removeEventListener('scroll', this.addTargetListener);
    }
  }

  render() {
    const { children } = this.props;
    const { fixed } = this.state;
    const { contentWidth, contentHeight } = this;
    return (
      <div style={fixed ? { width: contentWidth, height: contentHeight } : null}>
        <Affix ref={node => (this.affix = node)} fixed={fixed} {...this.getOffsetValue()}>
          {children}
        </Affix>
      </div>
    );
  }

  getOffsetType = (): 'offsetBottom' | 'offsetTop' => {
    let res = OffsetTop;
    if (this.isInProps(OffsetTop)) {
      return OffsetTop;
    }
    if (this.isInProps(OffsetBottom)) {
      res = OffsetBottom;
    }
    return res;
  };

  isInProps(value: 'offsetTop' | 'offsetBottom') {
    return value in this.props;
  }
}
