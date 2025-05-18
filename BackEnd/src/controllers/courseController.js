const Course = require('../models/Course');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      instructor: req.user._id
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all courses with filtering and pagination
exports.getCourses = async (req, res) => {
  try {
    const { category, level, minPrice, maxPrice, sort } = req.query;
    const query = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === 'price') sortOption = { price: 1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else sortOption = { createdAt: -1 };

    const courses = await Course.find(query)
      .sort(sortOption)
      .populate('instructor', 'name email')
      .limit(12);

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single course by ID
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    Object.assign(course, req.body);
    course.updatedAt = Date.now();
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    
    await course.remove();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate a course
exports.rateCourse = async (req, res) => {
  try {
    const { rating } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const newTotalRatings = course.totalRatings + 1;
    const newRating = ((course.rating * course.totalRatings) + rating) / newTotalRatings;

    course.rating = newRating;
    course.totalRatings = newTotalRatings;
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 