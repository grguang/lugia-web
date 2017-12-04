/*
 *
 * 滚动条
 * @flow
 * create by ligx 170911
 */
import * as React from 'react';
import styled from 'styled-components';
import Support from '../common/FormFieldWidgetSupport';
import { cacheOnlyFirstCall, getElementPosition, } from '../utils';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

type ScrollerProps = {
  totalSize: number,
  viewSize: number,
  type?: 'x' | 'y',
  onChange?: Function,
  value?: number,
  throttle?: number,
  defaultValue?: number,
  step?: number,
};
type ScrollerState = {
  value: number,
  sliderSize: number,
};
type Direction = 'down' | 'up' | 'none';

const Container = styled.div`
  position: relative;
  background: #e3e3e6;
  width: 20px;
  height: 300px;
  border-radius: 5px;
  z-index: 996;
`;

const BarDefaultSize = 12;
const XContainer = Container.extend`
  height: ${BarDefaultSize}px;
`;
const YContainer = Container.extend`
  width: ${BarDefaultSize}px;
`;

const Bar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  text-align: center;
  border-radius: 8px;
  background: ${props => (props.disabled ? '#898989' : '#49a9ee')};
  color: #FFF;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  :hover {
    background-color: #49a9ee96;
  }
`;

const BarDefaultSizePadding = 4;
const XBar = Bar.extend`
  height: ${BarDefaultSize - BarDefaultSizePadding}px;
  margin-bottom: 2px;
  margin-top: 2px;
`;
const YBar = Bar.extend`
  width: ${BarDefaultSize - BarDefaultSizePadding}px;
  margin-left: 2px;
  margin-right: 2px;
