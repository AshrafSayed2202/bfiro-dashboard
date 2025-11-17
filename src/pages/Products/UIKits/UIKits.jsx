import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgGridTable from '../../../components/AgGridTable';
import Header from '../../../components/UI/Header';

const UIKits = () => {
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        sold: 0,
        soldFrom: 0,
        income: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const mockData = [
            { id: 1, date: '2023-01-01', name: 'UI Kit 1', format: 'PSD', solds: 10, price: 99, status: 'active' },
            { id: 2, date: '2023-02-15', name: 'UI Kit 2', format: 'Figma', solds: 5, price: 149, status: 'inactive' },
            { id: 3, date: '2023-03-20', name: 'UI Kit 3', format: 'Sketch', solds: 20, price: 79, status: 'active' },
            { id: 4, date: '2023-04-10', name: 'UI Kit 4', format: 'XD', solds: 0, price: 199, status: 'active' },
            { id: 5, date: '2023-05-05', name: 'UI Kit 5', format: 'PSD', solds: 15, price: 89, status: 'inactive' },
            { id: 6, date: '2023-06-18', name: 'UI Kit 6', format: 'Figma', solds: 8, price: 129, status: 'active' },
            { id: 7, date: '2023-07-22', name: 'UI Kit 7', format: 'Sketch', solds: 3, price: 99, status: 'active' },
            { id: 8, date: '2023-08-30', name: 'UI Kit 8', format: 'XD', solds: 12, price: 159, status: 'inactive' },
            { id: 9, date: '2023-09-14', name: 'UI Kit 9', format: 'PSD', solds: 7, price: 109, status: 'active' },
            { id: 10, date: '2023-10-25', name: 'UI Kit 10', format: 'Figma', solds: 25, price: 69, status: 'active' },
        ];
        setData(mockData);

        const total = mockData.length;
        const active = mockData.filter(d => d.status === 'active').length;
        const inactive = total - active;
        const sold = mockData.reduce((sum, d) => sum + d.solds, 0);
        const soldFrom = mockData.filter(d => d.solds > 0).length;
        const income = mockData.reduce((sum, d) => sum + (d.solds * d.price), 0);

        setStats({ total, active, inactive, sold, soldFrom, income });
    }, []);

    const colDefs = [
        { headerName: '', checkboxSelection: true, headerCheckboxSelection: true, width: 50 },
        { field: 'id', headerName: 'ID' },
        { field: 'date', headerName: 'Date' },
        { field: 'name', headerName: 'Name' },
        { field: 'format', headerName: 'Format' },
        { field: 'solds', headerName: 'Solds Number' },
        { field: 'price', headerName: 'Price' },
        {
            headerName: 'Total Income',
            valueGetter: (params) => params.data.solds * params.data.price,
        },
        { field: 'status', headerName: 'Status' },
        {
            headerName: 'Activities',
            cellRenderer: (params) => (
                <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate(`/ui-kits/${params.data.id}`)}
                >
                    details
                </span>
            ),
        },
    ];

    return (
        <div>
            <Header title="UI Kits" />

            {/* Stats Cards - Modern & Consistent Design */}
            <div className="mt-6 flex justify-between space-x-6">
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Templates</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Active Templates</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.active}</p>
                    <p className="text-sm text-gray-400 mt-1">Inactive: {stats.inactive}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Sold Items</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.sold}</p>
                    <p className="text-sm text-gray-400 mt-1">From {stats.soldFrom} templates</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Income</p>
                    <p className="text-4xl font-bold text-white mt-2">${stats.income}</p>
                </div>
            </div>

            {/* Create Button */}
            <div className="mt-6 flex justify-start">
                <button
                    onClick={() => navigate('/ui-kits/new')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
                >
                    Create New UI Kit
                </button>
            </div>

            {/* Table Container */}
            <div className="mt-6 bg-[#171718CC] p-4 rounded-[20px]">
                <div className="h-[450px]">
                    <AgGridTable
                        importedData={data}
                        tableName="uiKits"
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

export default UIKits;