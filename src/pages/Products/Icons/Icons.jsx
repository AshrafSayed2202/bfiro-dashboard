import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgGridTable from '../../../components/AgGridTable';
import Header from '../../../components/UI/Header';

const Icons = () => {
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
            { id: 1, date: '2023-01-05', name: 'Line Icons Pro', format: 'SVG', solds: 44, price: 29, status: 'active' },
            { id: 2, date: '2023-02-10', name: 'Filled Icons Set', format: 'SVG', solds: 12, price: 39, status: 'active' },
            { id: 3, date: '2023-03-22', name: 'Duotone Icons', format: 'React', solds: 28, price: 49, status: 'active' },
            { id: 4, date: '2023-04-18', name: '3D Icons Pack', format: 'PNG', solds: 0, price: 59, status: 'inactive' },
            { id: 5, date: '2023-05-30', name: 'Business Icons', format: 'SVG', solds: 19, price: 35, status: 'active' },
            { id: 6, date: '2023-07-14', name: 'Medical Icons', format: 'SVG', solds: 7, price: 45, status: 'inactive' },
            { id: 7, date: '2023-08-25', name: 'Weather Icons', format: 'Font', solds: 15, price: 25, status: 'active' },
            { id: 8, date: '2023-10-10', name: 'E-commerce Icons', format: 'SVG', solds: 31, price: 39, status: 'active' },
            { id: 9, date: '2023-11-05', name: 'Social Media Icons', format: 'PNG', solds: 9, price: 19, status: 'inactive' },
            { id: 10, date: '2024-01-15', name: 'Crypto & Finance Icons', format: 'SVG', solds: 52, price: 55, status: 'active' },
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
                    onClick={() => navigate(`/icons/${params.data.id}`)}
                >
                    details
                </span>
            ),
        },
    ];

    return (
        <div>
            <Header title="Icons" />
            <div className="mt-6 flex justify-between space-x-6">
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Icon Sets</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Active Icon Sets</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.active}</p>
                    <p className="text-sm text-gray-400 mt-1">Inactive: {stats.inactive}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Sold Items</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.sold}</p>
                    <p className="text-sm text-gray-400 mt-1">From {stats.soldFrom} icon sets</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Income</p>
                    <p className="text-4xl font-bold text-white mt-2">${stats.income}</p>
                </div>
            </div>

            <div className="mt-6 flex justify-start">
                <button
                    onClick={() => navigate('/icons/new')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                    Create New Icon Set
                </button>
            </div>

            <div className='mt-6 bg-[#171718CC] p-4 rounded-[20px]'>
                <div className="h-[450px]">
                    <AgGridTable
                        importedData={data}
                        tableName="icons"
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

export default Icons;