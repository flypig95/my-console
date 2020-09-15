import React, { useState, useEffect } from 'react';
import { Button, Input, Form, Table, message, Popconfirm } from 'antd';
import { TablePaginationConfig, ColumnsType } from 'antd/lib/table';
import { Link } from 'react-router-dom';
import moment from 'moment'
import * as _ from 'lodash'
import './searchPage.scss';

const layout = {
    wrapperCol: {
        span: 20,
    },
};

interface CreateFormItemsInterface {
    (data?: any[]): {
        label: string,
        name: string,
        component?: JSX.Element
    }[]
}

interface SearchPageProps {
    getListFn: Function,
    columns: (data?: any[]) => ColumnsType<any>,
    initService?: Function[],
    pagination?: {
        current: number,
        pageSize: number
        total: number,
    },
    createFormItems?: CreateFormItemsInterface,
    extraBtn?: { text: string, toPath?: string, fn?: Function, isBatch?: boolean, params?: string[] }[],
    rowKey?: string,
    scroll?: any,
    tableProps?: any,
    columnsWithOperate?: {
        detailPath?: string,
        updatePath?: string,
        delRecord?: {
            fn: Function,
            params: string[]
        }
    }
}

const convertPath = (record: any, path: string) => {
    return path.replace(/:[\w]*/g, function (i) {
        return record[i.split(':')[1]]
    })
}

const SearchPage = (props: SearchPageProps) => {
    const { createFormItems = () => [], getListFn, columns, pagination, extraBtn, scroll, columnsWithOperate, initService = [], tableProps } = props;
    const [initialData, setInitialData]: [any[], Function] = useState([]);
    const [list, setList] = useState([])
    const [_pagination, setPagination] = useState(pagination ? pagination : {
        current: 1,
        pageSize: 20,
        total: 0
    })
    const [searchParams, setSearchParams] = useState({});
    const [refreshFlag, setRefreshFlag] = useState(0); // refresh page
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const hasFormItems = createFormItems()?.length > 0;

    const createColumns = () => {
        const operatorColumn = {
            title: '操作',
            dataIndex: 'operation',
            // fixed: 'right' as 'right',
            render: (text: string, record: any, index: number) => (
                <div>
                    {columnsWithOperate?.detailPath ? <Link to={convertPath(record, columnsWithOperate.detailPath)} style={{ marginRight: '10px' }}>详情</Link> : null}
                    {columnsWithOperate?.updatePath ? <Link style={{ marginRight: '10px' }} to={convertPath(record, columnsWithOperate.updatePath)}>修改</Link> : null}
                    {columnsWithOperate?.delRecord ? <Popconfirm title="确认删除这条记录吗?" onConfirm={() => delRecord(record)} okText="确认" cancelText="取消"><a href="javascript:;" style={{ marginRight: '10px' }}>删除</a></Popconfirm> : null}
                </div>
            )
        }
        return columnsWithOperate ? columns(initialData).concat(operatorColumn) : columns();
    }


    const delRecord = async (record: any) => {
        const params: any = {}
        columnsWithOperate?.delRecord?.params.forEach(key => {
            params[key] = record[key];
        })
        const res = await columnsWithOperate?.delRecord?.fn(params);
        if (res.code === 200) {
            message.success('删除成功！');
            setRefreshFlag(refreshFlag + 1);
        }
    }

    const getList = async (params: any) => {
        setLoading(true);
        for(let key in params) {
            if(moment.isMoment(params[key])) {
                params[key] = new Date(params[key])
            }
        }
        let res: any = await getListFn(params) || {};
        let hasImg = false;
        res.rows?.forEach(async (row: any) => {
            row._id = Math.random();
        })

        if (!hasImg) {
            setList(res.rows || []);
        }
        setPagination({
            current: res.pageNum,
            pageSize: 20,
            total: res.total
        })
        setLoading(false)
    };

    const handleSubmit = (values: object) => {
        const { current, pageSize } = _pagination;
        const params = Object.assign({}, { pageNum: current, pageSize }, values);
        getList(params);
        setSearchParams(values);
    }

    const pageChange = (pagination: TablePaginationConfig) => {
        const { current } = pagination;
        const params = Object.assign({}, searchParams, { pageNum: current });
        getList(params);
    }

    const createExtraBtn = () => {
        const onClickHandle = async ({ text, fn, params }: any) => {
            const arr = selectedRows.map(row => row[params[0]]);
            const _params = { [params[0]]: arr.join(',') };
            const res = await (params ? fn(_params) : fn());
            if (res.code === 200) {
                message.success(`${text}成功！`)
                getList(params);
            }
        }
        return extraBtn?.map(item => {
            if (item.toPath) {
                return <Button type="primary"><Link to={item.toPath}>{item.text}</Link></Button>
            } else if (item.fn) {
                return <Button onClick={() => item.fn && onClickHandle(item)} type="primary">{item.text}</Button>
            }
        })
    }

    const initial = async () => {
        if (initService.length) {
            const result = await Promise.all(initService?.map(fn => fn().then((res: any) => res.data || res.rows)))
            setInitialData(result)
        }
        handleSubmit(searchParams)
    }

    useEffect(() => {
        initial()
    }, [refreshFlag])

    const crateTableProps = () => {
        const isRowSelection = extraBtn?.some(item => item.isBatch);
        const _tableProps: any = {
            columns: createColumns(),
            dataSource: list,
            pagination: { total: _pagination.total },
            onChange: pageChange,
            rowKey: '_id',
            scroll,
            loading,
            ...tableProps
        }
        if (isRowSelection) {
            _tableProps.rowSelection = {
                onChange: (selectedRowKeys: [], selectedRows: []) => {
                    setSelectedRows(selectedRows)
                }
            }
        }
        return _tableProps;
    }

    return (
        <div className="search-page-container">
            {extraBtn ? <div className="extra-button">
                {createExtraBtn()}
            </div> : null}
            {
                hasFormItems &&
                <Form
                    {...layout}
                    name="basic"
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ marginBottom: '50px' }}
                >
                    {
                        createFormItems(initialData)?.map(item =>
                            <Form.Item
                                label={item.label}
                                name={item.name}
                                style={{ display: 'inline-block', width: '30%' }}
                            >
                                {!item.component ? <Input placeholder="请输入" /> : item.component}
                            </Form.Item>)
                    }
                    {
                        hasFormItems &&
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Form.Item>
                    }
                </Form>
            }
            <Table {...crateTableProps()} />
        </div>
    );
}

export default SearchPage;