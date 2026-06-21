import React, { useState } from 'react';
import { Card, Badge, Modal, Button } from 'react-bootstrap';
import { BsPlayCircleFill, BsArrowRightCircle } from 'react-icons/bs';

export default function CourseCard({ 
  course, 
  onImageClick, 
  onViewCourse,
  renderBadges, 
  renderActions,
  renderMetadata 
}) {
  const [showVideo, setShowVideo] = useState(false);
  const isDummy = String(course.id).startsWith('dummy-');

  const hasVideo = !!course.thumbnail_url;
  const imageToUse = course.thumbnail_image || course.thumbnail_url;

  const handleMediaClick = (e) => {
    e.stopPropagation();
    if (isDummy) return;
    
    if (onImageClick) {
      onImageClick();
    } else if (hasVideo) {
      setShowVideo(true);
    } else if (onViewCourse) {
      onViewCourse();
    }
  };

  return (
    <>
      <Card className={`h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white ${!isDummy ? 'course-card-hover' : ''}`}>
        <div 
          className="position-relative overflow-hidden" 
          style={{ height: '180px', cursor: !isDummy ? 'pointer' : 'default' }}
          onClick={handleMediaClick}
        >
          {imageToUse ? (
            <div className="position-relative w-100 h-100">
              <img 
                src={imageToUse}
                alt="Course Thumbnail"
                className="w-100 h-100 object-fit-cover rounded-0"
              />
              {hasVideo && (
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-lg" style={{ width: '48px', height: '48px' }}>
                    <BsPlayCircleFill size={32} className="text-primary ms-1" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)' }}>
              <BsPlayCircleFill size={40} className="text-muted opacity-25" />
            </div>
          )}
          
          <div className="position-absolute top-0 end-0 m-3 d-flex flex-column gap-2 align-items-end">
            {renderBadges ? renderBadges(course) : (
              <>
                {course.is_free ? (
                  <Badge bg="success" className="rounded-pill shadow-sm px-3 py-2">Free</Badge>
                ) : (
                  <Badge bg="light" text="dark" className="rounded-pill shadow-sm px-3 py-2 border fw-bold">₦{course.price?.toLocaleString()}</Badge>
                )}
              </>
            )}
          </div>
        </div>
        
        <Card.Body className="p-4 d-flex flex-column">
          <div className="mb-2 d-flex justify-content-between align-items-start gap-2">
            <Badge bg='none' className="text-primary rounded-pill border border-primary border-opacity-25 px-3 py-1" style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
              {course.category || 'Uncategorized'}
            </Badge>
          </div>
          
          <h6 className="fw-bold mb-2 text-dark line-clamp-2 lh-base" style={{ minHeight: '42px', fontFamily: 'var(--font-family-heading)' }}>
            {course.title || 'Untitled'}
          </h6>
          
          {renderMetadata ? renderMetadata(course) : (
            <p className="small text-muted mb-3 fw-medium">
              By {course.instructor?.username || 'Expert'}
            </p>
          )}

          <div className="mt-auto pt-3 border-top d-flex gap-2 w-100">
            {renderActions ? renderActions(course) : onViewCourse && (
              <Button 
                variant="primary" 
                className="w-100 fw-bold rounded-pill shadow-sm d-flex justify-content-center align-items-center gap-2"
                onClick={onViewCourse}
              >
                View Course <BsArrowRightCircle />
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Video Modal */}
      {hasVideo && (
        <Modal 
          show={showVideo} 
          onHide={() => setShowVideo(false)} 
          size="lg" 
          centered
          contentClassName="bg-transparent border-0"
        >
          <Modal.Header closeButton closeVariant="white" className="border-0 pb-0" />
          <Modal.Body className="p-0">
            <div className="ratio ratio-16x9 bg-dark rounded-4 overflow-hidden shadow-lg">
              <video 
                src={course.thumbnail_url} 
                controls 
                autoPlay 
                controlsList="nodownload"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
