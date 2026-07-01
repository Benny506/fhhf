import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Table, Pagination } from 'react-bootstrap';
import { BsPeople, BsCheckCircle, BsBook, BsGraphUp } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { addAlert, showSubtleLoader, hideSubtleLoader } from '../../../redux/slices/uiSlice';
import supabase from '../../../utils/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function InstructorGlobalAnalyticsTab({ user }) {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('30days'); // 7days, 30days, year, all
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (user?.id) {
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, dateFilter]);

  const fetchAnalytics = async () => {
    dispatch(showSubtleLoader('Loading global analytics...'));
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
      const { data: analytics, error } = await supabase.rpc('fhhf_get_instructor_global_analytics', {
        p_instructor_id: user.id,
        p_start_date: startDate,
        p_end_date: endDate
      });
      if (error) throw error;
      setData(analytics);
      setCurrentPage(1); // Reset pagination on filter change
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ variant: 'danger', message: 'Failed to load global analytics.' }));
    } finally {
      setLoading(false);
      dispatch(hideSubtleLoader());
    }
  };

  if (loading && !data) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const completionRate = data.total_enrollments > 0 
    ? Math.round((data.total_completed / data.total_enrollments) * 100) 
    : 0;

  // Pagination logic for course breakdown table
  const coursesList = data.courses || [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = coursesList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(coursesList.length / itemsPerPage);

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
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Global Overview</h5>
        <div style={{ width: '200px' }}>
          <Form.Select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="shadow-sm rounded-3 border-0 bg-light"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="year">Past Year</option>
            <option value="all">All Time</option>
          </Form.Select>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 d-flex align-items-center gap-3">
              <div className="text-primary rounded-circle p-3" style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
                <BsBook size={24} />
              </div>
              <div className="w-100">
                <h6 className="text-muted text-uppercase fw-bold letter-spacing-1 mb-1 small">Total Courses</h6>
                <h3 className="fw-bold mb-1">{data.total_courses.toLocaleString()}</h3>
                <div className="d-flex justify-content-between small fw-semibold" style={{ fontSize: '0.75rem' }}>
                  <span className="text-success" title="Published">{data.created_published || 0} Pub</span>
                  <span className="text-warning" title="Draft">{data.created_draft || 0} Drf</span>
                  <span className="text-info" title="Pending">{data.created_pending || 0} Pnd</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 d-flex align-items-center gap-3">
              <div className="text-info rounded-circle p-3" style={{ backgroundColor: 'rgba(13, 202, 240, 0.1)' }}>
                <BsPeople size={24} />
              </div>
              <div>
                <h6 className="text-muted text-uppercase fw-bold letter-spacing-1 mb-1 small">Total Enrollments</h6>
                <h3 className="fw-bold mb-0">{data.total_enrollments.toLocaleString()}</h3>
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
                <h6 className="text-muted text-uppercase fw-bold letter-spacing-1 mb-1 small">Total Graduates</h6>
                <h3 className="fw-bold mb-0">{data.total_completed.toLocaleString()}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 d-flex align-items-center gap-3">
              <div className="text-danger rounded-circle p-3" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}>
                <BsGraphUp size={24} />
              </div>
              <div>
                <h6 className="text-muted text-uppercase fw-bold letter-spacing-1 mb-1 small">Completion Rate</h6>
                <h3 className="fw-bold mb-0">{completionRate}%</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-4">Enrollments Over Time</h5>
          <div style={{ height: '300px' }}>
            {data.time_series && data.time_series.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.time_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickMargin={10}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="enrollments" 
                    stroke="#4e73df" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="Enrollments"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-100 d-flex justify-content-center align-items-center text-muted">
                No enrollment data for the selected period.
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Per-Course Breakdown Table */}
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <div className="p-4 border-bottom bg-light rounded-top-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <BsGraphUp className="text-primary" size={20} />
              <h5 className="fw-bold mb-0">Course Performance Breakdown</h5>
            </div>
            {totalPages > 1 && renderPagination()}
          </div>

          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-white">
                <tr>
                  <th className="border-0 py-3 ps-4 text-muted small text-uppercase">Course Title</th>
                  <th className="border-0 py-3 text-muted small text-uppercase text-center">Enrollments</th>
                  <th className="border-0 py-3 text-muted small text-uppercase text-center">In Progress</th>
                  <th className="border-0 py-3 text-muted small text-uppercase text-center">Completed</th>
                  <th className="border-0 py-3 text-muted small text-uppercase text-center pe-4">Dropped</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No published courses found.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((course) => {
                    const completionRate = course.total_enrollments > 0
                      ? Math.round((course.total_completed / course.total_enrollments) * 100)
                      : 0;

                    return (
                      <tr key={course.course_id}>
                        <td className="ps-4 py-3">
                          <span className="fw-bold d-block">{course.title}</span>
                          <span className="small text-muted">Completion Rate: {completionRate}%</span>
                        </td>
                        <td className="text-center fw-semibold fs-5">{course.total_enrollments}</td>
                        <td className="text-center text-primary fw-semibold">{course.total_in_progress}</td>
                        <td className="text-center text-success fw-semibold">{course.total_completed}</td>
                        <td className="text-center text-danger fw-semibold pe-4">{course.total_dropped}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
