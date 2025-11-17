import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgGridTable from '../../../components/AgGridTable';
import Header from '../../../components/UI/Header';

const Fonts = () => {
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
            { id: 1, date: '2023-01-08', name: 'Neue Montreal', format: 'Variable', solds: 38, price: 19, status: 'active' },
            { id: 2, date: '2023-02-18', name: 'Satoshi Pro', format: 'OTF', solds: 15, price: 29, status: 'active' },
            { id: 3, date: '2023-03-25', name: 'Clash Display', format: 'Variable', solds: 0, price: 49, status: 'inactive' },
            { id: 4, date: '2023-04-12', name: 'Monaspace Family', format: 'TTF', solds: 21, price: 39, status: 'active' },
            { id: 5, date: '2023-06-20', name: 'Grotesk Modern', format: 'Variable', solds: 9, price: 25, status: 'inactive' },
            { id: 6, date: '2023-07-30', name: 'PP Mori', format: 'OTF', solds: 27, price: 45, status: 'active' },
            { id: 7, date: '2023-09-10', name: 'Cabinet Grotesk', format: 'Variable', solds: 11, price: 19, status: 'active' },
            { id: 8, date: '2023-10-22', name: 'Aeonik Pro', format: 'OTF', solds: 6, price: 35, status: 'inactive' },
            { id: 9, date: '2023-12-05', name: 'Obviously', format: 'Variable', solds: 18, price: 59, status: 'active' },
            { id: 10, date: '2024-02-15', name: 'General Sans', format: 'TTF', solds: 44, price: 29, status: 'active' },
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
                    onClick={() => navigate(`/fonts/${params.data.id}`)}
                >
                    details
                </span>
            ),
        },
    ];

    return (
        <div>
            <Header title="Fonts" />
            <div className="mt-6 flex justify-between space-x-6">
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Font Families</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Active Font Families</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.active}</p>
                    <p className="text-sm text-gray-400 mt-1">Inactive: {stats.inactive}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px flex-1 text-center">
                    <p className="text-xl text-white">Total Sold Items</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.sold}</p>
                    <p className="text-sm text-gray-400 mt-1">From {stats.soldFrom} font families</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Income</p>
                    <p className="text-4xl font-bold text-white mt-2">${stats.income}</p>
                </div>
            </div>

            <div className="mt-6 flex justify-start">
                <button
                    onClick={() => navigate('/fonts/new')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                    Create New Font Family
                </button>
            </div>

            <div className='mt-6 bg-[#171718CC] p-4 rounded-[20px]'>
                <div className="h-[450px]">
                    <AgGridTable
                        importedData={data}
                        tableName="fonts"
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

export default Fonts;