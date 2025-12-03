import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/UI/Header';

const CreateIcons = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [overview, setOverview] = useState('');
    const [points, setPoints] = useState(['', '', '', '', '', '']);
    const [formats, setFormats] = useState([]);
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('active');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    const [templateFile, setTemplateFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [cover, setCover] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [previewPhoto, setPreviewPhoto] = useState(null);

    const [saving, setSaving] = useState(false);

    const formatOptions = ['SVG', 'PNG', 'React Component', 'Font', 'Figma', 'Sketch'];

    const handlePointsChange = (index, value) => {
        const newPoints = [...points];
        newPoints[index] = value;
        setPoints(newPoints);
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (saving || !title.trim()) {
            alert('Title is required.');
            return;
        }
        setSaving(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('subtitle', subtitle);
            formData.append('overview', overview);
            formData.append('highlights', JSON.stringify(points.filter(p => p.trim())));
            formData.append('formats', formats.join(','));
            formData.append('price', price);
            formData.append('status', status);
            formData.append('labels', tags.join(','));
            formData.append('type', 'Icons'); // Fixed type

            if (templateFile) formData.append('template_file', templateFile);
            if (thumbnail) formData.append('thumbnail', thumbnail);
            if (cover) formData.append('cover', cover);
            if (previewPhoto) formData.append('preview_photo', previewPhoto);
            gallery.forEach((file, i) => formData.append(`gallery[${i}]`, file));

            await axios.post('http://localhost/bfiro_backend/actions/products/createProduct.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Icons created successfully!');
            navigate('/icons');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create Icons. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <Header title="Create New Icons" />

            <div className="mt-8 bg-[#171718CC] p-8 rounded-[20px] max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold text-white mb-8">Upload Assets</h2>

                {/* Template File */}
                <div className="mb-8">
                    <label className="block text-white text-lg mb-3">Template File (ZIP)</label>
                    <input
                        type="file"
                        accept=".zip,.rar,.7z"
                        onChange={(e) => setTemplateFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    {templateFile && <p className="mt-2 text-gray-400">Selected: {templateFile.name}</p>}
                </div>

                {/* Thumbnail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <label className="block text-white text-lg mb-3">Thumbnail (356x256 recommended)</label>
                        <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white" />
                        {thumbnail && (
                            <img src={URL.createObjectURL(thumbnail)} alt="thumb" className="mt-4 max-h-48 rounded-lg" />
                        )}
                    </div>

                    {/* Cover */}
                    <div>
                        <label className="block text-white text-lg mb-3">Cover Photo (1920x440 recommended)</label>
                        <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])} className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white" />
                        {cover && (
                            <img src={URL.createObjectURL(cover)} alt="cover" className="mt-4 max-h-48 rounded-lg" />
                        )}
                    </div>
                </div>

                {/* Gallery */}
                <div className="mb-8">
                    <label className="block text-white text-lg mb-3">Gallery Photos (803x628 recommended, multiple)</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setGallery(Array.from(e.target.files))}
                        className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white"
                    />
                    {gallery.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                            {gallery.map((file, i) => (
                                <img key={i} src={URL.createObjectURL(file)} alt={`gallery ${i}`} className="rounded-lg w-full h-48 object-cover" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Preview Photo */}
                <div className="mb-8">
                    <label className="block text-white text-lg mb-3">Preview Photo (max 3MB)</label>
                    <input type="file" accept="image/*" onChange={(e) => setPreviewPhoto(e.target.files[0])} className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white" />
                    {previewPhoto && (
                        <img src={URL.createObjectURL(previewPhoto)} alt="preview" className="mt-4 max-h-64 rounded-lg" />
                    )}
                </div>

                <hr className="border-gray-700 my-10" />

                {/* Basic Details */}
                <h2 className="text-2xl font-semibold text-white mb-8">Basic Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <label className="block text-white mb-2">Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Dashboard Icons Set"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-2">Subtitle</label>
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Short tagline"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-white mb-2">Overview</label>
                    <textarea
                        value={overview}
                        onChange={(e) => setOverview(e.target.value)}
                        rows={6}
                        className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Full description of the template..."
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-white text-lg mb-4">Highlights</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {points.map((point, i) => (
                            <div key={i}>
                                <label className="text-gray-400 text-sm">Point {i + 1}</label>
                                <input
                                    type="text"
                                    value={point}
                                    onChange={(e) => handlePointsChange(i, e.target.value)}
                                    className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Highlight point ${i + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <label className="block text-white mb-2">Format (multi-select)</label>
                        <select
                            multiple
                            value={formats}
                            onChange={(e) => setFormats(Array.from(e.target.selectedOptions, o => o.value))}
                            className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg h-32"
                        >
                            {formatOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-white mb-2">Price ($)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="99"
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Tags */}
                <div className="mb-10">
                    <label className="block text-white mb-2">Tags (press Enter)</label>
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type tag and press Enter..."
                    />
                    <div className="flex flex-wrap gap-3 mt-4">
                        {tags.map((tag, i) => (
                            <span key={i} className="bg-blue-600 text-white px-4 py-1 rounded-full flex items-center gap-2 text-sm">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(i)}
                                    className="ml-2 hover:text-gray-300"
                                >×</button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 justify-end">
                    <button
                        onClick={() => navigate('/icons')}
                        disabled={saving}
                        className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Icons'}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default CreateIcons;