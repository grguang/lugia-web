/*
 *create by LYQ
 *
 *2018-11-21
 *
 *@flow
 *
 */
import React from 'react';
import Rate from './index';
import Theme from '../theme';
import Widget from '../consts/index';
import styled from 'styled-components';
const TitleBox = styled.div`
  position: relative;
  padding: 10px;
  font-size: 18px;
  border-top: 1px solid #ccc;
`;
const TextBox = styled.span`
  font-size: 14px;
  color: #333;
`;
class RateDemo extends React.Component<any, any> {
  constructor(props: Object) {
    super(props);
    this.state = {};
  }
  render() {
    const config = {
      [Widget.Rate]: { fontSize: 18 },
    };
    const defaultProps = {
      count: 10,
      max: 10,
      value: 3,
      disabled: false,
      allowHalf: false,
      classify: false,
      onClick: (e: Object, x: any) => {
        this.setStateValue('defaultProps', x.currentValue);
      },
      onChange: (e: Object, x: any) => {
        this.setStateValue('defaultProps', x.currentValue);
      },
    };
    const defaultProps1 = {
      count: 5,
      max: 10,
      value: 7,
      disabled: false,
      allowHalf: true,
      classify: false,
      onClick: (e: Object, x: any) => {
        this.setStateValue('defaultProps1', x.currentValue);
      },
      onChange: (e: Object, x: any) => {
        this.setStateValue('defaultProps1', x.currentValue);
      },
    };
    const defaultProps2 = {
      count: 5,
      max: 5,
      value: 3.5,
      disabled: false,
      allowHalf: true,
      classify: false,
      onClick: (e: Object, x: any) => {
        this.setStateValue('defaultProps2', x.currentValue);
      },
      onChange: (e: Object, x: any) => {
        this.setStateValue('defaultProps2', x.currentValue);
      },
    };
    const defaultProps3 = {
      count: 5,
      max: 5,
      value: 3.6,
      disabled: true,
      allowHalf: true,
      className: 'cccc',
      onClick: (e: Object, x: any) => {},
      onChange: (e: Object, x: any) => {
        this.setStateValue('defaultProps3', x.currentValue);
      },
    };
    const defaultProps4 = {
      count: 5,
      max: 5,
      value: 2,
      disabled: false,
      allowHalf: false,
      classify: true,
      iconClass: {
        default: 'lugia-icon-financial_meh',
        danger: 'lugia-icon-financial_sad',
        amazed: 'lugia-icon-financial_smile',
      },
      className: 'cccc',
      onClick: (e: Object, x: any) => {
        this.setStateValue('defaultProps4', x.currentValue);
      },
      onChange: (e: Object, x: any) => {
        this.setStateValue('defaultProps4', x.currentValue);
      },
    };
    const defaultProps5 = {
      count: 5,
      max: 5,
      value: 3,
      disabled: false,
      allowHalf: false,
      classify: true,
      iconClass: {
        default: 'lugia-icon-financial_meh',
        danger: 'lugia-icon-financial_sad',
        amazed: 'lugia-icon-financial_smile',
      },
      onClick: (e: Object, x: any) => {
        this.setStateValue('defaultProps5', x.currentValue);
      },
      onChange: (e: Object, x: any) => {
        this.setStateValue('defaultProps5', x.currentValue);
      },
    };
    const defaultProps6 = {
      count: 5,
      max: 5,
      value: 4,
      disabled: false,
      allowHalf: false,
      classify: true,
      iconClass: {
        default: 'lugia-icon-financial_meh',
        danger: 'lugia-icon-financial_sad',
        amazed: 'lugia-icon-financial_smile',
      },
      onClick: (e: Object, x: any) => {
        this.setStateValue('defaultProps6', x.currentValue);
      },
      onChange: (e: Object, x: any) => {
        this.setStateValue('defaultProps6', x.currentValue);
      },
    };
    const defaultProps7 = {
      count: 5,
      allowHalf: true,
      onClick: (e: Object, x: any) => {
        this.setStateValue('defaultProps7', x.currentValue);
      },
      onChange: (e: Object, x: any) => {
        this.setStateValue('defaultProps7', x.currentValue);
      },
    };

    return (
      <div>
        <div>
          <TitleBox>基础用法 default：</TitleBox>
          <Rate {...defaultProps7} />
          <TextBox>{this.state.defaultProps7} 颗星</TextBox>
        </div>
        <Theme config={config}>
          <TitleBox>基础用法 default limit：</TitleBox>
          <Rate {...defaultProps} />
          <TextBox>{this.state.defaultProps} 颗星</TextBox>
        </Theme>
        <Theme config={config}>
          <TitleBox>半星用法(总分10分) allowHalf：</TitleBox>
          <Rate {...defaultProps1} />
          <TextBox>{this.state.defaultProps1} 分</TextBox>
        </Theme>
        <Theme config={config}>
          <TitleBox>辅助文字：</TitleBox>
          <Rate {...defaultProps2} character="好" />
          <TextBox>{this.state.defaultProps2} 颗星</TextBox>
        </Theme>
        <Theme config={config}>
          <TitleBox>只读：</TitleBox>
          <Rate {...defaultProps3} character="好" />
          <TextBox>{this.state.defaultProps3} 颗星</TextBox>
        </Theme>
        <Theme config={config}>
          <TitleBox>自定义图标：</TitleBox>
          <Rate {...defaultProps4} />
          <TextBox>{this.state.defaultProps4} 颗星</TextBox>
        </Theme>
        <Theme config={config}>
          <TitleBox>自定义图标：</TitleBox>
          <Rate {...defaultProps5} />
          <TextBox>{this.state.defaultProps5} 颗星</TextBox>
        </Theme>
        <Theme config={config}>
          <TitleBox>自定义图标：</TitleBox>
          <Rate {...defaultProps6} />
          <TextBox>{this.state.defaultProps6} 颗星</TextBox>
        </Theme>
        <div>
          <TitleBox>默认设置 noProps：</TitleBox>
          <Rate />
        </div>
      </div>
    );
  }
  setStateValue = (target: string, val: number) => {
    this.setState({
      [target]: val,
    });
  };
}
export default RateDemo;
