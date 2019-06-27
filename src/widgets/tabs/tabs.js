/**
 *
 * create by liangguodong on 2018/9/6
 *
 * @flow
 */
import '../common/shirm';
import React, { Component } from 'react';
import styled from 'styled-components';
import Tabpane from './tabpane';
import TabContentInner from './tabcontent';
import Widget from '../consts/index';
import Theme from '../theme';
import { EditEventType, PagedType, TabPositionType, TabType } from '../css/tabs';
import {
  AddButtonSize,
  ArrowContainerWidth,
  backgroundColor,
  CardBorderAndMarginWidth,
  CardMarginRight,
  getAddBackground,
  getAddButtonBottom,
  getAddButtonDisplay,
  getAddHoverBackground,
  getAddRadius,
  getAddRight,
  getAddTop,
  getArrowTop,
  getBackgroundShadow,
  getButtonShow,
  getContainerBorder,
  getCursor,
  getLinePosition,
  getSelectColor,
  getTabpaneBorder,
  hContainerHeight,
  hContainerWidth,
  LineMarginLeft,
  lineWidth,
  vContainerHeight,
  WindowMarginLeft,
  YtabsHeight,
  getContainerPadding,
} from '../css/tabs';

import KeyBoardEventAdaptor from '../common/KeyBoardEventAdaptor';
import ThemeProvider from '../theme-provider';
import { px2remcss } from '../css/units';
import {
  addActivityValue2Data,
  addWidth2Data,
  computePage,
  isVertical,
  matchType,
  plusWidth,
} from './utils';
import { getAttributeFromObject } from '../common/ObjectUtils.js';

import Icon from '../icon';
import { getIndexfromKey, getKeyfromIndex } from '../common/ObjectUtils';
import CSSComponent, { css } from '@lugia/theme-css-hoc';
import { addMouseEvent } from '@lugia/theme-hoc';
import ThemeHoc from '@lugia/theme-hoc';
import { deepMerge } from '@lugia/object-utils';
import colorsFunc from '../css/stateColor';
const { superLightColor } = colorsFunc();
const ShadowLine = CSSComponent({
  tag: 'div',
  className: 'BaseLine',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    width: 100%;
    position: absolute;
    bottom: ${px2remcss(-1)};
    height: ${px2remcss(1)};
    z-index: -1;
  `,
}); //${getBackgroundShadow};
const TabContentContainer = CSSComponent({
  tag: 'div',
  className: 'ContentBlock',
  normal: {
    selectNames: [['height'], ['width']],
    getCSS: (theme: Object, themeProps: Object) => {
      const {
        propsConfig: { tabPosition },
      } = themeProps;
      if (isVertical(tabPosition)) {
        return 'float: left;';
      }
    },
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    position: relative;
    padding: 10px;
    height: 100px;
  `,
}); //${getBackgroundShadow};
const TabContent = CSSComponent({
  tag: 'div',
  className: 'TabContent',
  normal: {
    selectNames: [],
    getCSS: (theme: Object, themeProps: Object) => {
      const {
        propsConfig: { active, index },
      } = themeProps;
      if (active === index) {
        return 'opacity: 1;';
      }
    },
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    overflow: hidden;
    background: #fff;
    padding: 10px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  `,
}); //${getBackgroundShadow};

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
}); //${getCursor};;

const HBasePage = CSSComponent({
  extend: ArrowContainer,
  className: 'HBasePage',
  normal: {
    selectNames: [],
    getCSS: (themeMeta: Object, themeProps: Object) => {
      const { height } = themeMeta;
      return `line-height: ${height ? height + 'px' : '35px'}`;
    },
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    text-align: center;
    width: 24px;
    line-height: 35px;
    display: ${props => (props.arrowShow === false ? 'none' : 'block')};
  `,
}); //${getArrowTop};

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
    height: ${px2remcss(24)};
    line-height: ${px2remcss(24)};
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
  css: css``,
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
  css: css``,
});

const WindowContainer = CSSComponent({
  tag: 'div',
  className: 'WindowContainer',
  normal: {
    selectNames: [['background'], ['padding'], ['border']],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    display: inline-block;
  `,
});

const OutContainer = CSSComponent({
  tag: 'div',
  className: 'OutContainer',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    display: inline-block;
  `,
}); //width: ${hContainerWidth};height: ${vContainerHeight};
OutContainer.displayName = Widget.TabsContainer;

const HTabsContainer = CSSComponent({
  tag: 'div',
  className: 'TabsContainer',
  normal: {
    selectNames: [],
    getCSS: (themeMeta: Object, themePros: Object) => {
      const { width } = themeMeta;
      return `width:${width + 'px' || '100%'};`;
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
  className: 'AddContainer',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    position: relative;
    width: ${px2remcss(AddButtonSize)};
    height: ${px2remcss(AddButtonSize)};
    border: 1px solid ${superLightColor};
    border-radius: 4px;
    background: #f8f8f8;
    line-height: ${px2remcss(AddButtonSize)};
  `,
}); /* ${getAddBackground};${getTabpaneBorder};${getAddRadius};${getAddTop};&:focus {${getAddHoverBackground};}*/

const AddOutContainer = CSSComponent({
  tag: 'div',
  className: 'AddContainer',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    position: relative;
    text-align: center;
    display: inline-block;
  `,
}); // ${getAddTop};${getAddRight};  height: ${hContainerHeight};line-height: ${hContainerHeight};

const AddIcon = CSSComponent({
  extend: Icon,
  className: 'AddIcon',
  normal: {
    selectNames: [],
  },
  hover: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    position: relative;
    transition: all 0.3s linear 0.1s;
    font-size: 1rem;
    vertical-align: text-top !important;
  `,
}); //${getAddButtonBottom};${getAddButtonDisplay};&:hover { ${getButtonShow};}

AddIcon.displayName = 'addIcon';

const HscrollerContainer = CSSComponent({
  tag: 'div',
  className: 'HscrollerContainer',
  normal: {
    selectNames: [],
    getCSS: (theme: Object, themeProps: Object) => {
      const {
        propsConfig: { tabPosition, tabType },
      } = themeProps;
      const { color = '#e8e8e8', width = 1 } = theme;
      let border = `border-bottom: ${width}px solid ${color};`;
      if (tabPosition === 'bottom') {
        border = `border-top: ${width}px solid ${color};`;
      }
      if (tabType === 'window') {
        border = `border-bottom: ${0}px solid transparent;`;
      }
      return border;
    },
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    display: inline-block;
    box-sizing: border-box;
    white-space: nowrap;
    transition: all 0.5s;
    transform: translateX(${props => px2remcss(props.x)});
  `,
}); //height: ${hContainerHeight};

const VTabsContainer = CSSComponent({
  tag: 'div',
  className: 'VTabsContainer',
  normal: {
    selectNames: [],
    getCSS: (themeMeta: Object, themePros: Object) => {
      const { height } = themeMeta;
      return `height:${height + 'px' || '100%'};`;
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
    getCSS: (theme: Object, themeProps: Object) => {
      const {
        propsConfig: { tabPosition },
      } = themeProps;
      const { color = '#e8e8e8', width = 1 } = theme;
      let border = `border-left: ${width}px solid ${color};`;
      if (tabPosition === 'left') {
        border = `border-right: ${width}px solid ${color};`;
      }
      return border;
    },
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
  className: 'HTabsOutContainer',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    position: relative;
    z-index: 99;
    overflow: hidden;
  `,
}); //height: ${hContainerHeight};line-height: ${hContainerHeight};position: relative;${getContainerBorder};background: ${backgroundColor};${getContainerPadding};

const VTabsOutContainer = CSSComponent({
  tag: 'div',
  className: 'VTabsOutContainer',
  normal: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    float: left;
  `,
}); //${getSelectColor};${getContainerBorder}; ${getContainerPadding};

const PageIcon = ThemeHoc(
  CSSComponent({
    extend: Icon,
    className: 'PageIcon',
    normal: {
      selectNames: [],
    },
    hover: {
      selectNames: [],
    },
    disabled: {
      selectNames: [],
      getCSS: () => {
        return 'cursor: not-allowed';
      },
    },
    css: css`
      display: inline-block;
      font-style: normal;
      text-align: center;
      font-size: 1rem;
    `,
  }),
  'PageIcon',
  { hover: true, active: false }
);
// ${getCursor};

PageIcon.displayName = 'page';

type TabsState = {|
  activityValue: number,
  data: Array<Object>,
  currentPage: number,
  totalPage: number,
  pagedCount: number,
  arrowShow: boolean,
  childrenSize: Array<number>,
|};

type TabsProps = {
  activityValue: number,
  defaultActivityValue: string,
  onTabClick: Function,
  tabPosition?: TabPositionType,
  tabType?: TabType,
  onChange: Function,
  onNextClick?: Function,
  onPreClick?: Function,
  children?: React$Element<any>,
  data?: Array<Object>,
  defaultData?: Array<Object>,
  forceRender?: boolean,
  onDeleteClick: Function,
  showAddBtn?: boolean,
  onAddClick?: Function,
  pagedType?: PagedType,
  getTabpane?: Function,
  themeProps: Object,
  onTabMouseEnter?: Function,
  onTabMouseLeave?: Function,
};
function hasDataInProps(props: TabsProps) {
  return 'data' in props;
}

class TabsBox extends Component<TabsProps, TabsState> {
  static defaultProps = {
    tabType: 'line',
    tabPosition: 'top',
    pagedType: 'single',
    defaultData: [],
  };
  tabs: any;
  static displayName = Widget.Tabs;
  offsetWidth: number;
  offsetHeight: number;

  constructor(props: TabsProps) {
    super(props);
    this.tabs = React.createRef();
    this.initContainerSize();
  }

  static getDerivedStateFromProps(props: TabsProps, state: TabsState) {
    const { activityValue, defaultActivityValue, defaultData, data, children } = props;
    const hasActivityValueInprops = 'activityValue' in props;
    let configData = [];
    if (hasDataInProps(props)) {
      configData = data ? data : [];
    } else {
      if (Array.isArray(children) && children.length > 0) {
        configData = [];
        React.Children.map(children, child => {
          configData && configData.push(child.props);
        });
      } else {
        configData = defaultData ? defaultData : [];
      }
    }
    if (!state) {
      const theData = configData || [];
      const theActivityValue = hasActivityValueInprops
        ? activityValue
        : defaultActivityValue
        ? defaultActivityValue
        : theData.length > 0
        ? theData[0].activityValue
        : undefined;
      return {
        data: theData,
        activityValue: theActivityValue * 1,
        currentPage: 0,
        totalPage: 1,
        pagedCount: 0,
        arrowShow: false,
        childrenSize: [],
      };
    }
    const sData = state.data;
    const sActivityValue = state.activityValue;
    return {
      activityValue: hasActivityValueInprops ? activityValue : sActivityValue,
      data: hasDataInProps(props) ? addActivityValue2Data(configData) : sData,
    };
  }

  render() {
    const { themeProps, tabType } = this.props;
    const outContainerThemeProps = this.props.getPartOfThemeProps('WindowContainer');
    let target = (
      <OutContainer themeProps={themeProps}>
        {this.getTabs()}
        {this.getChildrenContent()}
      </OutContainer>
    );
    if (tabType === 'window') {
      target = (
        <WindowContainer themeProps={outContainerThemeProps}>
          <OutContainer themeProps={themeProps}>
            {this.getTabs()}
            {this.getChildrenContent()}
          </OutContainer>
        </WindowContainer>
      );
    }
    return target;
  }

  getTabs() {
    const { tabPosition } = this.props;
    if (isVertical(tabPosition)) {
      return this.getVtabs();
    }
    return this.getHTabs();
  }

  getArrowConfig(type: EditEventType) {
    const { currentPage, arrowShow, totalPage, pagedCount, childrenSize } = this.state;
    const { pagedType } = this.props;
    return {
      type,
      pagedType,
      totalPage,
      currentPage,
      arrowShow,
      pagedCount,
      childrenSize,
    };
  }

  getVtabs() {
    const { tabPosition, themeProps } = this.props;
    const { data, activityValue, pagedCount, totalPage, arrowShow } = this.state;
    const arrowUp = 'lugia-icon-direction_up';
    const arrowDown = 'lugia-icon-direction_down';
    const y = -YtabsHeight * pagedCount;
    const borderThemeProps = this.props.getPartOfThemeProps('BorderStyle');
    borderThemeProps.propsConfig = { tabPosition };
    const tabsThemeProps = this.props.getPartOfThemeProps('TabsContainer');
    tabsThemeProps.propsConfig = { tabPosition };
    const moveDistance = this.computeMoveDistance();
    const { isDisabledToPrev, isDisabledToNext } = this.getIsAllowToMove(moveDistance);

    return (
      <VTabsOutContainer
        themeProps={themeProps}
        tabPosition={tabPosition}
        showPadding={totalPage > 1}
      >
        <VPrePage
          themeProps={themeProps}
          tabPosition={tabPosition}
          onClick={this.onPreClick(isDisabledToPrev)}
          {...this.getArrowConfig('pre')}
        >
          <PageIcon disabled={isDisabledToPrev} themeProps={themeProps} iconClass={arrowUp} />
        </VPrePage>
        <VTabsContainer themeProps={tabsThemeProps} innerRef={this.tabs}>
          <YscrollerContainer y={moveDistance} themeProps={borderThemeProps}>
            {this.getChildren()}
          </YscrollerContainer>
        </VTabsContainer>
        <VNextPage
          themeProps={themeProps}
          {...this.getArrowConfig('next')}
          tabPosition={tabPosition}
          onClick={this.onNextClick(isDisabledToNext)}
        >
          <PageIcon
            disabled={isDisabledToNext}
            themeProps={themeProps}
            iconClass={arrowDown}
            {...this.getArrowConfig('next')}
          />
        </VNextPage>
      </VTabsOutContainer>
    );
  }

  getHTabs() {
    const { tabType, tabPosition, themeProps } = this.props;
    const { totalPage } = this.state;
    return [
      <HTabsOutContainer
        themeProps={themeProps}
        tabType={tabType}
        tabPosition={tabPosition}
        showPadding={totalPage > 1}
      >
        {this.getHtabsChildren()}
        {this.getShadowLine()}
      </HTabsOutContainer>,
    ];
  }

  getShadowLine() {
    const { tabType, themeProps } = this.props;
    if (matchType(tabType, 'window')) {
      return <ShadowLine themeProps={themeProps} tabType={tabType} />;
    }
    return null;
  }

  getHtabsChildren() {
    const { tabType, tabPosition, themeProps } = this.props;
    const arrowLeft = 'lugia-icon-direction_Left';
    const arrowRight = 'lugia-icon-direction_right';
    const pre = this.getArrowConfig('pre');
    const next = this.getArrowConfig('next');
    const borderThemeProps = this.props.getPartOfThemeProps('BorderStyle');
    borderThemeProps.propsConfig = { tabPosition, tabType };
    const tabsThemeProps = this.props.getPartOfThemeProps('TabsContainer');
    tabsThemeProps.propsConfig = { tabPosition };
    const moveDistance = this.computeMoveDistance();
    const { isDisabledToPrev, isDisabledToNext } = this.getIsAllowToMove(moveDistance);

    const prevPageThemeProps = deepMerge(
      { themeProps: { normal: { height: 35 } } },
      this.props.getPartOfThemeProps('DefaultTabPan')
    );
    return [
      <HPrePage
        themeProps={prevPageThemeProps}
        onClick={this.onPreClick(isDisabledToPrev)}
        tabType={tabType}
        {...pre}
      >
        <PageIcon
          disabled={isDisabledToPrev}
          themeProps={themeProps}
          iconClass={arrowLeft}
          {...pre}
        />
      </HPrePage>,
      <HTabsContainer themeProps={tabsThemeProps} tabType={tabType} innerRef={this.tabs}>
        <HscrollerContainer themeProps={borderThemeProps} tabType={tabType} x={moveDistance}>
          {this.getChildren()}
          {this.getAddButton()}
        </HscrollerContainer>
      </HTabsContainer>,
      <HNextPage
        themeProps={prevPageThemeProps}
        {...next}
        onClick={this.onNextClick(isDisabledToNext)}
        tabType={tabType}
      >
        <PageIcon
          disabled={isDisabledToNext}
          themeProps={themeProps}
          iconClass={arrowRight}
          {...next}
        />
      </HNextPage>,
    ];
  }

  getIsAllowToMove(moveDistance: number) {
    const { tabType, tabPosition } = this.props;
    const { childrenSize } = this.state;
    let actualWidth;
    let offsetSize;
    if (isVertical(tabPosition)) {
      actualWidth = this.getActualWidth('line', childrenSize);
      offsetSize = this.offsetHeight;
    } else {
      actualWidth = this.getActualWidth(tabType, childrenSize);
      offsetSize = this.offsetWidth;
    }
    const isDisabledToNext = offsetSize - moveDistance >= actualWidth;
    const isDisabledToPrev = moveDistance === 0;

    return { isDisabledToPrev, isDisabledToNext };
  }

  getAddButton() {
    const { tabType, themeProps, showAddBtn } = this.props;
    const add = 'lugia-icon-reminder_plus';
    if (!matchType(tabType, 'line') && showAddBtn) {
      return (
        <AddOutContainer themeProps={themeProps} tabType={tabType}>
          <AddContainer themeProps={themeProps} tabType={tabType} onClick={this.onAddClick}>
            <AddIcon themeProps={themeProps} tabType={tabType} iconClass={add} />
          </AddContainer>
        </AddOutContainer>
      );
    }
    return null;
  }
  componentDidMount() {
    this.measurePage();
  }

  measurePage() {
    this.updateContainerSize();
    this.matchPage();
  }

  getActualWidth(tabType, childrenSize) {
    const width = plusWidth(childrenSize.length - 1, childrenSize);
    return matchType(tabType, 'window')
      ? width + WindowMarginLeft + AddButtonSize
      : matchType(tabType, 'card')
      ? width + (childrenSize.length + 1) * CardMarginRight + AddButtonSize
      : width;
  }

  matchPage() {
    const { currentPage, childrenSize, data } = this.state;
    const { tabPosition, tabType } = this.props;

    let totalPage;
    if (isVertical(tabPosition)) {
      const actualHeight = this.getActualWidth('line', childrenSize);
      totalPage = computePage(this.offsetHeight, actualHeight);
    } else {
      const actualWidth = this.getActualWidth(tabType, childrenSize);
      totalPage = computePage(this.offsetWidth, actualWidth);
    }
    const arrowShow = totalPage > 1 && currentPage < totalPage;
    this.setState({ arrowShow, totalPage });
  }

  computeMoveDistance() {
    const { currentPage, totalPage, pagedCount, childrenSize } = this.state;
    const { tabType, tabPosition } = this.props;
    const currentTabsWidth = plusWidth(pagedCount - 1, childrenSize);
    const maxDistance = isVertical(tabPosition) ? this.offsetHeight : this.offsetWidth;
    let distance = totalPage > 1 ? currentPage * maxDistance : 0;
    if (pagedCount > 0) {
      if (matchType(tabType, 'card')) {
        distance = currentTabsWidth + CardBorderAndMarginWidth * pagedCount;
      } else if (matchType(tabType, 'window')) {
        distance = currentTabsWidth + WindowMarginLeft;
      } else {
        distance = currentTabsWidth;
      }
    }
    return -distance;
  }

  initContainerSize() {
    this.offsetWidth = 0;
    this.offsetHeight = 0;
  }

  updateContainerSize() {
    if (this.tabs) {
      this.offsetWidth = this.tabs.current.offsetWidth;
      this.offsetHeight = this.tabs.current.offsetHeight;
    }
  }

  getTabpaneConfig(child: React$Element<any>, i: number) {
    const { tabPosition, tabType } = this.props;
    const { activityValue, data } = this.state;
    const TabpaneActivityValue = getAttributeFromObject(
      child,
      'activityValue',
      child
        ? getKeyfromIndex(data, i, 'activityValue')
        : getAttributeFromObject(
            child.props,
            'activityValue',
            child ? getKeyfromIndex(data, i, 'activityValue') : '0'
          )
    );
    const disabled = getAttributeFromObject(
      child,
      'disabled',
      getAttributeFromObject(child.props, 'disabled', false)
    );
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
      index: i,
      isSelect: !disabled && activityValue === i,
      getTabpaneWidthOrHeight: this.getTabpaneWidthOrHeight,
      onDeleteClick: this.onDeleteClick,
      disabled,
      onMouseEnter: this.onTabMouseEnter,
      onMouseLeave: this.onTabMouseLeave,
    };
  }

  getChildren() {
    const { data } = this.state;
    const { getTabpane, themeProps } = this.props;
    return data
      ? data.map((child, index) => {
          const target = <Tabpane {...this.props} {...this.getTabpaneConfig(child, index)} />;
          return getTabpane ? getTabpane(target, index) : target;
        })
      : null;
  }

  getChildrenContent() {
    const { activityValue, data } = this.state;
    const { forceRender, tabPosition, themeProps } = this.props;
    if (data) {
      themeProps.propsConfig = { tabPosition };
      return (
        <TabContentContainer themeProps={themeProps}>
          {data.map((child, index) => {
            const content = getAttributeFromObject(
              child,
              'content',
              getAttributeFromObject(
                child.props,
                'content',
                getAttributeFromObject(child, 'children', undefined)
              )
            );
            const props = { active: activityValue, index };
            const contentThemeProps = this.props.getPartOfThemeProps('ContentBlock', { props });
            return (
              <TabContent themeProps={contentThemeProps}>
                <TabContentInner
                  {...this.props}
                  themeProps={contentThemeProps}
                  content={content}
                  // tabPosition={tabPosition}
                />
              </TabContent>
            );
          })}
        </TabContentContainer>
      );
    }
  }
  // TabContentContainer
  // getChildrenContent() {
  //   const { forceRender, tabPosition, themeProps } = this.props;
  //   const { activityValue, data } = this.state;
  //   if (data && data.map) {
  //     return data.map((child, i) => {
  //       const childActivityValue = getAttributeFromObject(
  //         child,
  //         'activityValue',
  //         getAttributeFromObject(
  //           child.props,
  //           'activityValue',
  //           getKeyfromIndex(data, i, 'activityValue')
  //         )
  //       );
  //       if (forceRender || childActivityValue === activityValue) {
  //         const content = getAttributeFromObject(
  //           child,
  //           'content',
  //           getAttributeFromObject(
  //             child.props,
  //             'content',
  //             getAttributeFromObject(child, 'children', undefined)
  //           )
  //         );
  //         const contentThemeProps = this.props.getPartOfThemeProps('ContentBlock');
  //         contentThemeProps.propsConfig = { tabPosition };
  //         return (
  //           <TabContent
  //             {...this.props}
  //             themeProps={contentThemeProps}
  //             content={content}
  //             activityValue={childActivityValue}
  //             tabPosition={tabPosition}
  //           />
  //         );
  //       }
  //     });
  //   }
  //   return null;
  // }
  getTabpaneDisabled(activityValue: number) {
    const { data } = this.state;
    if (activityValue) {
      // const index = getIndexfromKey(data, 'activityValue', activityValue.toString());
      return data[activityValue].disabled;
    }
    return false;
  }

  onTabClick = (index: number) => {
    const { onTabClick } = this.props;
    const { activityValue } = this.state;
    if (activityValue === index) {
      return;
    }

    if (!this.getTabpaneDisabled(index)) {
      onTabClick && onTabClick(index);
      this.setState({ activityValue: index });
    }
  };
  // setActiveValue = (activityValue: number) => {
  //   const { onChange } = this.props;
  //   if (activityValue !== this.state.activityValue) {
  //     this.setState({ activityValue });
  //   }
  //   // onChange && onChange(activityValue, e);
  // };

  onDeleteClick = (e: Event, activityValue: string) => {
    const { data } = this.state;
    let newdata = [];
    if (!hasDataInProps(this.props)) {
      newdata = data.filter(tabpane => {
        return tabpane.activityValue !== activityValue;
      });
      this.setState(
        {
          data: newdata,
        },
        () => {
          this.updataChildrenSize();
        }
      );
    }

    const { onDeleteClick } = this.props;
    onDeleteClick && onDeleteClick(activityValue);
  };

  onAddClick = (e: Event) => {
    const { onAddClick } = this.props;
    if (!hasDataInProps(this.props)) {
      const { data } = this.state;
      const newdata = [...data];
      const tabIndex = this.state.data.length + 1;
      const item = onAddClick(e)
        ? onAddClick(e)
        : {
            title: `new tab ${tabIndex}`,
            content: `content of new tab ${tabIndex}`,
            activityValue: `newTab${tabIndex}`,
          };
      newdata.push(item);
      this.setState(
        {
          data: addActivityValue2Data(newdata),
        },
        () => {
          this.updataChildrenSize();
        }
      );
    }
    onAddClick && onAddClick(e);
  };

  getTabpaneWidthOrHeight = (width: number) => {
    const { childrenSize } = this.state;
    const newChildrenSize = childrenSize;
    newChildrenSize.push(width);
    this.setState({ childrenSize: newChildrenSize });
    this.updataChildrenSize();
  };

  updataChildrenSize() {
    const { data, childrenSize } = this.state;
    const newData = addWidth2Data(data, childrenSize);
    const newChildrenSize = [];
    newData.map(item => {
      return newChildrenSize.push(item.width);
    });
    this.setState({ childrenSize: newChildrenSize });
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

  getPagedCount(currentPage: number, totalPage: number, type: EditEventType) {
    if (matchType(type, 'next')) {
      currentPage++;
    } else if (matchType(type, 'pre')) {
      currentPage--;
    }
    return Math.max(Math.min(currentPage, totalPage - 1), 0);
  }

  handleChangePage = (type: EditEventType) => {
    let { currentPage, totalPage, pagedCount, childrenSize } = this.state;
    const { pagedType } = this.props;
    if (pagedType === 'page') {
      currentPage = this.getPagedCount(currentPage, totalPage, type);
    } else {
      pagedCount = this.getPagedCount(pagedCount, childrenSize.length, type);
    }

    this.setState({ currentPage, pagedCount });
  };
  onTabMouseEnter = (activityValue: string, e: Event) => {
    const { onTabMouseEnter } = this.props;
    onTabMouseEnter && onTabMouseEnter(activityValue, e);
  };

  onTabMouseLeave = (activityValue: string, e: Event) => {
    const { onTabMouseLeave } = this.props;
    onTabMouseLeave && onTabMouseLeave(activityValue, e);
  };
}

const TargetTabs = ThemeHoc(KeyBoardEventAdaptor(TabsBox), Widget.Tabs, {
  hover: true,
  active: false,
});
export default TargetTabs;
