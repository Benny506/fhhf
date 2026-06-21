import supabase from './supabase';
import { setUser, setProfile, clearAuth } from '../redux/slices/authSlice';

export const authBootstrapper = async (dispatch) => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      dispatch(clearAuth());
      return { success: false, reason: 'no_session' };
    }

    const user = session.user;
    
    // Fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('fhhf_user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      // Profile doesn't exist yet, we don't automatically sign out here because 
      // they might have just registered and the trigger hasn't fired or we need to complete registration.
      // We clear the local redux auth state so the app knows they aren't fully authorized yet,
      // but we leave the supabase session active so they can create their profile.
      dispatch(clearAuth());
      return { success: false, reason: 'no_profile' };
    }

    // Success
    dispatch(setUser(user));
    dispatch(setProfile(userProfile));
    return { success: true };

  } catch (err) {
    console.error('Auth bootstrap error:', err);
    await supabase.auth.signOut();
    dispatch(clearAuth());
    return { success: false, reason: 'error' };
  }
};
