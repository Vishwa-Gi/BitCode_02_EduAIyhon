import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        instructor: '',
        duration: '',
        level: 'beginner',
        image: null
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/courses', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCourses(response.data);
        } catch (err) {
            setError('Failed to fetch courses');
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            await axios.post('http://localhost:3000/api/courses', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSuccess('Course created successfully!');
            setFormData({
                title: '',
                description: '',
                price: '',
                category: '',
                instructor: '',
                duration: '',
                level: 'beginner',
                image: null
            });
            fetchCourses();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/courses/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSuccess('Course deleted successfully!');
            fetchCourses();
        } catch (err) {
            setError('Failed to delete course');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage your courses and content</p>
            </div>

            <div className="admin-content">
                <div className="course-form-section">
                    <h2>Add New Course</h2>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit} className="course-form">
                        <div className="form-group">
                            <label htmlFor="title">Course Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">Price ($)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="duration">Duration (hours)</label>
                                <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="instructor">Instructor</label>
                                <input
                                    type="text"
                                    id="instructor"
                                    name="instructor"
                                    value={formData.instructor}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="level">Level</label>
                            <select
                                id="level"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                required
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="image">Course Image</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                                required
                            />
                        </div>

                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Creating Course...' : 'Create Course'}
                        </button>
                    </form>
                </div>

                <div className="courses-list-section">
                    <h2>Existing Courses</h2>
                    <div className="courses-grid">
                        {courses.map(course => (
                            <div key={course._id} className="course-card">
                                <img src={course.image} alt={course.title} />
                                <div className="course-info">
                                    <h3>{course.title}</h3>
                                    <p>{course.description}</p>
                                    <div className="course-meta">
                                        <span>${course.price}</span>
                                        <span>{course.duration}h</span>
                                        <span>{course.level}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(course._id)}
                                        className="delete-button"
                                    >
                                        Delete Course
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard; 