import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import warning from 'warning';
import { getOffset, isInclude, traverseTreeNodes, updateCheckState } from './util';
import { TreeUl } from '../../css/tree';
function noop() {}
export const contextTypes = {
  rcTree: PropTypes.shape({
    selectable: PropTypes.bool,
  }),
};

class Tree extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    children: PropTypes.any,
    showLine: PropTypes.bool,
    showIcon: PropTypes.bool,
    selectable: PropTypes.bool,
    multiple: PropTypes.bool,
    checkable: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
    checkStrictly: PropTypes.bool,
    draggable: PropTypes.bool,
    autoExpandParent: PropTypes.bool,
    defaultExpandAll: PropTypes.bool,
    defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
    expandedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultCheckedKeys: PropTypes.arrayOf(PropTypes.string),
    checkedKeys: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.object]),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    onExpand: PropTypes.func,
    onCheck: PropTypes.func,
    onSelect: PropTypes.func,
    loadData: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onRightClick: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnter: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func,
    onDragEnd: PropTypes.func,
    filterTreeNode: PropTypes.func,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  };

  static childContextTypes = contextTypes;

  static defaultProps = {
    prefixCls: 'rc-tree',
    showLine: false,
    showIcon: true,
    selectable: true,
    multiple: false,
    checkable: false,
    checkStrictly: false,
    draggable: false,
    autoExpandParent: true,
    defaultExpandAll: false,
    defaultExpandedKeys: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: [],
    onExpand: noop,
    onCheck: noop,
    onSelect: noop,
    onDragStart: noop,
    onDragEnter: noop,
    onDragOver: noop,
    onDragLeave: noop,
    onDrop: noop,
    onDragEnd: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
    onRightClick: noop,
  };

  constructor(props) {
    super(props);
    const { expandedKeys, checkedKeys, halfCheckedKeys } = props;
    this.state = {
      expandedKeys,
      checkedKeys,
      halfCheckedKeys,
      selectedKeys: this.calcSelectedKeys(props),
      highlight: this.caclcHighLight(props),
      dragNodesKeys: '',
      dragOverNodeKey: '',
      dropNodeKey: '',
    };
  }

  getChildContext() {
    const { selectable } = this.props;
    return {
      rcTree: {
        selectable,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;
    const newState = {};
    const expandedKeys = nextProps.expandedKeys;
    if (expandedKeys) {
      newState.expandedKeys = expandedKeys;
    }
    const { checkedKeys = {}, halfCheckedKeys = [] } = nextProps;
    newState.checkedKeys = checkedKeys;
    newState.halfCheckedKeys = halfCheckedKeys;

    const selectedKeys =
      nextProps.selectedKeys !== props.selectedKeys
        ? this.calcSelectedKeys(nextProps, true)
        : undefined;
    if (selectedKeys) {
      newState.selectedKeys = selectedKeys;
    }
    const highlight =
      nextProps.highlight !== props.highlight ? this.caclcHighLight(nextProps, true) : undefined;
    if (highlight) {
      newState.highlight = highlight;
    }
    this.setState(newState);
  }

  onDragStart(e, treeNode) {
    this.dragNode = treeNode;
    const newState = {
      dragNodesKeys: this.getDragNodesKeys(treeNode),
    };
    const expandedKeys = this.getExpandedKeys(treeNode, false);
    if (expandedKeys) {
      newState.expandedKeys = expandedKeys;
    }
    this.setState(newState);
    this.props.onDragStart({
      event: e,
      node: treeNode,
    });
  }

  onDragEnter(e, treeNode) {
    const dropPosition = this.calcDropPosition(e, treeNode);
    if (this.dragNode.props.eventKey === treeNode.props.eventKey && dropPosition === 0) {
      this.setState({
        dragOverNodeKey: '',
        dropPosition: null,
      });
      return;
    }
    this.setState({
      dragOverNodeKey: treeNode.props.eventKey,
      dropPosition,
    });

    if (!this.delayedDragEnterLogic) {
      this.delayedDragEnterLogic = {};
    }
    Object.keys(this.delayedDragEnterLogic).forEach(key => {
      clearTimeout(this.delayedDragEnterLogic[key]);
    });
    this.delayedDragEnterLogic[treeNode.props.pos] = setTimeout(() => {
      const expandedKeys = this.getExpandedKeys(treeNode, true);
      if (expandedKeys) {
        this.setState({ expandedKeys });
      }
      this.props.onDragEnter({
        event: e,
        node: treeNode,
        expandedKeys: (expandedKeys && [...expandedKeys]) || [...this.state.expandedKeys],
      });
    }, 400);
  }

  onDragOver(e, treeNode) {
    this.props.onDragOver({ event: e, node: treeNode });
  }

  onDragLeave(e, treeNode) {
    this.props.onDragLeave({ event: e, node: treeNode });
  }

  onDrop(e, treeNode) {
    const { state } = this;
    const eventKey = treeNode.props.eventKey;
    this.setState({
      dragOverNodeKey: '',
      dropNodeKey: eventKey,
    });
    if (state.dragNodesKeys.indexOf(eventKey) > -1) {
      warning(false, "Can not drop to dragNode(include it's children node)");
      return;
    }

    const posArr = treeNode.props.pos.split('-');
    const res = {
      event: e,
      node: treeNode,
      dragNode: this.dragNode,
      dragNodesKeys: [...state.dragNodesKeys],
      dropPosition: state.dropPosition + Number(posArr[posArr.length - 1]),
    };
    if (state.dropPosition !== 0) {
      res.dropToGap = true;
    }
    this.props.onDrop(res);
  }

  onDragEnd(e, treeNode) {
    this.setState({
      dragOverNodeKey: '',
    });
    this.props.onDragEnd({ event: e, node: treeNode });
  }

  onExpand(treeNode) {
    const { props, state } = this;
    const expanded = !treeNode.props.expanded;
    const expandedKeys = [...state.expandedKeys];
    const eventKey = treeNode.props.eventKey;

    const index = expandedKeys.indexOf(eventKey);
    if (expanded && index === -1) {
      expandedKeys.push(eventKey);
    } else if (!expanded && index > -1) {
      expandedKeys.splice(index, 1);
    }

    const controlled = 'expandedKeys' in props;
    if (!controlled) {
      this.setState({ expandedKeys });
    }
    props.onExpand(expandedKeys, { node: treeNode, expanded });

    // After data loaded, need set new expandedKeys
    if (expanded && props.loadData) {
      return props.loadData(treeNode).then(() => {
        if (!controlled) {
          this.setState({ expandedKeys });
        }
      });
    }
  }

  onCheck = (treeNode, e) => {
    const checked = !treeNode.props.checked || treeNode.props.halfChecked;
    const eventObj = Object.assign({}, e, {
      event: 'check',
      node: treeNode,
      checked,
    });
    const { onCheck } = this.props;
    const { checkKeys = {} } = this.state;
    onCheck && onCheck(checkKeys.checkedKeys, eventObj);
  };

  onSelect(treeNode) {
    const { props, state } = this;
    const eventKey = treeNode.props.eventKey;
    const selected = !treeNode.props.selected;

    let selectedKeys = [...state.selectedKeys];
    if (!selected) {
      const index = selectedKeys.indexOf(eventKey);
      selectedKeys.splice(index, 1);
    } else if (!props.multiple) {
      selectedKeys = [eventKey];
    } else {
      selectedKeys.push(eventKey);
    }

    // TODO: can be optimized if we remove selectedNodes in API
    const selectedNodes = [];
    if (selectedKeys.length) {
      traverseTreeNodes(props.children, item => {
        if (selectedKeys.indexOf(item.key) !== -1) {
          selectedNodes.push(item);
        }
      });
    }

    if (!('selectedKeys' in props)) {
      this.setState({
        selectedKeys,
      });
    }

    const eventObj = {
      event: 'select',
      selected,
      node: treeNode,
      selectedNodes,
    };
    props.onSelect(selectedKeys, eventObj);
  }

  onMouseEnter(e, treeNode) {
    this.props.onMouseEnter({ event: e, node: treeNode });
  }

  onMouseLeave(e, treeNode) {
    this.props.onMouseLeave({ event: e, node: treeNode });
  }

  onContextMenu(e, treeNode) {
    this.props.onRightClick({ event: e, node: treeNode });
  }

  // all keyboard events callbacks run from here at first
  onKeyDown = e => {
    e.preventDefault();
  };

  getOpenTransitionName() {
    const props = this.props;
    const transitionName = props.openTransitionName;
    const animationName = props.openAnimation;
    if (!transitionName && typeof animationName === 'string') {
      return `${props.prefixCls}-open-${animationName}`;
    }
    return transitionName;
  }

  getDragNodesKeys(treeNode) {
    const dragNodesKeys = [];
    const treeNodePosArr = treeNode.props.pos.split('-');
    traverseTreeNodes(treeNode.props.children, (item, index, pos, key) => {
      const childPosArr = pos.split('-');
      if (
        treeNode.props.pos === pos ||
        (treeNodePosArr.length < childPosArr.length && isInclude(treeNodePosArr, childPosArr))
      ) {
        dragNodesKeys.push(key);
      }
    });
    dragNodesKeys.push(treeNode.props.eventKey || treeNode.props.pos);
    return dragNodesKeys;
  }

  getExpandedKeys(treeNode, expand) {
    const eventKey = treeNode.props.eventKey;
    const expandedKeys = this.state.expandedKeys;
    const expandedIndex = expandedKeys.indexOf(eventKey);
    if (!expand && expandedIndex > -1) {
      const exKeys = [...expandedKeys];
      exKeys.splice(expandedIndex, 1);
      return exKeys;
    }
    if (expand && expandedKeys.indexOf(eventKey) === -1) {
      return expandedKeys.concat([eventKey]);
    }
  }

  generateTreeNodesStates(children, checkedKeys) {
    const checkedPositions = [];
    const treeNodesStates = {};
    traverseTreeNodes(children, (item, _, pos, key, childrenPos, parentPos) => {
      treeNodesStates[pos] = {
        node: item,
        key,
        checked: false,
        halfChecked: false,
        disabled: item.props.disabled,
        disableCheckbox: item.props.disableCheckbox,
        childrenPos,
        parentPos,
      };
      if (checkedKeys.indexOf(key) !== -1) {
        treeNodesStates[pos].checked = true;
        checkedPositions.push(pos);
      }
    });
    checkedPositions.forEach(checkedPosition => {
      updateCheckState(treeNodesStates, checkedPosition, true);
    });
    return treeNodesStates;
  }

  calcSelectedKeys(props, isNotInit) {
    const selectedKeys = props.selectedKeys || (isNotInit ? undefined : props.defaultSelectedKeys);
    if (!selectedKeys) {
      return undefined;
    }
    if (props.multiple) {
      return [...selectedKeys];
    }
    if (selectedKeys.length) {
      return [selectedKeys[0]];
    }
    return selectedKeys;
  }

  caclcHighLight(props, isNotInit) {
    const highlight = props.highlight || (isNotInit ? undefined : props.defaulthighlight);
    if (!highlight) {
      return undefined;
    }
    return highlight;
  }

  calcDropPosition(e, treeNode) {
    const offsetTop = getOffset(treeNode.selectHandle).top;
    const offsetHeight = treeNode.selectHandle.offsetHeight;
    const pageY = e.pageY;
    const gapHeight = 2; // TODO: remove hard code
    if (pageY > offsetTop + offsetHeight - gapHeight) {
      return 1;
    }
    if (pageY < offsetTop + gapHeight) {
      return -1;
    }
    return 0;
  }

  filterTreeNode = treeNode => {
    const filterTreeNode = this.props.filterTreeNode;
    if (typeof filterTreeNode !== 'function' || treeNode.props.disabled) {
      return false;
    }
    return filterTreeNode.call(this, treeNode);
  };

  renderTreeNode(child, index, level = 0) {
    const { state, props } = this;
    const pos = `${level}-${index}`;
    const key = child.key || pos;
    const childProps = {
      root: this,
      eventKey: key,
      pos,
      loadData: props.loadData,
      prefixCls: props.prefixCls,
      showIcon: props.showIcon,
      draggable: props.draggable,
      dragOver: state.dragOverNodeKey === key && state.dropPosition === 0,
      dragOverGapTop: state.dragOverNodeKey === key && state.dropPosition === -1,
      dragOverGapBottom: state.dragOverNodeKey === key && state.dropPosition === 1,
      expanded: state.expandedKeys.indexOf(key) !== -1,
      selected: state.selectedKeys.indexOf(key) !== -1,
      hightLight: state.highlight.indexOf(key) !== -1,
      openTransitionName: this.getOpenTransitionName(),
      openAnimation: props.openAnimation,
      filterTreeNode: this.filterTreeNode,
    };
    if (props.checkable) {
      childProps.checkable = props.checkable;
      childProps.checked = state.checkedKeys.indexOf(key) !== -1;
      childProps.halfChecked = state.halfCheckedKeys.indexOf(key) !== -1;
    }
    return React.cloneElement(child, childProps);
  }

  render() {
    const props = this.props;
    const className = classNames(props.prefixCls, props.className, {
      [`${props.prefixCls}-show-line`]: props.showLine,
    });
    const domProps = {};
    if (props.focusable) {
      domProps.tabIndex = '0';
      domProps.onKeyDown = this.onKeyDown;
    }
    const { getPartOfThemeProps, top } = props;
    return (
      <TreeUl
        {...domProps}
        className={className}
        role="tree-node"
        unselectable="on"
        style={props.style}
        themeProps={getPartOfThemeProps('TreeWrap', { props: { top } })}
      >
        {React.Children.map(props.children, this.renderTreeNode, this)}
      </TreeUl>
    );
  }
}

export default Tree;
