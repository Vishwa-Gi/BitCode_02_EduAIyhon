import React, { useState } from 'react';
import './Course.css';

function Course() {
    const [courses] = useState([
        {
            id: 1,
            title: "Web Development Bootcamp",
            instructor: "John Doe",
            rating: 4.5,
            students: 1234,
            price: 49.99,
            image: "https://via.placeholder.com/300x200",
            category: "Development"
        },
        {
            id: 2,
            title: "Data Science Masterclass",
            instructor: "Jane Smith",
            rating: 4.8,
            students: 856,
            price: 59.99,
            image: "https://via.placeholder.com/300x200",
            category: "Data Science"
        },
        {
            id: 3,
            title: "Machine Learning Fundamentals",
            instructor: "Mike Johnson",
            rating: 4.7,
            students: 2345,
            price: 69.99,
            image: "https://via.placeholder.com/300x200",
            category: "Machine Learning"
        }
    ]);

    return (
        <div className="course-container">
            <div className="course-header">
                <h1>Featured Courses</h1>
                <div className="course-filters">
                    <select className="filter-select">
                        <option value="">All Categories</option>
                        <option value="development">Development</option>
                        <option value="data-science">Data Science</option>
                        <option value="machine-learning">Machine Learning</option>
                    </select>
                    <select className="filter-select">
                        <option value="">Sort By</option>
                        <option value="popular">Most Popular</option>
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="course-grid">
                {courses.map(course => (
                    <div key={course.id} className="course-card">
                        <div className="course-image">
                            <img src={course.image} alt={course.title} />
                        </div>
                        <div className="course-content">
                            <h3>{course.title}</h3>
                            <p className="instructor">{course.instructor}</p>
                            <div className="course-rating">
                                <span className="rating">{course.rating} ⭐</span>
                                <span className="students">({course.students} students)</span>
                            </div>
                            <div className="course-footer">
                                <span className="price">${course.price}</span>
                                <button className="add-to-cart">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Course; 