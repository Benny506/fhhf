import React from 'react';
import { useSelector } from 'react-redux';
import { getUiState } from '../../redux/slices/uiSlice';
import { BsList } from 'react-icons/bs';

export default function Topbar({ onToggleSidebar, isMobile }) {
  const { title, description } = useSelector(state => getUiState(state).topbarConfig);
  const profile = useSelector((state) => state.auth.profile);
  
  const initial = profile?.username ? profile.username.charAt(0).toUpperCase() : 'U';

  return (
    <header className="topbar-wrapper d-flex align-items-center justify-content-between shadow-sm">
      <div className="d-flex align-items-center gap-3">
        {isMobile && (
          <button 
            className="btn btn-link text-primary p-0 text-decoration-none border-0" 
            onClick={onToggleSidebar}
          >
            <BsList size={28} />
          </button>
        )}
        <div>
          <h4 className="m-0 fw-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-family-heading)' }}>
            {title}
          </h4>
          {!isMobile && description && (
            <p className="m-0 text-secondary small">{description}</p>
          )}
        </div>
      </div>
      
      <div className="d-flex align-items-center">
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center border shadow-sm" 
          style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)' }}
          title={profile?.username || 'User Profile'}
        >
          <span className="fw-bold">{initial}</span>
        </div>
      </div>
    </header>
  );
}