`;

const XScroller = 'x', YScroller = 'y';
const Down = 'down';
const Up = 'up';
const None = 'none';
const DefaultStep = 1;

class Scroller extends React.Component<ScrollerProps, ScrollerState> {

  static defaultProps = {
    type: YScroller,
    throttle: 100,
    step: DefaultStep,
  };

  bodyMouseUpHandle: Object;
  bodyMouseMoveHandle: Object;
  fastStep: number;
  htmlScroller: HTMLElement;
  isDrag: boolean;
  lastFx: string;
  lastTime: number;
  maxValue: number;
  posGetter: Object;
  state: ScrollerState;
  throttleTimer: ?number;
  sliderAbsoulateSize: number;
  step: number;
  move: number;

  constructor (props: ScrollerProps) {
    super(props);
    const { defaultValue = 0, } = props;

    this.state = {
      value: Support.getInitNumberValue(props),
      sliderSize: this.getSliderBarSize(props),
    };
    this.updateStepInfo(props);
  }


  componentWillReceiveProps (props: ScrollerProps) {
    this.setState({
      value: Support.getNumberValue(props, this.state),
      sliderSize: this.getSliderBarSize(props),
    });
  }


  getSliderBarSize (props: ScrollerProps) {
    const { viewSize, totalSize, } = props;
    const notNeed = totalSize <= viewSize;
    if (notNeed) {
      return 0;
    }
    const barSize = viewSize * viewSize / totalSize;
    return Math.round(Math.max(barSize, 10));
  }


  render () {

    let barStyle = {};
    let style: Object = {};
    let Target, TargetContainer;

    const { viewSize, } = this.props;
    const { sliderSize, } = this.state;

    const barPx = this.getPX(sliderSize);
    const posPx = this.getPX(this.getCurrentPos());
    const viewPx = this.getPX(viewSize);

    this.selectType(() => {
      barStyle = {
        width: barPx,
        left: posPx,
      };
      style = { width: viewPx, };
      style.width = viewPx;
      Target = XBar;
      TargetContainer = XContainer;

    }, () => {
      barStyle = {
        height: barPx,
        top: posPx,
      };
      style = { height: viewPx, };
      Target = YBar;
      TargetContainer = YContainer;
    });

    if (!Target || !TargetContainer) {
      return '';
    }


    const getScroller = cmp => this.htmlScroller = cmp;
    return <TargetContainer style={style}
                            innerRef={getScroller}
                            onMouseMove={this.onContainerMouseMove}
                            onMouseDown={this.onContainerMouseDown}
                            onMouseUp={this.onContainerMouseUp}
                            onWheel={this.onWheel}
                            onMouseOut={this.onContainerMouseOut}>
      <Target style={barStyle}
              onMouseDown={this.onSliderBarMouseDown}
              onMouseUp={this.onSliderBarMouseUp}/>
    </TargetContainer>;
  }

  getCurrentPos (): number {
    return this.value2pos(this.state.value);
  }

  getPX (val: number): string {
    return `${val}px`;
  }

  componentDidMount () {
    if (document.body) {
      if (this.bodyMouseMoveHandle === undefined) {
        this.bodyMouseMoveHandle = this.bindDoc('mousemove', (e: Object) => {
          if (this.isDrag) {
            this.processDomEvent(this.getRealSliderPos(e));
          }
        });
      }
      if (this.bodyMouseUpHandle === undefined) {
        this.bodyMouseUpHandle = this.bindDoc('mouseup', () => {
          this.isDrag = false;
        });
      }
    }
  }

  bindDoc (event: string, callback: Function): Object {
    return addEventListener(document, event, callback);
  }


  onSliderBarMouseDown = (e: Object) => {
    e.preventDefault();
    e.stopPropagation();
    this.sliderAbsoulateSize = this.getPos(e) - this.getCurrentPos();
    this.isDrag = true;
  };


  getDirection (fx: number): Direction {
    if (fx === 0) {
      return None;
    }
    return fx < 0 ? Down : Up;
  }

  onContainerMouseDown = (e: Object) => {
    this.clearMove();

    if (this.isDrag) {
      return;
    }

    const { step = DefaultStep, } = this.props;
    this.step = step;
    const mousePos = this.getPos(e);
    const fx = mousePos > this.value2pos(this.state.value) ? Down : Up;
    const targetValue = this.pos2value(mousePos);

    this.move = setInterval(() => {
      const maxValue = fx === Down ? targetValue : this.maxValue;
      this.fastMove(fx, 2, maxValue);
      const { value, } = this.state;
      if (value === targetValue) {
        this.clearMove();
      }
    }, 200);
  };

  onContainerMouseUp = (e: Object) => {
    if (this.isDrag === true) {
      return;
    }
    this.processDomEvent(this.getPos(e));
    this.clearMove();
    this.isDrag = false;
  };

  getPos (e: Object) {
    const arg = this.posGetter.func(this.htmlScroller);
    let pos = 0;

    this.selectType(() => {
      const { clientX, } = e;
      const { x, } = arg;
      pos = clientX - x;
    }, () => {
      const { clientY, } = e;
      const { y, } = arg;
      pos = clientY - y;
    });
    return Math.min(this.props.viewSize, pos);
  }

  onSliderBarMouseUp = (e: Object) => {
    e.preventDefault();
    e.stopPropagation();
    this.isDrag = false;
  };

  onContainerMouseOut = () => {
    this.clearMove();
  };

  clearMove () {
    if (this.move) {
      clearInterval(this.move);
    }
  }

  onContainerMouseMove = (e: Object) => {
    if (this.isDrag) {
      this.processDomEvent(this.getRealSliderPos(e));
    }
  };

  getRealSliderPos (e: Object): number {
    return this.getPos(e) - this.sliderAbsoulateSize;
  }

  processDomEvent (pos: number) {
    this.setValue(this.pos2value(pos));
  }


  componentWillUnmount () {
    this.bodyMouseMoveHandle && this.bodyMouseMoveHandle.remove();
    this.bodyMouseUpHandle && this.bodyMouseUpHandle.remove();
  }


  onWheel = (event: Object) => {
    const { deltaY, } = event;
    this.fastMove(this.getDirection(deltaY), 0.03, this.maxValue);
  };


  fastMove = (fx: Direction, percent: number, maxValue: number) => {
    if (fx === None) {
      return;
    }
    const now = new Date();
    const timeSpan = now - this.lastTime;
    const { step = DefaultStep, } = this.props;
    if (this.lastTime && timeSpan < 500) {
      this.step = this.step * (1 + percent);
    } else {
      this.step = step;
    }
    this.step = Math.min(this.fastStep, this.step);
    const realStep = this.getMoveStep(fx, this.step);
    let newValue = this.state.value + realStep;
    newValue = Math.min(newValue, maxValue);
    newValue = Math.max(newValue, 0);

    if (this.lastFx !== undefined && this.lastFx !== fx) {
      const timeSpan = new Date() - this.lastTime;
      if (timeSpan < 200) {
        this.lastFx = fx;
        return;
      }
    }

    this.setValue(newValue);
    this.lastFx = fx;
    this.lastTime = now;
  };

  getMoveStep (fx: Direction, step: number): number {
    if (fx === None) {
      return step;
    }
    return fx === Down ? step : -step;
  }

  setValue (theValue: number) {
    if (theValue === this.state.value) {
      return;
    }
    const min = Math.max(0, theValue);
    const max = this.maxValue;
    const value = Math.min(min, max);

    this.setState({ value, }, () => {
      this.scrolling(value);
    });
  }

  scrolling (value: number) {
    if (this.throttleTimer !== undefined) {
      clearTimeout(this.throttleTimer);
    }
    const { props, } = this;
    const { throttle, } = props;
    this.throttleTimer = setTimeout(() => {
      this.onChange(value);
    }, throttle);
  }

  onChange = (value: number) => {
    const { onChange, } = this.props;
    onChange && onChange(value);
  };


  selectType (x: Function, y: Function) {
    const { type, } = this.props;
    switch (type) {
      case XScroller:
        x();
        break;
      case YScroller:
        y();
        break;
      default:
    }
  }


  shouldComponentUpdate (nextProps: ScrollerProps, nextState: ScrollerState) {
    const sizeChange = this.props.viewSize !== nextProps.viewSize
      || this.props.totalSize !== nextProps.totalSize;
    if (sizeChange) {
      this.updateStepInfo(nextProps);
    }
    return sizeChange
      || this.state.value !== nextState.value;
  }

  updateStepInfo (props: ScrollerProps): void {

    const { totalSize, step = DefaultStep, } = props;
    this.posGetter = cacheOnlyFirstCall(getElementPosition);
    this.step = step;
    this.maxValue = this.getMaxValue(props);
    this.fastStep = totalSize / 4;
    this.sliderAbsoulateSize = 0;
  }

  value2pos (value: number) {
    const { viewSize, totalSize, } = this.props;
    const maxPos = this.getMaxPos();
    return Math.min(value * (maxPos) / (totalSize - viewSize), maxPos);
  }


  pos2value (pos: number) {
    const { viewSize, totalSize, } = this.props;
    const maxPos = this.getMaxPos();
    return Math.min(pos * (totalSize - viewSize) / (maxPos), this.getMaxValue(this.props));
  }


  getMaxValue (props: ScrollerProps): number {
    const { totalSize, viewSize, } = props;
    return totalSize - viewSize;
  }

  getMaxPos () {
    const { viewSize, } = this.props;
    const { sliderSize, } = this.state;
    return viewSize - sliderSize;
  }
}

export default Scroller;
