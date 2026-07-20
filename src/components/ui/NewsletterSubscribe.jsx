import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAlert, showSubtleLoader, hideSubtleLoader } from '../../redux/slices/uiSlice';
import supabase from '../../utils/supabase';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    dispatch(showSubtleLoader('Subscribing...'));

    try {
      const { error } = await supabase
        .from('fhhf_newsletter')
        .upsert({ email: email.trim() });

      if (error) {
        throw error;
      }

      dispatch(addAlert({
        variant: 'success',
        title: 'Subscribed Successfully!',
        message: "Thank you for subscribing to our newsletter! We'll keep you updated."
      }));

      setEmail('');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      dispatch(addAlert({
        variant: 'danger',
        message: 'Something went wrong. Please try again later.'
      }));
    } finally {
      setIsLoading(false);
      dispatch(hideSubtleLoader());
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="d-flex w-100">
      <input
        type="email"
        className="form-control rounded-0 shadow-none border-secondary"
        placeholder="Email address"
        style={{ backgroundColor: 'transparent' }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required
      />
      <button
        type="submit"
        className="btn btn-primary rounded-0 px-3 d-flex align-items-center justify-content-center"
        disabled={isLoading}
      >
        →
      </button>
    </form>
  );
}
