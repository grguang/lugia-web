/**
 *
 * create by guorg
 *
 * @flow
 */
import * as React from 'react';
import { connect } from '@lugia/lugiax';
import Table from './smartTable';
import RcTable from 'rc-table';
import Theme from '../theme';
import Widget from '../consts/index';
import model from './model';

const { ColumnGroup, Column } = Table;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    // width: 100,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    // width: 100,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    // width: 200,
    key: 'address',
  },
  {
    title: 'Operations',
    dataIndex: '',
    // width: 100,
    key: 'operations',
    render: () => <a href="#">Delete</a>,
  },
];

const data = [
  { name: 'Jack', age: 28, address: 'some where', key: '1' },
  { name: 'Rose', age: 36, address: 'some where', key: '2' },
  { name: 'Rook', age: 22, address: 'some where', key: '3' },
  { name: 'Lise', age: 33, address: 'some where', key: '4' },
  { name: 'Lise', age: 33, address: 'some where', key: '5' },
  { name: 'Lise', age: 33, address: 'some where', key: '6' },
  { name: 'Lise', age: 33, address: 'some where', key: '7' },
  { name: 'asdasda', age: 33, address: 'some where', key: '8' },
  { name: 'asdasda', age: 33, address: 'some where', key: '9' },
  { name: 'asdasda', age: 33, address: 'some where', key: '10' },
];

const ConnectTable = connect(
  model,
  state => {
    return {
      data: state.get('data').toJS ? state.get('data').toJS() : state.get('data'),
      onChange: model.mutations.setSelect,
      selectRowKeys: state.get('selectRowKeys').toJS
        ? state.get('selectRowKeys').toJS()
        : state.get('selectRowKeys'),
    };
  }
)(Table);
const ConnectRcTable = connect(
  model,
  state => {
    return {
      data: state.get('data').toJS ? state.get('data').toJS() : state.get('data'),
      onChange: model.mutations.setSelect,
      selectRowKeys: state.get('selectRowKeys').toJS
        ? state.get('selectRowKeys').toJS()
        : state.get('selectRowKeys'),
    };
  }
)(RcTable);

export default class ModalDemo extends React.Component<any, any> {
  constructor() {
    super();
    this.state = {
      selectRowKeys: ['1'],
      updateData: data,
      treeTable: undefined,
    };
  }
  update = () => {
    const data = [];
    for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
      data.push({ name: 'Rose' + i, age: 36, address: 'some where', key: '2' });
    }
    this.setState({ updateData: data });
  };

  selectChange = (selectRowKeys: string, records: Object) => {
    console.log('selectRowKeys', selectRowKeys);
    console.log('records', records);
    this.setState({
      selectRowKeys,
    });
  };

  componentDidMount() {}

  render() {
    const { updateData, treeTable } = this.state;

    return (
      <div style={{ padding: '20px' }}>
        <h1>边框表格</h1>
        <ConnectTable columns={columns} />
        <ConnectRcTable columns={columns} />
      </div>
    );
  }
}
