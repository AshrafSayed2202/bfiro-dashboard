/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/UI/Header';

const EditCodes = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);

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

    const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState('');
    const [currentCoverUrl, setCurrentCoverUrl] = useState('');
    const [currentGalleryUrls, setCurrentGalleryUrls] = useState([]);
    const [currentPreviewPhotoUrl, setCurrentPreviewPhotoUrl] = useState('');
    const [currentTemplateFileName, setCurrentTemplateFileName] = useState('');

    const [date, setDate] = useState('');
    const [solds, setSolds] = useState(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const mockData = [
        { id: 1, date: '2023-01-01', name: 'Code 1', format: 'PSD', solds: 10, price: 99, status: 'active' },
        { id: 2, date: '2023-02-15', name: 'Code 2', format: 'Figma', solds: 5, price: 149, status: 'inactive' },
        { id: 3, date: '2023-03-20', name: 'Code 3', format: 'Sketch', solds: 20, price: 79, status: 'active' },
        { id: 4, date: '2023-04-10', name: 'Code 4', format: 'XD', solds: 0, price: 199, status: 'active' },
        { id: 5, date: '2023-05-05', name: 'Code 5', format: 'PSD', solds: 15, price: 89, status: 'inactive' },
        { id: 6, date: '2023-06-18', name: 'Code 6', format: 'Figma', solds: 8, price: 129, status: 'active' },
        { id: 7, date: '2023-07-22', name: 'Code 7', format: 'Sketch', solds: 3, price: 99, status: 'active' },
        { id: 8, date: '2023-08-30', name: 'Code 8', format: 'XD', solds: 12, price: 159, status: 'inactive' },
        { id: 9, date: '2023-09-14', name: 'Code 9', format: 'PSD', solds: 7, price: 109, status: 'active' },
        { id: 10, date: '2023-10-25', name: 'Code 10', format: 'Figma', solds: 25, price: 69, status: 'active' },
    ];

    useEffect(() => {
        const itemId = parseInt(id);
        const found = mockData.find(d => d.id === itemId);

        if (!found) {
            navigate('/code');
            return;
        }

        setTitle(found.name);
        setSubtitle('Premium Dashboard & WebApp Code');
        setOverview(`High-quality, fully customizable ${found.name} with 150+ components, responsive layouts, dark/light mode support, and complete source files. Perfect for SaaS, admin panels, and modern web applications.`);
        setPoints(['150+ Components', 'Dark/Light Mode', 'Fully Responsive', 'Figma + Sketch + XD Files', 'Lifetime Updates', 'Premium Support']);
        setFormats(['Figma', 'Sketch', 'Adobe XD', 'Photoshop (PSD)']);
        setPrice(found.price.toString());
        setStatus(found.status);
        setTags(['code', 'dashboard', 'admin', 'template', 'figma', 'responsive']);
        setDate(found.date);
        setSolds(found.solds);

        const encodedTitle = encodeURIComponent(found.name);
        setCurrentThumbnailUrl(`https://placehold.co/356x256/png?text=${encodedTitle}+Thumbnail`);
        setCurrentCoverUrl(`https://placehold.co/1920x440/png?text=${encodedTitle}+Cover`);
        setCurrentGalleryUrls(Array.from({ length: 8 }, (_, i) => `https://placehold.co/803x628/png?text=${encodedTitle}+Gallery+${i + 1}`));
        setCurrentPreviewPhotoUrl(`https://placehold.co/1200x800/png?text=${encodedTitle}+Preview`);
        setCurrentTemplateFileName(`${found.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.zip`);
    }, [id, mockData, navigate]);

    const formatOptions = ['Figma', 'Sketch', 'Adobe XD', 'Photoshop (PSD)', 'Framer', 'Webflow'];

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

    const handleSave = () => {
        alert('Code updated successfully!');
        setIsEditMode(false);
    };

    const totalIncome = solds * (parseFloat(price) || 0);

    if (!title) return <div className="text-white text-center mt-40 text-4xl">Loading...</div>;

    return (
        <div>
            <Header title={isEditMode ? "Edit Code" : "Code Details"} />

            <div className="mt-8 bg-[#171718CC] p-8 rounded-[20px] max-w-7xl mx-auto">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-[#242426] p-6 rounded-[20px] text-center">
                        <p className="text-gray-400 text-lg">Upload Date</p>
                        <p className="text-3xl font-bold text-white mt-2">{date}</p>
                    </div>
                    <div className="bg-[#242426] p-6 rounded-[20px] text-center">
                        <p className="text-gray-400 text-lg">Solds</p>
                        <p className="text-3xl font-bold text-white mt-2">{solds}</p>
                    </div>
                    <div className="bg-[#242426] p-6 rounded-[20px] text-center">
                        <p className="text-gray-400 text-lg">Price</p>
                        <p className="text-3xl font-bold text-white mt-2">${price}</p>
                    </div>
                    <div className="bg-[#242426] p-6 rounded-[20px] text-center">
                        <p className="text-gray-400 text-lg">Total Income</p>
                        <p className="text-3xl font-bold text-white mt-2">${totalIncome}</p>
                    </div>
                </div>

                {/* Edit Button (only in view mode) */}
                {!isEditMode && (
                    <div className="flex justify-end mb-8">
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                        >
                            Edit Code
                        </button>
                    </div>
                )}

                {isEditMode ? (
                    // ==================== EDIT MODE ====================
                    <div>
                        {/* Uploads */}
                        <h2 className="text-2xl font-semibold text-white mb-8">Upload Assets</h2>

                        <div className="space-y-10">
                            <div>
                                <label className="block text-white text-lg mb-3">Template File (ZIP)</label>
                                <p className="text-gray-400 mb-3">Current: {currentTemplateFileName}</p>
                                <input type="file" accept=".zip,.rar,.7z" onChange={(e) => setTemplateFile(e.target.files[0] || null)} className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-white text-lg mb-3">Thumbnail (356×256)</label>
                                    <img src={currentThumbnailUrl} alt="current thumbnail" className="mb-4 rounded-lg" />
                                    <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0] || null)} className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white" />
                                    {thumbnail && <img src={URL.createObjectURL(thumbnail)} alt="new thumbnail" className="mt-4 rounded-lg" />}
                                </div>
                                <div>
                                    <label className="block text-white text-lg mb-3">Cover Photo (1920×440)</label>
                                    <img src={currentCoverUrl} alt="current cover" className="mb-4 rounded-lg" />
                                    <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0] || null)} className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white" />
                                    {cover && <img src={URL.createObjectURL(cover)} alt="new cover" className="mt-4 rounded-lg" />}
                                </div>
                            </div>

                            <div>
                                <label className="block text-white text-lg mb-3">Gallery Photos (803×628)</label>
                                {currentGalleryUrls.length > 0 && (
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4 mb-6">
                                        {currentGalleryUrls.map((src, i) => (
                                            <img key={i} src={src} alt={`gallery ${i + 1}`} className="rounded-lg h-40 object-cover" />
                                        ))}
                                    </div>
                                )}
                                <input type="file" multiple accept="image/*" onChange={(e) => setGallery(Array.from(e.target.files))} className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white" />
                            </div>

                            <div>
                                <label className="block text-white text-lg mb-3">Preview Photo (max 3MB)</label>
                                <img src={currentPreviewPhotoUrl} alt="current preview" className="mb-4 rounded-lg max-w-full" />
                                <input type="file" accept="image/*" onChange={(e) => setPreviewPhoto(e.target.files[0] || null)} className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white" />
                                {previewPhoto && <img src={URL.createObjectURL(previewPhoto)} className="mt-4 rounded-lg max-w-full" />}
                            </div>
                        </div>

                        <hr className="border-gray-700 my-12" />

                        {/* Form Fields */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-2xl font-semibold text-white mb-8">Basic Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-white mb-2">Title *</label>
                                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-white mb-2">Subtitle</label>
                                        <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white mb-2">Overview</label>
                                <textarea value={overview} onChange={(e) => setOverview(e.target.value)} rows={6} className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label className="block text-white text-lg mb-4">Highlights</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {points.map((point, i) => (
                                        <div key={i}>
                                            <label className="text-gray-400 text-sm">Point {i + 1}</label>
                                            <input type="text" value={point} onChange={(e) => handlePointsChange(i, e.target.value)} className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <label className="block text-white mb-2">Format (multi-select)</label>
                                    <select multiple value={formats} onChange={(e) => setFormats(Array.from(e.target.selectedOptions, o => o.value))} className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg h-32">
                                        {formatOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white mb-2">Price ($)</label>
                                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-white mb-2">Status</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white mb-2">Tags (press Enter)</label>
                                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {tags.map((tag, i) => (
                                        <span key={i} className="bg-blue-600 text-white px-4 py-1 rounded-full flex items-center gap-2 text-sm">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(i)} className="hover:text-gray-300">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end pt-8">
                                <button onClick={() => setIsEditMode(false)} className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    Save Code
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // ==================== VIEW MODE ====================
                    <div>
                        <img src={currentCoverUrl} alt="Cover" className="w-full h-96 object-cover rounded-[20px] mb-10" />

                        <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
                        {subtitle && <p className="text-2xl text-gray-300 mb-8">{subtitle}</p>}

                        {overview && <p className="text-lg text-gray-300 mb-10 leading-relaxed">{overview}</p>}

                        {points.filter(p => p.trim()).length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-2xl font-semibold text-white mb-6">Highlights</h3>
                                <ul className="list-disc pl-8 text-gray-300 space-y-3 text-lg">
                                    {points.filter(p => p.trim()).map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                            <div>
                                <p className="text-lg text-gray-400 mb-3">Formats</p>
                                <div className="flex flex-wrap gap-3">
                                    {formats.map((f, i) => (
                                        <span key={i} className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">{f}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-lg text-gray-400 mb-3">Tags</p>
                                <div className="flex flex-wrap gap-3">
                                    {tags.map((t, i) => (
                                        <span key={i} className="bg-gray-700 text-white px-4 py-1 rounded-full text-sm">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-lg text-gray-400 mb-3">Status</p>
                                <span className={`px-5 py-2 rounded-full text-white ${status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                            </div>
                        </div>

                        {currentGalleryUrls.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-2xl font-semibold text-white mb-6">Gallery</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    {currentGalleryUrls.map((src, i) => (
                                        <img key={i} src={src} alt={`Gallery ${i + 1}`} className="rounded-lg w-full object-cover h-80" />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-4">Thumbnail</h3>
                                <img src={currentThumbnailUrl} alt="Thumbnail" className="rounded-lg w-full" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-4">Preview Photo</h3>
                                <img src={currentPreviewPhotoUrl} alt="Preview" className="rounded-lg w-full" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold text-white mb-4">Download</h3>
                            <a href="#" className="text-blue-500 hover:underline text-xl">{currentTemplateFileName}</a>
                        </div>
                    </div>
                )}
            </div>
        </div>)
};

export default EditCodes;