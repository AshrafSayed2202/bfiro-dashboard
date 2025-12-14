// Status.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AgGridTable from '../../components/AgGridTable';
import Header from '../../components/UI/Header';

const Status = () => {
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [stats, setStats] = useState({ totalCamps: 0, totalStudents: 0, totalIncome: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        status: '',
        opening_date: '',
    });
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCamps();
    }, []);

    const fetchCamps = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost/bfiro_backend/fetch/admin/uxCamp/uxCamps.php');

            if (response.data.status !== 1) {
                throw new Error('API returned an error status');
            }

            const camps = response.data.data || [];

            const transformedData = camps.map(camp => ({
                id: camp.id,
                status: camp.status,
                opening_date: camp.opening_date,
                created_at: camp.created_at,
                updated_at: camp.updated_at,
                enrolled_count: camp.enrolled_count,
                graduated_count: camp.graduated_count,
                total_income: camp.total_income
            }));

            const totalCamps = transformedData.length;
            const totalStudents = transformedData.reduce((sum, d) => sum + d.enrolled_count, 0);
            const totalIncome = transformedData.reduce((sum, d) => sum + d.total_income, 0);

            setData(transformedData);
            setStats({ totalCamps, totalStudents, totalIncome });
        } catch (error) {
            console.error('Error fetching camps:', error);
            alert('Failed to load camps. Please try again.');
            setData([]);
            setStats({ totalCamps: 0, totalStudents: 0, totalIncome: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.status || !formData.opening_date) {
            setError('Status and opening date are required');
            return;
        }
        setError(null);

        const form = new FormData();
        form.append('status', formData.status);
        form.append('opening_date', formData.opening_date);

        try {
            const response = await axios.post(`http://localhost/bfiro_backend/actions/admin/uxCamp/add.php`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status !== 1) {
                throw new Error(response.data.message || 'Failed to save');
            }

            setShowModal(false);
            resetForm();
            fetchCamps();
        } catch (error) {
            console.error('Error saving camp:', error);
            setError(error.message || 'Failed to save. Please try again.');
        }
    };

    const handleAction = (id) => {
        navigate(`/ux-camp/status/${id}`);
    };

    const resetForm = () => {
        setFormData({
            status: '',
            opening_date: '',
        });
        setError(null);
    };

    const colDefs = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'opening_date', headerName: 'Opening Date', width: 150 },
        { field: 'enrolled_count', headerName: 'Enrolled', width: 120 },
        { field: 'graduated_count', headerName: 'Graduated', width: 120 },
        { field: 'total_income', headerName: 'Total Income', width: 150 },
        { field: 'created_at', headerName: 'Created At', flex: 1 },
        { field: 'updated_at', headerName: 'Updated At', flex: 1 },
        {
            headerName: 'Actions',
            width: 200,
            cellRenderer: (params) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleAction(params.data.id)}
                        className={`${params.data.status === 'finished' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-3 py-1 rounded text-sm`}
                    >
                        {params.data.status === 'finished' ? 'Details' : 'Edit'}
                    </button>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-white text-xl">Loading Camps...</div>
            </div>
        );
    }

    return (
        <div>
            <Header title="Status" />

            {/* Stats Cards */}
            <div className="mt-6 flex flex-wrap gap-6">
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
                    <p className="text-xl text-white">Total Camps</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.totalCamps}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
                    <p className="text-xl text-white">Total Students</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.totalStudents}</p>
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
                    <p className="text-xl text-white">Total Income</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.totalIncome}</p>
                </div>
            </div>

            {/* Add Button */}
            <div className="mt-6 flex justify-start">
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
                >
                    Add New Camp
                </button>
            </div>

            {/* Modal for Add */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#171718CC] p-8 rounded-[20px] w-96">
                        <h2 className="text-white text-2xl mb-4">Add Camp</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <div className="mb-4">
                            <label className="block text-white mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            >
                                <option value="">Select Status</option>
                                <option value="finished">Finished</option>
                                <option value="open">Open</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-1">Opening Date</label>
                            <input
                                type="date"
                                name="opening_date"
                                value={formData.opening_date}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="mt-6 bg-[#171718CC] p-4 rounded-[20px]">
                <div className="h-[650px]">
                    <AgGridTable
                        importedData={data}
                        tableName="status"
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

export default Status;