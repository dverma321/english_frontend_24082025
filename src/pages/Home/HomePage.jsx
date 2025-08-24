import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Master English with Confidence</h1>
          <p>Join thousands of learners improving their English skills with our interactive platform</p>
          <div className="cta-buttons">
            <button className="primary-btn">Start Learning Now</button>
            <button className="secondary-btn">Take a Placement Test</button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="People learning English" />
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/2936/2936886.png" alt="Interactive Lessons" />
            </div>
            <h3>Interactive Lessons</h3>
            <p>Engaging content that makes learning enjoyable and effective</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/1995/1995537.png" alt="Native Teachers" />
            </div>
            <h3>Native Teachers</h3>
            <p>Learn from certified English teachers with native proficiency</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/2889/2889676.png" alt="Progress Tracking" />
            </div>
            <h3>Progress Tracking</h3>
            <p>Monitor your improvement with detailed analytics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3050/3050525.png" alt="Community" />
            </div>
            <h3>Learning Community</h3>
            <p>Practice with peers from around the world</p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="courses-section">
        <h2>Our Popular Courses</h2>
        <div className="courses-grid">
          <div className="course-card">
            <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Beginner English" />
            <div className="course-info">
              <h3>Beginner English</h3>
              <p>Start your English journey with basic vocabulary and grammar</p>
              <button className="course-btn">Enroll Now</button>
            </div>
          </div>
          <div className="course-card">
            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Business English" />
            <div className="course-info">
              <h3>Business English</h3>
              <p>Master professional communication for the workplace</p>
              <button className="course-btn">Enroll Now</button>
            </div>
          </div>
          <div className="course-card">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="IELTS Preparation" />
            <div className="course-info">
              <h3>IELTS Preparation</h3>
              <p>Comprehensive training for IELTS success</p>
              <button className="course-btn">Enroll Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <h2>What Our Students Say</h2>
        <div className="testimonials">
          <div className="testimonial-card">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Student" />
            <p>"This platform helped me improve my English significantly in just 3 months!"</p>
            <h4>Maria Sanchez</h4>
            <div className="rating">★★★★★</div>
          </div>
          <div className="testimonial-card">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Student" />
            <p>"The business English course was exactly what I needed for my career."</p>
            <h4>James Wilson</h4>
            <div className="rating">★★★★☆</div>
          </div>
          <div className="testimonial-card">
            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Student" />
            <p>"Interactive lessons made learning fun and effective. Highly recommended!"</p>
            <h4>Sophie Chen</h4>
            <div className="rating">★★★★★</div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for learning tips and special offers</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;