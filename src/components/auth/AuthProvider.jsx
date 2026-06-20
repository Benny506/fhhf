import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authBootstrapper } from '../../utils/authBootstrapper';
import AppLoader from '../ui/AppLoader';

export default function AuthProvider({ children }) {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrapAuth = async () => {
      await authBootstrapper(dispatch);
      setIsBootstrapping(false);
    };
    
    bootstrapAuth();
  }, [dispatch]);

  if (isBootstrapping) {
    return <AppLoader active={true} label="Authenticating session..." />;
  }

  return children;
}
