import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { BsPlayCircleFill, BsSearch, BsArrowRight, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showSubtleLoader, hideSubtleLoader } from '../redux/slices/uiSlice';
import supabase from '../utils/supabase';
import CourseCard from '../components/ui/CourseCard';

export default function CoursesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPublishedCourses();
  }, []);

  const fetchPublishedCourses = async () => {
    dispatch(showSubtleLoader('Loading amazing courses...'));
    try {
      const { data, error } = await supabase
        .from('fhhf_courses')
        .select('*, instructor:fhhf_user_profiles!instructor_id(username)')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const realCourses = data || [];
      const dummyCourses = generateDummyCourses();

      setCourses([...realCourses, ...dummyCourses]);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
      dispatch(hideSubtleLoader());
    }
  };

  const generateDummyCourses = () => {
    const categories = ['Technology & Programming', 'Business & Entrepreneurship', 'Design & Creativity', 'Health & Fitness', 'Marketing & Sales', 'Photography & Video', 'Music & Audio', 'Language Learning'];
    const titles = ['Mastering ', 'The Complete Guide to ', 'Advanced ', 'Introduction to ', 'Crash Course in ', 'Zero to Hero: ', 'Building Real-world '];
    const topics = ['React JS', 'Startup Finance', 'UI/UX Design', 'Yoga', 'Digital Marketing', 'Data Science', 'Machine Learning', 'Leadership', 'Photography', 'SEO', 'Python', 'Web3', 'Video Editing', 'Spanish', 'Copywriting'];

    return Array.from({ length: 45 }).map((_, i) => ({
      id: `dummy-${i}`,
      title: `${titles[i % titles.length]}${topics[i % topics.length]}`,
      description: 'This is a comprehensive dummy course designed to fill up the UI with realistic content. It covers all the essential topics and provides real-world examples to elevate your skills.',
      thumbnail_url: `https://picsum.photos/seed/course${i + 100}/1280/720`,
      is_free: i % 4 === 0,
      price: i % 4 === 0 ? 0 : parseFloat((19.99 * (1 + (i % 5))).toFixed(2)),
      status: 'published',
      category: categories[i % categories.length],
      instructor: { username: 'FHHF Expert' },
      created_at: new Date(Date.now() - i * 86400000).toISOString()
    }));
  };

  // Derived state
  const categories = useMemo(() => {
    const cats = new Set(courses.map(c => c.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  const featuredCourse = courses.length > 0 ? courses[0] : null;

  // Groupings for swimlanes (when viewing "All")
  const swimlanes = useMemo(() => {
    if (selectedCategory !== 'All' || searchQuery) return [];

    const lanes = [];

    // Top Free Picks
    const freeCourses = courses.filter(c => c.is_free && c.id !== featuredCourse?.id).slice(0, 8);
    if (freeCourses.length > 0) {
      lanes.push({ title: 'Top Free Picks', items: freeCourses });
    }

    // New & Noteworthy (Exclude featured and free to avoid too much duplication)
    const premiumCourses = courses.filter(c => !c.is_free && c.id !== featuredCourse?.id).slice(0, 8);
    if (premiumCourses.length > 0) {
      lanes.push({ title: 'New & Noteworthy Premium', items: premiumCourses });
    }

    // Categories
    const categoriesToShow = categories.filter(c => c !== 'All').slice(0, 3);
    categoriesToShow.forEach(cat => {
      const catCourses = courses.filter(c => c.category === cat && c.id !== featuredCourse?.id).slice(0, 8);
      if (catCourses.length > 0) {
        lanes.push({ title: `Popular in ${cat}`, items: catCourses });
      }
    });

    return lanes;
  }, [courses, selectedCategory, searchQuery, categories, featuredCourse]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="courses-hub bg-light min-vh-100 pb-5">
      {/* Hero Spotlight */}
      {featuredCourse && selectedCategory === 'All' && !searchQuery && (
        <div className="hero-spotlight position-relative mb-5" style={{ height: '60vh', minHeight: '500px' }}>
          <div
            className="position-absolute w-100 h-100"
            style={{
              backgroundImage: `url(${featuredCourse.thumbnail_image || featuredCourse.thumbnail_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.4)'
            }}
          />
          <Container className="h-100 position-relative z-1 d-flex align-items-end pb-5">
            <Row className="w-100">
              <Col lg={8} xl={6} className="text-white">
                <Badge bg="primary" className="rounded-pill mb-3 px-3 py-2 text-uppercase tracking-widest">Featured Course</Badge>
                <h1 className="fw-bold display-4 mb-3 line-clamp-2 text-light" style={{ fontFamily: 'var(--font-family-heading)' }}>
                  {featuredCourse.title}
                </h1>
                {/* <p className="lead mb-4 line-clamp-2 text-primary">{featuredCourse.description?.replace(/<[^>]+>/g, '')}</p> */}
                <div className="d-flex align-items-center gap-3">
                  <Button
                    variant="light"
                    size="lg"
                    className="rounded-pill fw-bold px-4 py-2 d-flex align-items-center gap-2 text-primary"
                    onClick={() => navigate(`/courses/${featuredCourse.id}`)}
                  >
                    <BsPlayCircleFill size={20} /> Explore Course
                  </Button>
                  <span className="fw-medium">
                    Instructor: {featuredCourse.instructor?.username || 'FHHF Expert'}
                  </span>
                </div>
              </Col>
            </Row>
          </Container>
          <div className="hero-fade-bottom position-absolute bottom-0 w-100" style={{ height: '150px', background: 'linear-gradient(to top, #f8f9fa, transparent)' }} />
        </div>
      )}

      {/* Sticky Filters & Search */}
      <div className={`sticky-top bg-light z-3 shadow-sm ${featuredCourse && selectedCategory === 'All' && !searchQuery ? '' : 'pt-4'}`} style={{ top: '70px', transition: 'all 0.3s ease' }}>
        <Container className="py-3 d-flex flex-column flex-md-row gap-3 justify-content-between align-items-center">
          <div className="d-flex gap-2 overflow-auto w-100 hide-scrollbar pb-2 pb-md-0" style={{ whiteSpace: 'nowrap' }}>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'outline-secondary'}
                className="rounded-pill fw-medium px-4 border-0 shadow-sm"
                style={{ backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'white' }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="position-relative" style={{ minWidth: '250px' }}>
            <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            <input
              type="text"
              className="form-control rounded-pill ps-5 bg-white border-0 shadow-sm py-2"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Container>
      </div>

      <Container className="py-5">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="fw-bold text-muted mb-3">No courses found</h3>
            <p className="text-secondary">We couldn't find any courses matching your criteria. Try adjusting your search or filters.</p>
            <Button variant="outline-primary" className="rounded-pill px-4 mt-3" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>Clear Filters</Button>
          </div>
        ) : (
          <>
            {/* Swimlanes View (All Categories) */}
            {selectedCategory === 'All' && !searchQuery ? (
              <div className="d-flex flex-column gap-5">
                {swimlanes.map((lane, idx) => (
                  <Swimlane key={idx} title={lane.title} items={lane.items} navigate={navigate} />
                ))}
              </div>
            ) : (
              <Row className="g-4">
                <div className="mb-3 d-flex justify-content-between align-items-end">
                  <h4 className="fw-bold m-0" style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--color-primary)' }}>
                    {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedCategory} Courses`}
                  </h4>
                  <span className="text-muted fw-medium">{filteredCourses.length} results</span>
                </div>
                {filteredCourses.map(course => (
                  <Col xs={12} sm={6} lg={4} xl={3} key={course.id}>
                    <CourseCard course={course} onViewCourse={() => !String(course.id).startsWith('dummy-') && navigate(`/courses/${course.id}`)} />
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .course-card-hover {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .course-card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .course-card-hover .card-img-top {
          transition: transform 0.5s ease;
        }
        .course-card-hover:hover .card-img-top {
          transform: scale(1.05);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

function Swimlane({ title, items, navigate }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth + 150 : clientWidth - 150;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="swimlane-section position-relative">
      <div className="d-flex justify-content-between align-items-end mb-4 px-2 px-xl-0">
        <h4 className="fw-bold m-0" style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--color-primary)' }}>{title}</h4>
      </div>

      <div className="position-relative">
        <Button
          variant="light"
          className="position-absolute start-0 z-3 rounded-circle shadow d-none d-md-flex align-items-center justify-content-center p-0 border bg-white"
          style={{ width: '48px', height: '48px', left: '-24px', top: 'calc(50% - 24px - 1rem)', opacity: 0.95 }}
          onClick={() => scroll('left')}
        >
          <BsChevronLeft size={24} className="text-primary ms-[-2px]" />
        </Button>

        <div ref={scrollRef} className="d-flex gap-4 overflow-auto hide-scrollbar pb-4 px-2 px-xl-0" style={{ snapType: 'x mandatory', scrollBehavior: 'smooth' }}>
          {items.map(course => (
            <div key={course.id} style={{ minWidth: '300px', maxWidth: '300px', scrollSnapAlign: 'start' }}>
              <CourseCard course={course} onViewCourse={() => !String(course.id).startsWith('dummy-') && navigate(`/courses/${course.id}`)} />
            </div>
          ))}
        </div>

        <Button
          variant="light"
          className="position-absolute end-0 z-3 rounded-circle shadow d-none d-md-flex align-items-center justify-content-center p-0 border bg-white"
          style={{ width: '48px', height: '48px', right: '-24px', top: 'calc(50% - 24px - 1rem)', opacity: 0.95 }}
          onClick={() => scroll('right')}
        >
          <BsChevronRight size={24} className="text-primary ms-[2px]" />
        </Button>
      </div>
    </div>
  );
}


