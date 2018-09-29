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

function getScrollTop(): ?number {
  let scrollPos;
  if (window.pageYOffset) {
    scrollPos = window.pageYOffset;
  } else if (document.compatMode && document.compatMode != 'BackCompat') {
    scrollPos = document.documentElement && document.documentElement.scrollTop;
  } else if (document.body) {
    scrollPos = document.body.scrollTop;
  }
  return scrollPos;
}
const OffsetBottom = 'offsetBottom';
const OffsetTop = 'offsetTop';

export default class extends React.Component<AffixProps, AffixState> {
  affix: any;
  defaultOffsetTop: number;
  targetDefaultOffsetTop: number;
  constructor() {
    super();
    this.state = {
      fixed: false,
    };
  }
  componentDidMount() {
    const { target } = this.props;
    this.defaultOffsetTop = this.affix && this.affix.offsetTop;

    setTimeout(() => {
      if (target && typeof target === 'function') {
        this.targetDefaultOffsetTop = target().offsetTop;
        target().addEventListener('scroll', this.addTargetListener);

        return;
      }
      window.addEventListener('scroll', this.addWindowListener);
    }, 100);
  }
  addWindowListener = () => {
    const { offsetTop = 0, offsetBottom = 0 } = this.props;
    const winHeight = window.innerHeight;
    const scrollTop = getScrollTop() || 0;
    const affixOffsetTop = this.affix.offsetTop;
    const defaultOffsetTop = this.defaultOffsetTop;

    this.setFixedForWin({
      offsetTop,
      offsetBottom,
      winHeight,
      scrollTop,
      affixOffsetTop,
      defaultOffsetTop,
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
    const affixRect = this.affix.getBoundingClientRect();
    const winHeight = window.innerHeight;
    const targetRect = target().getBoundingClientRect();
    const targetScroll = target().scrollTop;

    this.setFixedForTarget({
      affixRect,
      targetRect,
      targetScroll,
      offsetTop,
      winHeight,
      offsetBottom,
    });
  };

  setFixedForWin = (param: Object) => {
    const {
      offsetTop,
      offsetBottom,
      winHeight,
      scrollTop,
      affixOffsetTop,
      defaultOffsetTop,
    } = param;
    const type = this.getOffsetType();
    switch (type) {
      case OffsetTop:
        if (affixOffsetTop - scrollTop <= offsetTop) {
          this.setState({
            fixed: true,
            offset: offsetTop,
          });
        }
        if (defaultOffsetTop >= scrollTop + offsetTop) {
          this.setState({
            fixed: false,
          });
        }
        break;
      case OffsetBottom:
        const currentPos = this.affix.getBoundingClientRect();
        if (winHeight - currentPos.bottom <= offsetBottom) {
          this.setState({
            fixed: true,
            offset: offsetBottom,
          });
        }
        if (defaultOffsetTop <= scrollTop + currentPos.top - offsetBottom) {
          this.setState({
            fixed: false,
          });
        }
        break;
      default:
    }
  };
  setFixedForTarget(param: Object) {
    const { affixRect, targetRect, targetScroll, offsetTop, winHeight, offsetBottom } = param;
    const type = this.getOffsetType();

    switch (type) {
      case OffsetTop:
        if (
          affixRect.top - targetRect.top - targetScroll <= offsetTop ||
          affixRect.bottom >= targetRect.bottom
        ) {
          this.setState({
            fixed: true,
            offset: offsetTop + targetRect.top,
          });
        }
        const affixOffsetTop = this.affix.offsetTop;
        if (
          this.defaultOffsetTop - this.targetDefaultOffsetTop >=
          affixOffsetTop - targetRect.top + targetScroll
        ) {
          this.setState({
            fixed: false,
          });
        }
        break;

      case OffsetBottom:
        if (
          targetRect.bottom - affixRect.bottom - targetScroll <= offsetBottom ||
          affixRect.top <= targetRect.top
        ) {
          this.setState({
            fixed: true,
            offset: winHeight - targetRect.bottom + offsetBottom,
          });
        }
        if (
          this.defaultOffsetTop - this.targetDefaultOffsetTop <=
          targetScroll + this.affix.offsetTop - targetRect.top
        ) {
          this.setState({
            fixed: false,
          });
        }
        break;
      default:
    }
  }
  getOffsetValue() {
    const { offset } = this.state;
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

  componentWillUnmount() {
    window.removeEventListener('scroll', this.addWindowListener);
  }
  render() {
    const { children } = this.props;
    const { fixed } = this.state;
    return (
      <Affix innerRef={node => (this.affix = node)} fixed={fixed} {...this.getOffsetValue()}>
        {children}
      </Affix>
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
