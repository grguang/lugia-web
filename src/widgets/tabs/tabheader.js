/**
 *
 * create by liangguodong on 2018/9/6
 *
 * @flow
 */
import '../common/shirm';
import React, { Component } from 'react';
import Tabpane from './tabpane';
import Widget from '../consts/index';
import { EditEventType, PagedType, TabPositionType, TabType } from '../css/tabs';

import { px2remcss } from '../css/units';
import { computePage, isVertical, matchType } from './utils';
import { getAttributeFromObject } from '../common/ObjectUtils.js';

import Icon from '../icon';
import CSSComponent, { css } from '@lugia/theme-css-hoc';
import { deepMerge } from '@lugia/object-utils';
import colorsFunc from '../css/stateColor';
import { getBorder } from '@lugia/theme-utils';
import { findDOMNode } from 'react-dom';

const { superLightColor, borderColor, borderSize } = colorsFunc();

const ArrowContainer = CSSComponent({
  tag: 'div',
  className: 'BaseLine',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    font-size: 1.2rem;
    z-index: 5;
  `,
});

const HBasePage = CSSComponent({
  extend: ArrowContainer,
  className: 'HBasePage',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    text-align: center;
    width: 24px;
    transform: translateY(50%);
    display: ${props => (props.arrowShow === false ? 'none' : 'block')};
  `,
});

const HPrePage = CSSComponent({
  extend: HBasePage,
  className: 'HPrePage',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    float: left;
  `,
});

const HNextPage = CSSComponent({
  extend: HBasePage,
  className: 'HNextPage',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    float: right;
  `,
});

const VBasePage = CSSComponent({
  extend: ArrowContainer,
  className: 'VBasePage',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    width: 100%;
    text-align: center;
    display: ${props => (props.arrowShow === false ? 'none' : 'block')};
  `,
});

const VPrePage = CSSComponent({
  extend: VBasePage,
  className: 'VPrePage',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
});

const VNextPage = CSSComponent({
  extend: VBasePage,
  className: 'VNextPage',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
});

const HTabsContainer = CSSComponent({
  tag: 'div',
  className: 'HTabsContainer',
  normal: {
    selectNames: [['width']],
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig: { arrowShow, showAddBtn, addSize } = {} } = themeProps;
      if (arrowShow) {
        const W = showAddBtn ? (addSize ? addSize + 8 + 'px' : '80px') : '48px';
        return {
          width: `calc( 100% - ${W} )`,
        };
      }
      if (showAddBtn) {
        const W = addSize ? addSize + 8 + 'px' : '30px';
        return {
          width: `calc( 100% - ${W} )`,
        };
      }
    },
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    float: left;
  `,
});

const AddContainer = CSSComponent({
  tag: 'div',
  className: 'AddButton',
  normal: {
    selectNames: [
      ['width'],
      ['height'],
      ['opacity'],
      ['background'],
      ['border'],
      ['boxShadow'],
      ['color'],
      ['fontSize'],
    ],
    defaultTheme: {
      width: 18,
      height: 18,
      border: getBorder({ color: superLightColor, width: 1, style: 'solid' }),
      background: {
        color: '#f8f8f8',
      },
      lineHeight: 18,
      borderRadius: '4px',
    },
    getCSS: (theme: Object, themeProps: Object) => {
      const { height } = theme;
      return `line-height: ${height}px`;
    },
    getThemeMeta: (theme: Object, themeProps: Object) => {
      const { height } = theme;
      return {
        lineHeight: height,
      };
    },
  },
  hover: {
    selectNames: [
      ['width'],
      ['height'],
      ['opacity'],
      ['background'],
      ['border'],
      ['boxShadow'],
      ['color'],
      ['fontSize'],
    ],
    defaultTheme: {
      background: {
        color: '#999',
      },
    },
    getThemeMeta: (theme: Object, themeProps: Object) => {},
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    position: relative;
    text-align: center;
    cursor: pointer;
    float: right;
    margin: 5px;
    transform: translateY(25%);
  `,
});

AddContainer.displayName = 'addBtn';

const HscrollerContainer = CSSComponent({
  tag: 'div',
  className: 'HscrollerContainer',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    display: inline-block;
    box-sizing: border-box;
    white-space: nowrap;
    transition: all 0.5s;
    min-width: 100%;
    transform: translateX(${props => px2remcss(props.x)});
  `,
});

const VTabsContainer = CSSComponent({
  tag: 'div',
  className: 'VTabsContainer',
  normal: {
    selectNames: [['height'], ['border']],
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig: { arrowShow } = {} } = themeProps;
      if (arrowShow) {
        return {
          height: 'calc( 100% - 48px )',
        };
      }
    },
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    height: 100%;
    box-sizing: border-box;
    white-space: nowrap;
    display: inline-block;
    overflow: hidden;
  `,
});

const YscrollerContainer = CSSComponent({
  tag: 'div',
  className: 'YscrollerContainer',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    display: inline-block;
    box-sizing: border-box;
    white-space: nowrap;
    transition: all 0.5s;
    transform: translateY(${props => px2remcss(props.y)});
  `,
});

