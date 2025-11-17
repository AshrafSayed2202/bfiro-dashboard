import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgGridTable from '../../../components/AgGridTable';
import Header from '../../../components/UI/Header';

const Code = () => {
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
            { id: 1, date: '2023-01-12', name: 'Admin Dashboard Template', format: 'React', solds: 37, price: 99, status: 'active' },
            { id: 2, date: '2023-02-25', name: 'E-commerce Frontend', format: 'Next.js', solds: 18, price: 129, status: 'active' },
            { id: 3, date: '2023-04-08', name: 'Landing Page Kit', format: 'HTML/CSS', solds: 29, price: 79, status: 'active' },
            { id: 4, date: '2023-05-20', name: 'Auth System + UI', format: 'Vue', solds: 0, price: 149, status: 'inactive' },
            { id: 5, date: '2023-06-30', name: 'SaaS Dashboard', format: 'React + Tailwind', solds: 22, price: 119, status: 'active' },
            { id: 6, date: '2023-08-15', name: 'Mobile App UI Code', format: 'React Native', solds: 11, price: 199, status: 'active' },
            { id: 7, date: '2023-09-28', name: 'Portfolio Template', format: 'HTML/CSS/JS', solds: 8, price: 59, status: 'inactive' },
            { id: 8, date: '2023-11-10', name: 'Blog Theme', format: 'Next.js', solds: 14, price: 89, status: 'active' },
            { id: 9, date: '2023-12-20', name: 'Crypto Dashboard', format: 'React', solds: 5, price: 159, status: 'inactive' },
            { id: 10, date: '2024-02-10', name: 'Full Stack Starter', format: 'Next.js + Supabase', solds: 41, price: 199, status: 'active' },
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
        { field: 'format', headerName: 'Framework' }, // changed to Framework for code section
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
                    onClick={() => navigate(`/code/${params.data.id}`)}
                >
                    details
                </span>
            ),
        },
    ];

    return (
        <div>
            <Header title="Code" />
            <div className="mt-6 flex justify-between space-x-6">
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Code Snippets</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Active Code Snippets</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.active}</p>
                    <p className="text-sm text-gray-400 mt-1">Inactive: {stats.inactive}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Sold Items</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.sold}</p>
                    <p className="text-sm text-gray-400 mt-1">From {stats.soldFrom} code snippets</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 text-center">
                    <p className="text-xl text-white">Total Income</p>
                    <p className="text-4xl font-bold text-white mt-2">${stats.income}</p>
                </div>
            </div>

            <div className="mt-6 flex justify-start">
                <button
                    onClick={() => navigate('/code/new')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                    Create New Code Snippet
                </button>
            </div>

            <div className='mt-6 bg-[#171718CC] p-4 rounded-[20px]'>
                <div className="h-[450px]">
                    <AgGridTable
                        importedData={data}
                        tableName="code"
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

export default Code; // changed component name to Code for clarity