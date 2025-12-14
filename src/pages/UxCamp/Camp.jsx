import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AgGridTable from '../../components/AgGridTable';
import Header from '../../components/UI/Header';

const CampDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campData, setCampData] = useState({
        title: '',
        status: '',
        opening_date: '',
    });
    const [users, setUsers] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [isUserEdit, setIsUserEdit] = useState(false);
    const [isSessionEdit, setIsSessionEdit] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        user_id: '',
        name: '',
        email: '',
        enrollment_status: '',
        certificate: null,
        certificatePreview: null,
    });
    const [currentSession, setCurrentSession] = useState({
        session_id: '',
        starts_at: '',
        join_url: '',
        status: '',
    });

    const baseCertificateUrl = 'http://localhost/bfiro_backend/storage/certificates/';

    useEffect(() => {
        fetchCamp();
    }, [id]);

    const fetchCamp = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost/bfiro_backend/fetch/admin/uxCamp/uxCamp.php?id=${id}`);

            if (response.data.status !== 1) {
                throw new Error('API returned an error status');
            }

            const data = response.data.data || {};
            setCampData({
                title: data.title || '',
                status: data.status || '',
                opening_date: data.opening_date || '',
            });
            setUsers(data.enrolled_users || []);
            setSessions(data.sessions || []);
        } catch (error) {
            console.error('Error fetching camp:', error);
            alert('Failed to load camp. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCampInputChange = (e) => {
        const { name, value } = e.target;
        setCampData(prev => ({ ...prev, [name]: value }));
    };

    const handleCampSubmit = async () => {
        if (!campData.status || !campData.opening_date) {
            setError('Status and opening date are required');
            return;
        }
        setError(null);

        const payload = {
            id,
            status: campData.status,
            opening_date: campData.opening_date,
        };

        try {
            const response = await axios.post('http://localhost/bfiro_backend/actions/admin/uxCamp/edit.php', payload);

            if (response.data.status !== 1) {
                throw new Error(response.data.message || 'Failed to save');
            }

            alert('Camp updated successfully');
            fetchCamp();
        } catch (error) {
            console.error('Error saving camp:', error);
            setError(error.message || 'Failed to save. Please try again.');
        }
    };

    const isFinished = campData.status === 'finished';

    // User Modal Handlers
    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser(prev => ({ ...prev, [name]: value }));
    };

    const handleCertificateChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurrentUser(prev => ({
                ...prev,
                certificate: file,
                certificatePreview: URL.createObjectURL(file),
            }));
        }
    };

    const openUserModal = (user = null) => {
        if (user) {
            setIsUserEdit(true);
            setCurrentUser({
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                enrollment_status: user.enrollment_status,
                certificate: null,
                certificatePreview: user.certificate ? baseCertificateUrl + user.certificate : null,
            });
        } else {
            setIsUserEdit(false);
            setCurrentUser({
                user_id: '',
                name: '',
                email: '',
                enrollment_status: 'active',
                certificate: null,
                certificatePreview: null,
            });
        }
        setShowUserModal(true);
    };

    const handleUserSubmit = async () => {
        if (isUserEdit) {
            // Edit user
            const form = new FormData();
            form.append('id', id);
            form.append('user_id', currentUser.user_id);
            if (!isFinished) {
                form.append('status', currentUser.enrollment_status);
            }
            if (currentUser.certificate instanceof File) {
                form.append('certificate', currentUser.certificate);
            }

            try {
                const response = await axios.post('http://localhost/bfiro_backend/actions/admin/uxCamp/editUser.php', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.status !== 1) {
                    throw new Error(response.data.message || 'Failed to save');
                }

                setShowUserModal(false);
                fetchCamp();
            } catch (error) {
                console.error('Error saving user:', error);
                setError(error.message || 'Failed to save. Please try again.');
            }
        } else {
            // Add user
            const payload = {
                id,
                user_id: currentUser.user_id,
            };

            try {
                const response = await axios.post('http://localhost/bfiro_backend/actions/admin/uxCamp/addUser.php', payload);

                if (response.data.status !== 1) {
                    throw new Error(response.data.message || 'Failed to add');
                }

                setShowUserModal(false);
                fetchCamp();
            } catch (error) {
                console.error('Error adding user:', error);
                setError(error.message || 'Failed to add. Please try again.');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user from the camp?')) return;

        const payload = {
            id,
            user_id: userId,
        };

        try {
            const response = await axios.post('http://localhost/bfiro_backend/actions/admin/uxCamp/removeUser.php', payload);

            if (response.data.status !== 1) {
                throw new Error(response.data.message || 'Failed to delete');
            }

            fetchCamp();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete. Please try again.');
        }
    };

    // Session Modal Handlers
    const handleSessionInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentSession(prev => ({ ...prev, [name]: value }));
    };

    const openSessionModal = (session = null) => {
        if (session) {
            setIsSessionEdit(true);
            setCurrentSession({
                session_id: session.session_id,
                starts_at: session.starts_at,
                join_url: session.join_url,
                status: session.status,
            });
        } else {
            setIsSessionEdit(false);
            setCurrentSession({
                session_id: '',
                starts_at: '',
                join_url: '',
                status: 'scheduled',
            });
        }
        setShowSessionModal(true);
    };

    const handleSessionSubmit = async () => {
        if (!currentSession.starts_at || !currentSession.join_url || !currentSession.status) {
            setError('All fields are required');
            return;
        }
        setError(null);

        const payload = {
            id,
            starts_at: currentSession.starts_at,
            join_url: currentSession.join_url,
            status: currentSession.status,
        };
        var endpoint
        if (isSessionEdit) {
            payload.session_id = currentSession.session_id;
            endpoint = '/actions/admin/uxCamp/editSession.php';
        } else {
            endpoint = '/actions/admin/uxCamp/addSession.php';
        }

        try {
            const response = await axios.post(`http://localhost/bfiro_backend${endpoint}`, payload);

            if (response.data.status !== 1) {
                throw new Error(response.data.message || 'Failed to save');
            }

            setShowSessionModal(false);
            fetchCamp();
        } catch (error) {
            console.error('Error saving session:', error);
            setError(error.message || 'Failed to save. Please try again.');
        }
    };

    const handleDeleteSession = async (sessionId) => {
        if (!window.confirm('Are you sure you want to delete this session?')) return;

        const payload = {
            id,
            session_id: sessionId,
        };

        try {
            const response = await axios.post('http://localhost/bfiro_backend/actions/admin/uxCamp/removeSession.php', payload);

            if (response.data.status !== 1) {
                throw new Error(response.data.message || 'Failed to delete');
            }

            fetchCamp();
        } catch (error) {
            console.error('Error deleting session:', error);
            alert('Failed to delete. Please try again.');
        }
    };

    const userColDefs = [
        { field: 'user_id', headerName: 'User ID', width: 100 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'enrollment_status', headerName: 'Status', width: 120 },
        { field: 'enrolled_at', headerName: 'Enrolled At', flex: 1 },
        {
            field: 'certificate',
            headerName: 'Certificate',
            width: 150,
            cellRenderer: (params) => params.value ? (
                <a href={baseCertificateUrl + params.value} target="_blank" rel="noopener noreferrer" className="text-blue-500">View</a>
            ) : 'None'
        },
        {
            headerName: 'Actions',
            width: 150,
            cellRenderer: (params) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => openUserModal(params.data)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Edit
                    </button>
                    {!isFinished && (
                        <button
                            onClick={() => handleDeleteUser(params.data.user_id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )
        }
    ];

    const sessionColDefs = [
        { field: 'session_id', headerName: 'ID', width: 80 },
        { field: 'starts_at', headerName: 'Starts At', flex: 1 },
        { field: 'join_url', headerName: 'Join URL', flex: 1, cellRenderer: (params) => <a href={params.value} target="_blank" rel="noopener noreferrer" className="text-blue-500">Link</a> },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'created_at', headerName: 'Created At', flex: 1 },
        {
            headerName: 'Actions',
            width: 150,
            cellRenderer: (params) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => openSessionModal(params.data)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteSession(params.data.session_id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-white text-xl">Loading Camp...</div>
            </div>
        );
    }

    return (
        <div>
            <Header title={campData.title || 'Camp Details'} />

            {/* Camp Details Cards */}
            <div className="mt-6 flex flex-wrap gap-6">
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px]">
                    <p className="text-xl text-white mb-2">Status</p>
                    {isFinished ? (
                        <p className="text-2xl font-bold text-white">{campData.status}</p>
                    ) : (
                        <select
                            name="status"
                            value={campData.status}
                            onChange={handleCampInputChange}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        >
                            <option value="pending">Pending</option>
                            <option value="open">Open</option>
                            <option value="finished">Finished</option>
                        </select>
                    )}
                </div>
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px]">
                    <p className="text-xl text-white mb-2">Opening Date</p>
                    {isFinished ? (
                        <p className="text-2xl font-bold text-white">{campData.opening_date}</p>
                    ) : (
                        <input
                            type="date"
                            name="opening_date"
                            value={campData.opening_date}
                            onChange={handleCampInputChange}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />
                    )}
                </div>
            </div>

            {!isFinished && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleCampSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                        Save Camp Changes
                    </button>
                </div>
            )}

            {/* Users Section */}
            <div className="mt-8">
                <Header title="Camp Users" />
                {!isFinished && (
                    <div className="mt-4 flex justify-start">
                        <button
                            onClick={() => openUserModal()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                        >
                            Add New User
                        </button>
                    </div>
                )}
                <div className="mt-4 bg-[#171718CC] p-4 rounded-[20px]">
                    <div className="h-[400px]">
                        <AgGridTable
                            importedData={users}
                            tableName="campUsers"
                            colDefs={userColDefs}
                            selectible={true}
                            pdfExport={true}
                            csvExport={true}
                            colsManage={true}
                            roleNumber={65}
                        />
                    </div>
                </div>
            </div>

            {/* Sessions Section */}
            <div className="mt-8">
                <Header title="Lessons" />
                <div className="mt-4 flex justify-start">
                    <button
                        onClick={() => openSessionModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                        disabled={isFinished}
                    >
                        Add New Lesson
                    </button>
                </div>
                <div className="mt-4 bg-[#171718CC] p-4 rounded-[20px]">
                    <div className="h-[400px]">
                        <AgGridTable
                            importedData={sessions}
                            tableName="campSessions"
                            colDefs={sessionColDefs}
                            selectible={true}
                            pdfExport={true}
                            csvExport={true}
                            colsManage={true}
                            roleNumber={65}
                        />
                    </div>
                </div>
            </div>

            {/* User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#171718CC] p-8 rounded-[20px] w-96">
                        <h2 className="text-white text-2xl mb-4">{isUserEdit ? 'Edit User' : 'Add User'}</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {isUserEdit ? (
                            <>
                                <div className="mb-4">
                                    <label className="block text-white mb-1">Name</label>
                                    <p className="text-white">{currentUser.name}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-white mb-1">Email</label>
                                    <p className="text-white">{currentUser.email}</p>
                                </div>
                                {!isFinished && (
                                    <div className="mb-4">
                                        <label className="block text-white mb-1">Status</label>
                                        <select
                                            name="enrollment_status"
                                            value={currentUser.enrollment_status}
                                            onChange={handleUserInputChange}
                                            className="w-full p-2 rounded bg-gray-800 text-white"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                            <option value="canceled">Canceled</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                    </div>
                                )}
                                <div className="mb-4">
                                    <label className="block text-white mb-1">Certificate</label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,application/pdf"
                                        onChange={handleCertificateChange}
                                        className="w-full text-white"
                                    />
                                    {currentUser.certificatePreview && (
                                        <a href={currentUser.certificatePreview} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-500 block">View Current</a>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="mb-4">
                                <label className="block text-white mb-1">User ID</label>
                                <input
                                    type="number"
                                    name="user_id"
                                    value={currentUser.user_id}
                                    onChange={handleUserInputChange}
                                    className="w-full p-2 rounded bg-gray-800 text-white"
                                />
                            </div>
                        )}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUserSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                            {isUserEdit && !isFinished && (
                                <button
                                    onClick={() => {
                                        setShowUserModal(false);
                                        handleDeleteUser(currentUser.user_id);
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Session Modal */}
            {showSessionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#171718CC] p-8 rounded-[20px] w-96">
                        <h2 className="text-white text-2xl mb-4">{isSessionEdit ? 'Edit Lesson' : 'Add Lesson'}</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <div className="mb-4">
                            <label className="block text-white mb-1">Starts At</label>
                            <input
                                type="datetime-local"
                                name="starts_at"
                                value={currentSession.starts_at ? currentSession.starts_at.slice(0, 16) : ''}
                                onChange={handleSessionInputChange}
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-1">Join URL</label>
                            <input
                                type="url"
                                name="join_url"
                                value={currentSession.join_url}
                                onChange={handleSessionInputChange}
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-1">Status</label>
                            <select
                                name="status"
                                value={currentSession.status}
                                onChange={handleSessionInputChange}
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            >
                                <option value="scheduled">Scheduled</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                                <option value="canceled">Canceled</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowSessionModal(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSessionSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6 flex justify-start">
                <button
                    onClick={() => navigate('/ux-camp/status')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
                >
                    Back to List
                </button>
            </div>
        </div>
    );
};

export default CampDetails;