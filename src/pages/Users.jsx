import { useState, useEffect } from 'react';
import AgGridTable from '../components/AgGridTable';
import Header from '../components/UI/Header';

const mockData = [
    { id: 1, name: 'User 1', email: 'user1@example.com', role: 'Admin' },
    // Add more
];

const colDefs = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'role', headerName: 'Role' },
];

const Users = () => {
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        setData(mockData);
    }, []);

    return (
        <div>
            <Header title="Users" />
            {/* <AgGridTable
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
            /> */}
        </div>
    );
};

export default Users;