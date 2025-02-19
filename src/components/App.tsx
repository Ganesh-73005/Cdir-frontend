import CollegeMap from './CollegeMap';
import {useState,useEffect} from 'react';
import Loader from './elements/Loader';


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (e.g., 3 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timeout
  }, []);

  return (
    <div className="App">
      {loading ? <Loader/> : <CollegeMap />}
    </div>
  );
}

export default App;
