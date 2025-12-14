import { useState, useEffect } from 'react';
import axios from 'axios';
import AgGridTable from '../../components/AgGridTable';
import Header from '../../components/UI/Header';

const OurTeam = () => {
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [stats, setStats] = useState({ total: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        description: '',
        image: null,
        image_url: null
    });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);

    const baseUrl = 'http://localhost/bfiro_backend/storage/teams/';

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost/bfiro_backend/fetch/admin/team/members.php');

            if (response.data.status !== 1) {
                throw new Error('API returned an error status');
            }

            const members = response.data.members || [];

            const transformedData = members.map(member => ({
                id: member.id,
                name: member.name,
                title: member.title,
                description: member.description,
                imageUrl: member.image ? baseUrl + member.image : null
            }));

            setData(transformedData);
            setStats({ total: response.data.total || 0 });
        } catch (error) {
            console.error('Error fetching team members:', error);
            alert('Failed to load team members. Please try again.');
            setData([]);
            setStats({ total: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.title) {
            setError('Name and title are required');
            return;
        }
        if (!isEdit && !formData.image) {
            setError('Image is required for new members');
            return;
        }
        setError(null);

        const endpoint = isEdit ? '/actions/admin/team/edit.php' : '/actions/admin/team/add.php';
        const form = new FormData();
        form.append('name', formData.name);
        form.append('title', formData.title);
        form.append('description', formData.description);
        if (isEdit) {
            form.append('id', currentId);
        }
        if (formData.image instanceof File) {
            form.append('image', formData.image);
        }

        try {
            const response = await axios.post(`http://localhost/bfiro_backend${endpoint}`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status !== 1) {
                throw new Error(response.data.message || 'Failed to save');
            }

            setShowModal(false);
            resetForm();
            fetchTeamMembers();
        } catch (error) {
            console.error('Error saving team member:', error);
            setError(error.message || 'Failed to save. Please try again.');
        }
    };

    const handleEdit = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost/bfiro_backend/fetch/admin/team/member.php?id=${id}`);

            if (response.data.status !== 1) {
                throw new Error('Failed to fetch member');
            }

            const member = response.data.member;
            setFormData({
                name: member.name,
                title: member.title,
                description: member.description || '',
                image: null,
                image_url: member.image_url
            });
            setPreview(member.image_url);
            setIsEdit(true);
            setCurrentId(id);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching member for edit:', error);
            alert('Failed to load member details.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this team member?')) {
            return;
        }

        try {
            const response = await axios.post('http://localhost/bfiro_backend/actions/admin/team/delete.php', { id });

            if (response.data.status !== 1) {
                throw new Error('Failed to delete');
            }

            fetchTeamMembers();
        } catch (error) {
            console.error('Error deleting team member:', error);
            alert('Failed to delete. Please try again.');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            title: '',
            description: '',
            image: null,
            image_url: null
        });
        setPreview(null);
        setIsEdit(false);
        setCurrentId(null);
        setError(null);
    };

    const colDefs = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'description', headerName: 'Description', flex: 1 },
        {
            field: 'imageUrl',
            headerName: 'Photo',
            width: 150,
            cellRenderer: (params) => params.value ? (
                <img src={params.value} alt="Team member" className="h-10 w-10 object-cover rounded" />
            ) : 'No photo'
        },
        {
            headerName: 'Actions',
            width: 200,
            cellRenderer: (params) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(params.data.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(params.data.id)}
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
                <div className="text-white text-xl">Loading Team Members...</div>
            </div>
        );
    }

    return (
        <div>
            <Header title="Our Team" />

            {/* Stats Cards */}
            <div className="mt-6 flex flex-wrap gap-6">
                <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
                    <p className="text-xl text-white">Total Members</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
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
                    Add New Member
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#171718CC] p-8 rounded-[20px] w-96">
                        <h2 className="text-white text-2xl mb-4">{isEdit ? 'Edit' : 'Add'} Team Member</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
                        />
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full mb-4 p-2 rounded bg-gray-800 text-white h-32"
                        />
                        <div className="mb-4">
                            <label className="block text-white mb-1">Photo</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileChange}
                                className="w-full text-white"
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mt-2 h-20 w-20 object-cover rounded"
                                />
                            )}
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
                        tableName="ourTeam"
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

export default OurTeam;