const HTabsOutContainer = CSSComponent({
  tag: 'div',
  className: 'TitleContainer',
  normal: {
    selectNames: [['width'], ['background'], ['textAlign']],
    getThemeMeta: (theme: Object, themeProps: Object) => {
      const { background = { color: '#fff' } } = theme;
      const { propsConfig: { tabType } = {} } = themeProps;
      if (tabType === 'window') {
        return {};
      }
      return { background };
    },
    getCSS: (theme: Object, themeProps: Object) => {
      const { textAlign = 'left', border = {} } = theme;

      const { propsConfig: { tabPosition, tabType } = {} } = themeProps;
      if (tabType === 'window') {
        return '';
      }
      const position = tabPosition === 'bottom' ? 'top' : 'bottom';

      const { [position]: { color, width } = {} } = border || {
        [position]: { color: borderColor, width: borderSize },
      };
      const resPosition = `${position} : 0 ;height:${width}px;background-color:${color}`;

      return `text-align: ${textAlign}
              &::before{
               content: '';
                position: absolute;
                ${resPosition};
                left: 0;
                width: 100%;
              }
              
      `;
    },
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    position: relative;
    z-index: 99;
    overflow: hidden;
  `,
});

const VTabsOutContainer = CSSComponent({
  tag: 'div',
  className: 'TitleContainer',
  normal: {
    selectNames: [['height'], ['background']],
    getCSS(themeMeta, themeProps) {
      const { border = {} } = themeMeta;
      const { propsConfig: { tabPosition } = {} } = themeProps;
      const position = tabPosition === 'right' ? 'left' : 'right';
      const { [position]: { color, width } = {} } = border || {
        [position]: { color: borderColor, width: borderSize },
      };
      const resPosition = `${position} : 0 ;width:${width}px;background-color:${color}`;

      return `&::before{
               content: '';
                position: absolute;
                ${resPosition};
                height: 100%;
              }
      `;
    },
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    position: relative;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    flex: 0 0 auto;
    background: #fff;
  `,
});

type TabsState = {
  activityValue: string,
  data: Array<Object>,
  currentPage: number,
  totalPage: number,
  pagedCount: number,
  arrowShow: boolean,
  allowToCalc: boolean,
  titleSize: Array<number>,
  oldDataLength: number,
  maxIndex: number,
};

type TabsProps = {
  activityValue: string,
  tabPosition?: TabPositionType,
  tabType?: TabType,
  data: Array<Object>,
  showAddBtn?: boolean,
  showDeleteBtn?: boolean,
  pagedType?: PagedType,
  onChange?: Function,
  onTabClick?: Function,
  onPreClick?: Function,
  onNextClick?: Function,
  onAddClick?: Function,
  onDelete?: Function,
  themeProps: Object,
  viewClass?: string,
  onMouseEnter?: Function,
  onMouseLeave?: Function,
  getTabpane?: Function,
  getPartOfThemeHocProps: Function,
  getPartOfThemeProps: Function,
};

class TabHeader extends Component<TabsProps, TabsState> {
  static defaultProps = {
    tabType: 'line',
    tabPosition: 'top',
    pagedType: 'single',
    defaultData: [],
  };
  scrollBox: any;
  tabPanBox: any;
  titlePanel: any;
  static displayName = Widget.Tabs;
  offsetWidth: number;
  offsetHeight: number;

  constructor(props: TabsProps) {
    super(props);
    this.scrollBox = React.createRef();
    this.tabPanBox = React.createRef();
    this.titlePanel = [];
  }

  static getDerivedStateFromProps(props: TabsProps, state: TabsState) {
    const { activityValue, data } = props;
    const dataLength = data ? data.length : 0;
    let allowToCalc = false;
    let returnData = {};
    if (state) {
      if (dataLength !== state.oldDataLength) {
        allowToCalc = true;
      }
      returnData = {
        data,
        currentPage: state.currentPage,
        totalPage: state.totalPage,
        pagedCount: state.pagedCount,
        arrowShow: state.arrowShow,
        activityValue,
        oldDataLength: dataLength,
        allowToCalc,
        titleSize: state.titleSize,
        maxIndex: state.maxIndex,
      };
    } else {
      returnData = {
        data,
        currentPage: 0,
        totalPage: 1,
        pagedCount: 0,
        arrowShow: false,
        activityValue,
        oldDataLength: dataLength,
        allowToCalc,
        titleSize: [],
        maxIndex: 0,
      };
    }

    return {
      ...returnData,
    };
  }

  componentDidUpdate(nextProps: Object, nextState: Object) {
    const { allowToCalc } = this.state;
    if (allowToCalc) {
      this.matchPage();
    }
  }

  componentDidMount() {
    if (this.scrollBox.current) {
      this.offsetWidth = this.scrollBox.current.offsetWidth;
      this.offsetHeight = this.scrollBox.current.offsetHeight;
    }
    this.matchPage();
  }

  matchPage() {
    const titleSize = this.getTabpaneWidthOrHeight();

    const { allowToCalc, maxIndex, data, activityValue } = this.state;
    const newMaxIndex = maxIndex ? maxIndex : this.getCurrentMaxIndex(titleSize);
    let { currentPage } = this.state;
    const { tabPosition, pagedType } = this.props;
    currentPage = pagedType === 'page' ? 1 : newMaxIndex;
    let offsetSize;
    if (isVertical(tabPosition)) {
      offsetSize = this.offsetHeight;
    } else {
      offsetSize = this.offsetWidth;
    }
    const actualSize = this.getActualWidthOrHeight();
    const totalPage = pagedType === 'page' ? computePage(offsetSize, actualSize) : titleSize.length;
    const arrowShow = offsetSize < actualSize;
    if (allowToCalc) {
      currentPage =
        pagedType === 'page'
          ? this.getCurrentPageByActivityValue(data, activityValue, totalPage)
          : titleSize.length;
    }
    this.setState(
      { arrowShow, totalPage, currentPage, titleSize, allowToCalc: false, maxIndex: newMaxIndex },
      () => {
        this.handleChangePage();
      }
    );
  }

  getCurrentMaxIndex(titleSize: Array<number>) {
    const { tabPosition } = this.props;
    let maxIndex = 0;
    let distance = 0;
    const offsetSize = isVertical(tabPosition) ? this.offsetHeight : this.offsetWidth;
    const margin = isVertical(tabPosition) ? 0 : 8;
    titleSize.some((item, index) => {
      distance += item + margin;
      if (distance > offsetSize) {
        maxIndex = index;
        return true;
      }
    });
    return maxIndex;
  }

  getCurrentPageByActivityValue(data: Array<Object>, activityValue: string, totalPage: number) {
    let currentIndex = 0;
    data.some((item, index) => {
      if (item.value === activityValue) {
        currentIndex = index + 1;
        return true;
      }
    });
    return Math.max(Math.ceil(currentIndex / Math.ceil(data.length / totalPage)) - 1, 0);
  }

  render() {
    this.titlePanel = [...Array(this.props.data.length)].map(() => React.createRef());
    return <React.Fragment>{this.getTabs()}</React.Fragment>;
  }

  getTabs() {
    const { tabPosition } = this.props;
    if (isVertical(tabPosition)) {
      return this.getVtabs();
    }
    return this.getHorizonTabPan();
  }

  handleBorderStyle(borderThemeProps: Object, tabPosition: TabPositionType, tabType?: TabType) {
    const { themeConfig: { normal: { color, width } = {} } = {} } = borderThemeProps;
    const borderColor = color || superLightColor,
      borderWidth = width || borderSize,
      borderStyle = 'solid';
    let border;
    const style = { width: borderWidth, color: borderColor, style: borderStyle };
    switch (tabPosition) {
      case 'bottom':
        border = { top: style };
        break;
      case 'right':
        border = { left: style };
        break;
      case 'left':
        border = { right: style };
        break;
      default:
        border = { bottom: style };
        break;
    }
    if (tabType === 'window') {
      border = null;
    }

    const borderTheme = deepMerge(
      { ...this.props.themeProps },
      { themeConfig: { normal: { border } } }
    );
    return { ...borderTheme };
  }

  getVtabs() {
    const { tabPosition, themeProps } = this.props;
    const { arrowShow } = this.state;
    const borderThemeProps = this.handleBorderStyle(
      this.props.getPartOfThemeProps('BorderStyle'),
      tabPosition
    );
    const tabsThemeProps = this.props.getPartOfThemeProps('TitleContainer');
    const tabsOutContainerThemeProps = deepMerge(tabsThemeProps, borderThemeProps);
    const moveDistance = this.computeMoveDistance();
    const { isDisabledToPrev, isDisabledToNext } = this.getIsAllowToMove();
    themeProps.propsConfig = { arrowShow };
    tabsOutContainerThemeProps.propsConfig = { tabPosition };

    const prevPageThemeProps = deepMerge(
      { themeConfig: { normal: { height: 24 } } },
      this.props.getPartOfThemeProps('DefaultTabPan')
    );
    return (
      <VTabsOutContainer themeProps={tabsOutContainerThemeProps}>
        {this.getPrevOrNextPage('prev', prevPageThemeProps, isDisabledToPrev, isDisabledToNext)}
        <VTabsContainer themeProps={themeProps} ref={this.scrollBox}>
          <YscrollerContainer y={moveDistance} themeProps={themeProps} ref={this.tabPanBox}>
            {this.getChildren()}
          </YscrollerContainer>
        </VTabsContainer>
        {this.getPrevOrNextPage('next', prevPageThemeProps, isDisabledToPrev, isDisabledToNext)}
      </VTabsOutContainer>
    );
  }

  getPrevOrNextPage(
    type: string,
    themeProps: Object,
    isDisabledToPrev: boolean,
    isDisabledToNext: boolean
  ) {
    const { arrowShow } = this.state;
    if (!arrowShow) {
      return;
    }
    const { tabPosition } = this.props;
    if (type === 'prev') {
      const arrowUp = isVertical(tabPosition)
        ? 'lugia-icon-direction_up'
        : 'lugia-icon-direction_Left';
      const Target = isVertical(tabPosition) ? VPrePage : HPrePage;
      return (
        <Target
          themeProps={themeProps}
          tabPosition={tabPosition}
          onClick={this.onPreClick(isDisabledToPrev)}
          {...this.getArrowConfig('pre')}
        >
          <Icon disabled={isDisabledToPrev} iconClass={arrowUp} />
        </Target>
      );
    }

    const arrowDown = isVertical(tabPosition)
      ? 'lugia-icon-direction_down'
      : 'lugia-icon-direction_right';
    const Target = isVertical(tabPosition) ? VNextPage : HNextPage;
    return (
      <Target
        themeProps={themeProps}
        {...this.getArrowConfig('next')}
        tabPosition={tabPosition}
        onClick={this.onNextClick(isDisabledToNext)}
      >
        <Icon
          disabled={isDisabledToNext}
          themeProps={themeProps}
          iconClass={arrowDown}
          singleTheme
        />
      </Target>
    );
  }

  getArrowConfig(type: EditEventType) {
    const { currentPage, arrowShow, totalPage, pagedCount, titleSize } = this.state;
    const { pagedType } = this.props;
    return {
      type,
      pagedType,
      totalPage,
      currentPage,
      arrowShow,
      pagedCount,
      titleSize,
    };
  }

  handleChangePage = (type: EditEventType) => {
    let { currentPage, totalPage, pagedCount } = this.state;
    currentPage = this.getPagedCount(currentPage, totalPage, type);
    this.setState({ currentPage, pagedCount });
  };

  getPagedCount(currentPage: number, totalPage: number, type: EditEventType) {
    if (matchType(type, 'next')) {
      currentPage++;
    } else if (matchType(type, 'pre')) {
      currentPage--;
    }
    return Math.max(Math.min(currentPage, totalPage), 0);
  }

  getHorizonTabPan() {
    const { tabType, tabPosition, themeProps, showAddBtn } = this.props;
    const { arrowShow } = this.state;

    const tabsThemeProps = this.props.getPartOfThemeProps('TitleContainer', {
      props: { tabType, tabPosition },
    });
    const borderThemeProps = this.handleBorderStyle(
      this.props.getPartOfThemeProps('BorderStyle'),
      tabPosition,
      tabType
    );

    const tabsOutContainerThemeProps = deepMerge(tabsThemeProps, borderThemeProps);
    let addSize = 0;
    if (showAddBtn) {
      const addBtnThemeProps = this.props.getPartOfThemeProps('AddButton');
      const { themeConfig: { normal } = {} } = addBtnThemeProps;
      if (normal) {
        const { width } = normal;
        addSize = width ? width : addSize;
      }
    }
    themeProps.propsConfig = { arrowShow, showAddBtn, addSize };
    const moveDistance = this.computeMoveDistance();

    const { isDisabledToPrev, isDisabledToNext } = this.getIsAllowToMove();

    const prevPageThemeProps = deepMerge(
      { themeConfig: { normal: { height: 31 } } },
      this.props.getPartOfThemeProps('DefaultTabPan')
    );
    return (
      <HTabsOutContainer
        themeProps={tabsOutContainerThemeProps}
        tabType={tabType}
        tabPosition={tabPosition}
      >
        {this.getPrevOrNextPage('prev', prevPageThemeProps, isDisabledToPrev, isDisabledToNext)}
        <HTabsContainer themeProps={themeProps} ref={this.scrollBox}>
          <HscrollerContainer themeProps={themeProps} x={moveDistance} ref={this.tabPanBox}>
            {this.getChildren()}
          </HscrollerContainer>
        </HTabsContainer>
        {this.getAddButton()}
        {this.getPrevOrNextPage('next', prevPageThemeProps, isDisabledToPrev, isDisabledToNext)}
      </HTabsOutContainer>
    );
  }

  getChildren(): React$Node {
    const { data } = this.state;
    const { getTabpane } = this.props;
    return data
      ? data.map((child: Object, index: number) => {
          const Target = (
            <Tabpane
              ref={node => (this.titlePanel[index] = node)}
              {...this.props}
              {...this.getTabpaneConfig(child, index)}
            />
          );
          return getTabpane ? getTabpane(Target, index) : Target;
        })
      : '';
  }

  getAddButton() {
    const { tabType, showAddBtn } = this.props;
    const add = 'lugia-icon-reminder_plus';
    if (!matchType(tabType, 'line') && showAddBtn) {
      const addBtnthemeProps = this.props.getPartOfThemeProps('AddButton');
      return (
        <AddContainer themeProps={addBtnthemeProps} onClick={this.onAddClick}>
          <Icon iconClass={add} />
        </AddContainer>
      );
    }
    return null;
  }

  onAddClick = (e: Event) => {
    const { onAddClick } = this.props;
    onAddClick && onAddClick(e);
  };

  getTabpaneConfig(child: React$Element<any>, i: number) {
    const { tabPosition, tabType } = this.props;
    let { showDeleteBtn } = this.props;
    const { activityValue } = this.state;
    const hideCloseBtn = getAttributeFromObject(
      child,
      'hideCloseBtn',
      getAttributeFromObject(child.props, 'hideCloseBtn', false)
    );
    showDeleteBtn =
      !hideCloseBtn &&
      (showDeleteBtn ||
        getAttributeFromObject(
          child,
          'showDeleteBtn',
          getAttributeFromObject(child.props, 'showDeleteBtn', false)
        ));
    const disabled = getAttributeFromObject(
      child,
      'disabled',
      getAttributeFromObject(child.props, 'disabled', false)
    );
    const value = getAttributeFromObject(
      child,
      'value',
      getAttributeFromObject(child.props, 'value', false)
    );
    const tabHeaderTheme = this.props.getPartOfThemeHocProps('TabHeader');
    return {
      tabPosition,
      tabType,
      title: getAttributeFromObject(
        child,
        'title',
        getAttributeFromObject(child.props, 'title', '')
      ),
      icon: getAttributeFromObject(child, 'icon', getAttributeFromObject(child.props, 'icon', '')),
      suffixIcon: getAttributeFromObject(
        child,
        'suffixIcon',
        getAttributeFromObject(child.props, 'suffixIcon', '')
      ),
      onClick: this.onTabClick,
      activityValue,
      keyVal: value,
      index: i,
      showDeleteBtn,
      isSelect: !disabled && activityValue === value,
      onDelete: this.onDeleteClick,
      disabled,
      ...tabHeaderTheme,
    };
  }

  getTabpaneWidthOrHeight = () => {
    const { tabPosition } = this.props;
    return this.titlePanel.map(item => {
      let offsetSize = 0;
      if (item) {
        const tabPan = findDOMNode(item.getThemeTarget());
        if (!tabPan) {
          return offsetSize;
        }
        if (isVertical(tabPosition)) {
          offsetSize = tabPan.offsetHeight;
        } else {
          offsetSize = tabPan.offsetWidth;
        }
      }
      return offsetSize;
    });
  };

  computeMoveDistance() {
    const { currentPage, titleSize } = this.state;
    const { pagedType, tabPosition } = this.props;
    const actualSize = this.getActualWidthOrHeight();
    const offsetSize = isVertical(tabPosition) ? this.offsetHeight : this.offsetWidth;
    if (actualSize <= offsetSize) {
      return 0;
    }

    let distance = 0;
    switch (pagedType) {
      case 'single':
        const maxIndex = this.getCurrentMaxIndex(titleSize);
        const length = currentPage - maxIndex;
        for (let i = 1; i <= length; i++) {
          distance += titleSize[Math.min(maxIndex + i, titleSize.length - 1)] + 8;
        }
        break;
      case 'page':
        distance = offsetSize * (currentPage - 1);
        break;
      default:
        break;
    }
    return -distance;
  }

  getIsAllowToMove() {
    const { currentPage, maxIndex, totalPage } = this.state;
    const { pagedType } = this.props;
    const isDisabledToNext = currentPage >= totalPage;
    const isDisabledToPrev = pagedType === 'page' ? currentPage <= 1 : currentPage <= maxIndex;
    return { isDisabledToPrev, isDisabledToNext };
  }

  getActualWidthOrHeight() {
    const { tabPosition } = this.props;
    let actualSize = 0;
    if (this.tabPanBox.current) {
      const { offsetHeight, offsetWidth } = this.tabPanBox.current;
      actualSize = isVertical(tabPosition) ? offsetHeight : offsetWidth;
    }

    return actualSize;
  }

  onTabClick = (res: Object) => {
    const { index } = res;
    if (!this.getTabpaneDisabled(index)) {
      const { onTabClick } = this.props;
      const { activityValue } = this.state;
      onTabClick && onTabClick(res);
      const { activityValue: newActivityValue } = res;
      if (activityValue === newActivityValue) {
        return;
      }
      const { onChange } = this.props;

      onChange && onChange(res);
    }
  };

  onDeleteClick = (res: Object) => {
    const { index } = res;
    if (!this.getTabpaneDisabled(index)) {
      const { onDelete } = this.props;
      onDelete && onDelete(res);
    }
  };

  getTabpaneDisabled(index: number) {
    const { data } = this.state;
    if (index) {
      return data[index] && data[index].disabled;
    }
    return false;
  }

  createNativeClick = (eventName: 'onNextClick' | 'onPreClick', type: EditEventType) => (
    e: Event
  ) => {
    const { [eventName]: click } = this.props;
    this.handleChangePage(type);
    click && click(e);
  };

  onNextClick = (isAllowToNext: boolean) => {
    if (isAllowToNext) {
      return;
    }
    return this.createNativeClick('onNextClick', 'next');
  };
  onPreClick = (isAllowToPrev: boolean) => {
    if (isAllowToPrev) {
      return;
    }
    return this.createNativeClick('onPreClick', 'pre');
  };
}

export default TabHeader;
