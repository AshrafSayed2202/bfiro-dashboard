import { useState, useEffect } from 'react';
import AgGridTable from '../AgGridTable';

const mockData = [
    { id: 1, name: 'Font Family 1', price: 19, description: 'Description 1' },
    // Add more
];

const colDefs = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'price', headerName: 'Price' },
    { field: 'description', headerName: 'Description' },
];

const Fonts = () => {
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        setData(mockData);
    }, []);

    return (
        <div>
            <h1 className="text-2xl mb-4">Fonts</h1>
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
    );
};

export default Fonts;