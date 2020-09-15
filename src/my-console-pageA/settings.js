
export const searchPage = {
    createFormItems: (data = []) => {
        return [
            {
                label: '用户名称',
                name: 'username',
            },
            {
                label: '密码',
                name: 'password'
            },
            {
                label: '邮箱',
                name: 'email'
            },
            {
                label: '手机',
                name: 'phone'
            },
        ]
    },
    columns: () => [
        {
            title: '用户名称',
            dataIndex: 'username'
        },
        {
            title: '邮箱',
            dataIndex: 'email'
        },
        {
            title: '手机',
            dataIndex: 'phone'
        },
    ],
    columnsWithOperate: {
        detailPath: '/my-console-pageA',
        // delRecord: {
        //     fn: accountService.delAccount,
        //     params: ['uuid']
        // }
    },
    // initService: [
    //     () => institutionService.getInstitutionList({ pageNum: 0, pageSize: 100 }),
    // ],
    getListFn: ()=>{},
    extraBtn: [
        {
            text: '创建账户',
            toPath: '/prodtrack-account/create'
        }
    ]
}

export default {
    searchPage
}

