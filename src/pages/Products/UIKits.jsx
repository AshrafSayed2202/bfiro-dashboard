import { useState, useEffect } from 'react';
import AgGridTable from '../../components/AgGridTable';
import Header from '../../components/UI/Header';


const mockData = [
    { id: 1, name: 'UI Kit 1', price: 99, description: 'Description 1' },
    // Add more mock rows
];

const colDefs = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'price', headerName: 'Price' },
    { field: 'description', headerName: 'Description' },
];

const UIKits = () => {
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        // Placeholder fetch: const response = await fetch('/api/ui-kits'); setData(response.data);
        setData(mockData);
    }, []);

    return (
        <div>
            <Header title="UI Kits" />
            <div className='mt-6 bg-[#171718CC] p-4 rounded-[20px]'>
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
                    roleNumber={65} // Admin role
                // reloadEndpoint="/api/ui-kits" // Uncomment for real endpoint
                />
            </div>
        </div>
    );
};

export default UIKits;