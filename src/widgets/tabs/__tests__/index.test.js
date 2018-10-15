/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import renderer from 'react-test-renderer';
import Wrapper from '../demo';
import 'jest-styled-components';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Tabs from '../index';
import { data, strangeData } from '../demo';
import { isVertical } from '../utils';

Enzyme.configure({ adapter: new Adapter() });

describe('tabsDemo', () => {
  const createTabs = (obj?: Object): any => {
    const config = obj ? obj : { tabType: 'line', tabPosition: 'bottom', data };
    return <Tabs {...config} />;
  };
  it('Component JSON', () => {
    const renders = renderer.create(<Wrapper />);
    expect(renders.toJSON()).toMatchSnapshot();
  });
  const getCmp = (target: any): Object => {
    return target
      .children()
      .at(0)
      .children()
      .at(0)
      .instance();
  };
  it('props defaultActivityKey', () => {
    const target = mount(createTabs({ defaultActivityKey: '2', data }));
    const { activityKey } = getCmp(target).state;
    expect(activityKey).toBe('2');
  });
  it('props activityKey', () => {
    const target = mount(createTabs({ defaultActivityKey: '2', activityKey: '1', data }));
    const { activityKey } = getCmp(target).state;
    expect(activityKey).toBe('1');
  });

  function testOnTabClick(component: any, expIndex: number, expActicityKey: string) {
    it('props onTabClick', () => {
      const target = mount(component);
      const type = isVertical(component.props.tabPosition) ? 'yTabpane' : 'hTabpane';
      const tabpane = target.find(type);
      tabpane.at(expIndex).simulate('click');
      expect(getCmp(target).state.activityKey).toBe(expActicityKey);
    });
  }
  testOnTabClick(createTabs(), 0, '0');
  testOnTabClick(createTabs(), 1, '1');
  testOnTabClick(createTabs(), 2, '2');
  testOnTabClick(createTabs(), 3, '3');
  testOnTabClick(createTabs({ data, tabType: 'card' }), 2, '2');
  testOnTabClick(createTabs({ data, tabType: 'window' }), 2, '2');
  testOnTabClick(createTabs({ data, tabType: 'line', tabPosition: 'left' }), 1, '1');
  testOnTabClick(createTabs({ data, tabType: 'line', tabPosition: 'right' }), 2, '2');
  testOnTabClick(createTabs({ data, tabType: 'line', tabPosition: 'top' }), 3, '3');
  function testActivityKey(component: any, expActicityKey: string) {
    it('props activityKey', () => {
      const target = mount(component);
      const type = isVertical(component.props.tabPosition) ? 'yTabpane' : 'hTabpane';
      const tabpane = target.find(type);
      tabpane.at(2).simulate('click');
      expect(getCmp(target).state.activityKey).toBe(expActicityKey);
    });
  }
  testActivityKey(createTabs({ data, activityKey: '1' }), '1');
  testActivityKey(createTabs({ data, activityKey: '3' }), '3');

  const onAddClick = () => {};
  function testAddClick(component: any) {
    it('props onAddClick', () => {
      const target = mount(createTabs({ data: strangeData, onAddClick, tabType: 'card' }));
      const { data, children } = getCmp(target).props;
      const length = data ? data.length : children ? children.length : 0;
      target.find('addIcon').simulate('click');
      expect(getCmp(target).state.data.length).toBe(length + 1);
    });
  }
  testAddClick(createTabs({ data: strangeData, onAddClick, tabType: 'card' }));
  testAddClick(createTabs({ data: strangeData, onAddClick, tabType: 'window' }));

  const onDeleteClick = () => {};
  function testDeleteClick(component: any) {
    it('props onDeleteClick', () => {
      const target = mount(component);
      const { data, children } = getCmp(target).props;
      const length = data ? data.length : children ? children.length : 0;
      target
        .find('deleteIcon')
        .at(1)
        .simulate('click');
      expect(getCmp(target).state.data.length).toBe(length - 1);
    });
  }
  testDeleteClick(createTabs({ data: strangeData, onDeleteClick, tabType: 'card' }));
  testDeleteClick(createTabs({ data: strangeData, onDeleteClick, tabType: 'window' }));
});
