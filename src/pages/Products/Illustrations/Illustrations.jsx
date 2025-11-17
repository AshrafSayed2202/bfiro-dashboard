import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgGridTable from '../../../components/AgGridTable';
import Header from '../../../components/UI/Header';

const Illustrations = () => {
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
            { id: 1, date: '2023-01-10', name: 'Abstract Shapes Pack', format: 'SVG', solds: 22, price: 59, status: 'active' },
            { id: 2, date: '2023-02-20', name: 'Character Illustrations', format: 'AI', solds: 8, price: 79, status: 'inactive' },
            { id: 3, date: '2023-03-15', name: 'Nature & Landscape', format: 'PNG', solds: 35, price: 69, status: 'active' },
            { id: 4, date: '2023-04-05', name: 'Business People Pack', format: 'EPS', solds: 0, price: 89, status: 'active' },
            { id: 5, date: '2023-05-12', name: 'Food & Drinks', format: 'SVG', solds: 18, price: 55, status: 'inactive' },
            { id: 6, date: '2023-06-25', name: 'Technology Illustrations', format: 'AI', solds: 12, price: 75, status: 'active' },
            { id: 7, date: '2023-08-18', name: 'Animal Kingdom Pack', format: 'PNG', solds: 5, price: 65, status: 'active' },
            { id: 8, date: '2023-09-30', name: 'Holiday Seasons', format: 'SVG', solds: 14, price: 59, status: 'inactive' },
            { id: 9, date: '2023-11-11', name: 'Minimal Line Art', format: 'EPS', solds: 9, price: 49, status: 'active' },
            { id: 10, date: '2024-01-20', name: '3D Isometric Pack', format: 'PNG', solds: 41, price: 99, status: 'active' },
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
                    onClick={() => navigate(`/illustrations/${params.data.id}`)}
                >
                    details
                </span>
            ),
        },
    ];

    return (
        <div>
            <Header title="Illustrations" />
            <div className="mt-6 flex justify-between space-x-6">
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Illustrations</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Active Illustrations</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.active}</p>
                    <p className="text-sm text-gray-400 mt-1">Inactive: {stats.inactive}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Sold Items</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.sold}</p>
                    <p className="text-sm text-gray-400 mt-1">From {stats.soldFrom} illustrations</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Income</p>
                    <p className="text-4xl font-bold text-white mt-2">${stats.income}</p>
                </div>
            </div>

            <div className="mt-6 flex justify-start">
                <button
                    onClick={() => navigate('/illustrations/new')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                    Create New Illustration
                </button>
            </div>

            <div className='mt-6 bg-[#171718CC] p-4 rounded-[20px]'>
                <div className="h-[450px]">
                    <AgGridTable
                        importedData={data}
                        tableName="illustrations"
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

export default Illustrations;