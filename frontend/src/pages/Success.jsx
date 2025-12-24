import React, { useEffect, useState, useRef } from 'react'; // Added useRef
import { useSearchParams, useNavigate } from 'react-router-dom';

const Success = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const navigate = useNavigate();
  
  // 🛡️ THE FIX: This "lock" prevents the double-call in React Strict Mode
  const processingRef = useRef(false); 

  const sessionId = searchParams.get('session_id');
  const eventId = searchParams.get('eventId');

  useEffect(() => {
    const confirmBooking = async () => {
      // If already processing, don't run again
      if (processingRef.current) return; 
      processingRef.current = true;

      try {
        const response = await fetch('http://localhost:5000/api/payments/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, eventId }),
        });

        if (response.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus('error');
      }
    };

    if (sessionId && eventId) {
      confirmBooking();
    }
  }, [sessionId, eventId]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      {status === 'processing' && (
        <div>
          <div className="spinner"></div> {/* You can add a CSS spinner here */}
          <h2>Confirming your payment...</h2>
        </div>
      )}
      {status === 'success' && (
        <div style={{ animation: 'fadeIn 0.5s' }}>
          <h1 style={{ color: '#22c55e', fontSize: '3rem' }}>✅</h1>
          <h1 style={{ color: '#1f2937' }}>Payment Successful!</h1>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>Your ticket has been booked. Check "My Tickets" for details.</p>
          <button 
            onClick={() => navigate('/my-tickets')}
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '12px 24px', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            Go to My Tickets
          </button>
        </div>
      )}
      {status === 'error' && (
        <div>
          <h1 style={{ color: '#ef4444', fontSize: '3rem' }}>❌</h1>
          <h1 style={{ color: '#1f2937' }}>Something went wrong.</h1>
          <p style={{ color: '#6b7280' }}>We couldn't verify your payment. Please contact support.</p>
          <button onClick={() => navigate('/')} style={{ marginTop: '20px', color: '#2563eb' }}>Return Home</button>
        </div>
      )}
    </div>
  );
};

export default Success;