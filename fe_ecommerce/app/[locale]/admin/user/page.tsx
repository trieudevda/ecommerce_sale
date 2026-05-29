"use client"
import React from 'react';
import {Button, Flex, notification, Table, TableProps, Typography,} from 'antd';
import {requestApi} from "@/components/api/be.api";
import {getListUserColumns} from "@/components/templates/admin/user/listColumn";
import {useRouter} from 'next/navigation';
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import AdminBreadcrumb from "@/components/templates/admin/breadcrumb/breadcrumb";
import {useTranslations} from "use-intl";
import {ADMIN_PATHS} from "@/src/path";
import LoadingPage from "@/src/custom/loading-page/loading-page";
import {User} from "@/src/interface/user.interface";
import {ColumnsType} from "antd/es/table";

const App: React.FC = () => {
    const router = useRouter();
    const t = useTranslations("User.List");
    const tTable = useTranslations("User.Table");
    const [user1,setUser] = React.useState<User[]>([])
    const [messageApi, contextHolder] = notification.useNotification();
    const [isLoading, setIsLoading] = React.useState(true);
    const tMess = useTranslations("Message");
    const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
    const onChange: TableProps<User>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data: HandleResponse<User[]> = await requestApi('user/find-all', { method: 'GET' });
                if( data.statusCode === 403 ){
                    messageApi.error({title:tMess('Title.role'),description: tMess('Description.You_are_not_authorized_to_do_this'),
                        placement: 'bottomRight',});
                    return;
                }
                setUser(data.data);
            } catch (error) {
                messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    },[]);
    const handleEdit = (id: string)=>{
        router.push(ADMIN_PATHS.USER.EDIT(id));
    }
    const handleDelete = async (id: string)=>{
        const data: HandleResponse<User> = await requestApi('user/' + id, { method: 'DELETE' });
        if(data?.statusCode && data.statusCode >= 400)
            messageApi.error({title: tMess('Title.fail'),description: tMess('Description.data_delete_fail'),
            placement: 'bottomRight',});
        else if(data) {
            messageApi.success({
                title: tMess('Title.success'), description: tMess('Description.data_delete_successfully'),
                placement: 'bottomRight',
            });
            setUser((prevData) => prevData.filter(user => user.id !== id));
        }
    }
    const handleCreate = ()=>{
        router.push(ADMIN_PATHS.USER.CREATE());
    }
    const columns: ColumnsType<User> = getListUserColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        t: tTable
    });
    if (isLoading) {
        return <LoadingPage />;
    }
    return <>
        {contextHolder}
        <div>
            <Flex gap={'small'} wrap={false}>
                <Typography.Title level={3}>{t('title')}</Typography.Title>
                {
                    user.role === 'superAdmin'
                        ? <Button type="primary" onClick={handleCreate}>{t('create')}</Button>
                        : <></>
                }
            </Flex>
            <AdminBreadcrumb/>
            <Table<User> rowKey="id" columns={columns} dataSource={user1} onChange={onChange}/>
        </div>
        </>

};

export default App;