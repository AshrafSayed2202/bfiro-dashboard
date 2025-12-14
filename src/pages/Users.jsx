import { useState, useEffect } from 'react';
import axios from 'axios';
import AgGridTable from '../components/AgGridTable';
import Header from '../components/UI/Header';

const Users = () => {
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        totalSpending: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost/bfiro_backend/fetch/admin/selections/users.php');

            if (response.data.status !== 1) {
                throw new Error('API returned an error status');
            }

            const users = response.data.users || [];

            const transformedData = users.map(user => ({
                id: user.id,
                date: user.created_at ? user.created_at.split(' ')[0] : 'N/A',
                name: user.name,
                email: user.email,
                status: user.status === 1 ? 'active' : 'inactive',
                spending: parseFloat(user.spending) || 0
            }));

            setData(transformedData);

            const total = response.data.total || users.length;
            const active = transformedData.filter(d => d.status === 'active').length;
            const inactive = total - active;
            const totalSpending = transformedData.reduce((sum, d) => sum + d.spending, 0);

            setStats({ total, active, inactive, totalSpending });
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to load users. Please try again.');
            setData([]);
            setStats({ total: 0, active: 0, inactive: 0, totalSpending: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatusNum = currentStatus === 'active' ? 0 : 1;
        try {
            const response = await axios.post('http://localhost/bfiro_backend/actions/admin/users/editStatus.php', {
                id: userId,
                status: newStatusNum
            });

            if (response.data.status !== 1) {
                throw new Error(response.data.message || 'Failed to update status');
            }

            fetchUsers();
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const colDefs = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'date', headerName: 'Date', width: 120 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        {
            field: 'status',
            headerName: 'Status',
            width: 110,
            cellRenderer: (params) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${params.value === 'active'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-gray-700 text-gray-300'
                    }`}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'spending',
            headerName: 'Spending',
            width: 140,
            valueFormatter: params => `$${params.value.toFixed(2)}`
        },
        {
            headerName: 'Actions',
            width: 150,
            cellRenderer: (params) => (
                <button
                    className={`px-4 py-1 rounded text-white ${params.data.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    onClick={() => handleToggleStatus(params.data.id, params.data.status)}
                >
                    {params.data.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-white text-xl">Loading Users...</div>
            </div>
        );
    }

    return (
        <div>
            <Header title="Users" />

            {/* Stats Cards */}
            <div className="mt-6 flex flex-wrap gap-6">
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
                    <p className="text-xl text-white">Total Users</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
                    <p className="text-xl text-white">Active Users</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.active}</p>
                    <p className="text-sm text-gray-400 mt-1">Inactive: {stats.inactive}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
                    <p className="text-xl text-white">Total Spending</p>
                    <p className="text-4xl font-bold text-white mt-2">${stats.totalSpending.toFixed(2)}</p>
                </div>
            </div>

            {/* Table */}
            <div className="mt-6 bg-[#171718CC] p-4 rounded-[20px]">
                <div className="h-[650px]">
                    <AgGridTable
                        importedData={data}
                        tableName="users"
                        colDefs={colDefs}
                        selectible={true}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        pdfExport={true}
                        csvExport={true}
                        colsManage={true}
                        roleNumber={65}
                    />
                </div>
            </div>
        </div>
    );
};

export default Users;