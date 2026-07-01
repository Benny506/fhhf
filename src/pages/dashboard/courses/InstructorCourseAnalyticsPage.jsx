import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Form, Pagination } from 'react-bootstrap';
import { BsArrowLeft, BsPeople, BsCheckCircle, BsBook, BsGraphDown } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { addAlert, setTopbarConfig, showSubtleLoader, hideSubtleLoader } from '../../../redux/slices/uiSlice';
import supabase from '../../../utils/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function InstructorCourseAnalyticsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('30days');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(setTopbarConfig({
      title: 'Course Analytics',
      description: 'Track student progress and engagement.'
    }));
  }, [dispatch]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      dispatch(showSubtleLoader('Loading analytics...'));
      setLoading(true);

      let startDate = null;
      let endDate = new Date().toISOString();
      const now = new Date();
      if (dateFilter === '7days') {
        now.setDate(now.getDate() - 7);
        startDate = now.toISOString();
      } else if (dateFilter === '30days') {
        now.setDate(now.getDate() - 30);
        startDate = now.toISOString();
      } else if (dateFilter === 'year') {
        now.setFullYear(now.getFullYear() - 1);
        startDate = now.toISOString();
      }

      try {
        const { data: analytics, error } = await supabase.rpc('fhhf_get_specific_course_analytics', {
          p_course_id: courseId,
          p_start_date: startDate,
          p_end_date: endDate
        });
        if (error) throw error;
        setData(analytics);
        setCurrentPage(1); // Reset pagination on filter change
      } catch (err) {
        console.error(err);
        dispatch(addAlert({ variant: 'danger', message: 'Failed to load course analytics. You might not have permission.' }));
      } finally {
        setLoading(false);
        dispatch(hideSubtleLoader());
      }
    };
    fetchAnalytics();
  }, [courseId, dispatch, dateFilter]);

  if (loading && !data) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!data) return null;

  const { course, enrollments, funnel, time_series } = data;
  const completionRate = enrollments.total > 0 
    ? Math.round((enrollments.completed / enrollments.total) * 100) 
    : 0;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = funnel.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(funnel.length / itemsPerPage);

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return (
      <Pagination size="sm" className="mb-0">
        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
        {items}
        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
      </Pagination>
    );
  };

  return (
    <Container fluid className="px-0 py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <Button variant="light" className="rounded-circle shadow-sm" onClick={() => navigate('/dashboard/courses')}>
            <BsArrowLeft />
          </Button>
          <div>
            <h3 className="fw-bold mb-0 text-dark">{course.title}</h3>
            <span className="text-muted small">Analytics Dashboard</span>
          </div>
        </div>
        <div style={{ width: '200px' }}>
          <Form.Select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="shadow-sm rounded-3 border-0 bg-white"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="year">Past Year</option>
            <option value="all">All Time</option>
          </Form.Select>
        </div>
      </div>

      {/* KPIs */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 d-flex align-items-center gap-3">
              <div className="text-primary rounded-circle p-3" style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
                <BsPeople size={24} />
              </div>
              <div>
                <h6 className="text-muted text-uppercase fw-bold letter-spacing-1 mb-1 small">Total Enrollments</h6>
                <h3 className="fw-bold mb-0">{enrollments.total.toLocaleString()}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 d-flex align-items-center gap-3">
              <div className="text-success rounded-circle p-3" style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>
                <BsCheckCircle size={24} />
              </div>
              <div>
                <h6 className="text-muted text-uppercase fw-bold letter-spacing-1 mb-1 small">Graduates</h6>
                <h3 className="fw-bold mb-0">{enrollments.completed.toLocaleString()}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 d-flex align-items-center gap-3">
              <div className="text-info rounded-circle p-3" style={{ backgroundColor: 'rgba(13, 202, 240, 0.1)' }}>
                <BsBook size={24} />
              </div>
              <div>
                <h6 className="text-muted text-uppercase fw-bold letter-spacing-1 mb-1 small">Active Students</h6>
                <h3 className="fw-bold mb-0">{enrollments.in_progress.toLocaleString()}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 d-flex align-items-center gap-3">
              <div className="text-danger rounded-circle p-3" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}>
                <BsGraphDown size={24} />
              </div>
              <div>
                <h6 className="text-muted text-uppercase fw-bold letter-spacing-1 mb-1 small">Completion Rate</h6>
                <h3 className="fw-bold mb-0">{completionRate}%</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enrollments Over Time Line Chart */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-4">Enrollments Over Time</h5>
          <div style={{ height: '300px' }}>
            {time_series && time_series.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={time_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="enrollments" stroke="#4e73df" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Enrollments" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-100 d-flex justify-content-center align-items-center text-muted">
                No enrollment data available.
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <Row className="g-4">
        {/* Funnel Chart */}
        <Col lg={7}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Curriculum Funnel (Drop-off Analysis)</h5>
              <div style={{ height: '350px' }}>
                {funnel.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnel} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="title" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80} 
                        tick={{ fontSize: 11 }} 
                      />
                      <YAxis />
                      <Tooltip 
                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                        formatter={(value) => [value, 'Students Completed']}
                      />
                      <Bar dataKey="completed_count" fill="#4e73df" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-100 d-flex justify-content-center align-items-center text-muted">
                    No curriculum data available.
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Data Table with Pagination */}
        <Col lg={5}>
          <Card className="border-0 shadow-sm rounded-4 h-100 d-flex flex-column">
            <div className="p-4 border-bottom bg-light rounded-top-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Lesson Breakdown</h5>
              {totalPages > 1 && renderPagination()}
            </div>
            <div className="table-responsive flex-grow-1">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-white sticky-top">
                  <tr>
                    <th className="border-0 py-3 ps-4 text-muted small text-uppercase">Lesson</th>
                    <th className="border-0 py-3 text-muted small text-uppercase text-center pe-4">Completed By</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center py-5 text-muted">No lessons found.</td>
                    </tr>
                  ) : (
                    currentItems.map((item, idx) => (
                      <tr key={item.lesson_id}>
                        <td className="ps-4 py-3">
                          <span className="small text-muted d-block">{item.module_title}</span>
                          <span className="fw-bold">{indexOfFirstItem + idx + 1}. {item.title}</span>
                        </td>
                        <td className="text-center fw-semibold fs-5 pe-4 text-primary">
                          {item.completed_count}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
