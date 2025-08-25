import React, { useState, useEffect } from 'react';

import './App.css'
import Layout from './Layout/Layout'
import { CircularSpinner } from './Components/Spinner/Spinner.jsx'

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    // Simulate async operation
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return <CircularSpinner />;
  }

  return (
    <>
      <Layout/>
    </>
  )
}

export default App
