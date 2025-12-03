import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/UI/Header';

const EditIcons = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [overview, setOverview] = useState('');
    const [points, setPoints] = useState([]);
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost/bfiro_backend/fetch/site/products/getProduct.php?id=${id}`);
                const result = response.data;

                if (result.status !== 1 || !result.data) {
                    navigate('/icons');
                    return;
                }

                const product = result.data;

                if (product.type !== 'Icons') {
                    navigate('/icons');
                    return;
                }

                setTitle(product.title || '');
                setSubtitle(product.subtitle || '');
                setOverview(product.overview || '');
                setPoints(product.highlights ? product.highlights.map(h => h.highlight || '') : []);
                setFormats(product.formats ? product.formats.map(f => f.text || '') : []);

                const finalPrice = (product.price - (product.discount || 0)) || product.price || 0;
                setPrice(finalPrice.toString());

                setStatus(product.status || 'active');
                setTags(product.labels ? product.labels.map(l => l.text || '') : []);
                setDate(product.releaseDate ? product.releaseDate.split(' ')[0] : '');
                setSolds(product.solds || 0);

                // Images mapping
                const images = product.images || [];
                setCurrentCoverUrl(images.find(img => img.purpose === 'cover')?.url || '');
                setCurrentGalleryUrls(images.filter(img => img.purpose === 'gallery').map(img => img.url));
                setCurrentPreviewPhotoUrl(images.find(img => img.purpose === 'preview')?.url || '');
                setCurrentThumbnailUrl(images.find(img => img.purpose === 'bg')?.url || '');

                // Template file (assuming first file is the main template)
                const files = product.files || [];
                setCurrentTemplateFileName(files[0]?.storage_path || '');
            } catch (error) {
                console.error('Error fetching product:', error);
                navigate('/icons');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

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

    const handleSave = async () => {
        if (saving) return;
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
            formData.append('labels', tags.join(',')); // assuming tags are categories/labels

            if (templateFile) formData.append('template_file', templateFile);
            if (thumbnail) formData.append('thumbnail', thumbnail);
            if (cover) formData.append('cover', cover);
            if (previewPhoto) formData.append('preview_photo', previewPhoto);
            gallery.forEach((file, i) => formData.append(`gallery[${i}]`, file));

            await axios.post(`http://localhost/bfiro_backend/actions/products/updateProduct.php?id=${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Icon updated successfully!');
            setIsEditMode(false);
            // Optionally refetch data
            window.location.reload();
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update Icon. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (deleting) return;
        if (!window.confirm('Are you sure you want to delete this Icon? This action cannot be undone.')) return;

        setDeleting(true);

        try {
            await axios.post(`http://localhost/bfiro_backend/actions/products/deleteProduct.php?id=${id}`);
            alert('Icon deleted successfully!');
            navigate('/icons');
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete Icon. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const totalIncome = solds * (parseFloat(price) || 0);

    if (loading) {
        return <div className="text-white text-center mt-40 text-4xl">Loading...</div>;
    }

    if (!title) return <div className="text-white text-center mt-40 text-4xl">Product not found</div>;

    return (
        <div>
            <Header title={isEditMode ? "Edit Icon" : "Icon Details"} />

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

                {/* Edit and Delete Buttons (only in view mode) */}
                {!isEditMode && (
                    <div className="flex justify-end mb-8 gap-4">
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                        >
                            Edit Icon
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
                        >
                            {deleting ? 'Deleting...' : 'Delete Icon'}
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
                                    {currentThumbnailUrl && <img src={currentThumbnailUrl} alt="current thumbnail" className="mb-4 rounded-lg" />}
                                    <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0] || null)} className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white" />
                                    {thumbnail && <img src={URL.createObjectURL(thumbnail)} alt="new thumbnail" className="mt-4 rounded-lg" />}
                                </div>
                                <div>
                                    <label className="block text-white text-lg mb-3">Cover Photo (1920×440)</label>
                                    {currentCoverUrl && <img src={currentCoverUrl} alt="current cover" className="mb-4 rounded-lg" />}
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
                                {currentPreviewPhotoUrl && <img src={currentPreviewPhotoUrl} alt="current preview" className="mb-4 rounded-lg max-w-full" />}
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
                                <button onClick={() => setIsEditMode(false)} disabled={saving} className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50">
                                    Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Icon'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // ==================== VIEW MODE ====================
                    <div>
                        {currentCoverUrl && <img src={currentCoverUrl} alt="Cover" className="w-full h-96 object-cover rounded-[20px] mb-10" />}

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
                                {currentThumbnailUrl && <img src={currentThumbnailUrl} alt="Thumbnail" className="rounded-lg w-full" />}
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-4">Preview Photo</h3>
                                {currentPreviewPhotoUrl && <img src={currentPreviewPhotoUrl} alt="Preview" className="rounded-lg w-full" />}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold text-white mb-4">Download</h3>
                            {currentTemplateFileName && <a href="#" className="text-blue-500 hover:underline text-xl">{currentTemplateFileName}</a>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditIcons;