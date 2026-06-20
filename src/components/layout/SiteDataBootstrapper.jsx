import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import supabase from '../../utils/supabase';
import { setSiteContent } from '../../redux/slices/siteContentSlice';
import { showAppLoader, hideAppLoader } from '../../redux/slices/uiSlice';

export default function SiteDataBootstrapper({ children }) {
  const dispatch = useDispatch();
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  useEffect(() => {
    let alive = true;

    const fetchSiteContent = async () => {
      dispatch(showAppLoader('Loading site content...'));
      
      try {
        const { data, error } = await supabase
          .from('fhhf_site_content')
          .select('*');

        if (!alive) return;

        if (error) {
          console.error('Error fetching site content:', error);
          // Even on error, we unlock the app so it doesn't stay frozen
        } else if (data) {
          dispatch(setSiteContent(data));
        }
      } catch (err) {
        console.error('Bootstrapper error:', err);
      } finally {
        if (alive) {
          setIsBootstrapped(true);
          dispatch(hideAppLoader());
        }
      }
    };

    fetchSiteContent();

    return () => {
      alive = false;
    };
  }, [dispatch]);

  if (!isBootstrapped) return null;

  return <>{children}</>;
}
