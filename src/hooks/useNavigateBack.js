import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for navigating back to previous page
 * Falls back to Dashboard if no history available
 */
export function useNavigateBack() {
  const navigate = useNavigate();
  
  const goBack = () => {
    // Try to use browser back button first
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to dashboard if no history
      navigate('/dashboard');
    }
  };
  
  return goBack;
}

export default useNavigateBack;
