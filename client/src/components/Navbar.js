import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const navigate = useNavigate();

  const getCurrentDateAndTimeZone = () => {
    const date = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short' 
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    const timeZone = date.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];
    setCurrentDate(formattedDate);
    setTimeZone(timeZone);
  };

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
    getCurrentDateAndTimeZone();

    const interval = setInterval(getCurrentDateAndTimeZone, 1000);

    return () => clearInterval(interval); 
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <div style={styles.leftItems}>
          <li style={styles.navItem}>
            <Link to="/products" style={styles.navLink}>Products</Link>
          </li>
          {userEmail && (
            <li style={styles.navItem}>
              <Link to="/admin" style={styles.navLink}>Admin</Link>
            </li>
          )}
          <li style={styles.navItem}>
            <Link to="/api-demo" style={styles.navLink}>APIs</Link>
          </li>
        </div>

        <div style={styles.rightItems}>
          {userEmail ? (
            <>
              <div style={styles.dateTime}>
                <span>{currentDate}</span>
                <span> (Time Zone: {timeZone} ) </span>
              </div>
              <span style={styles.navLink}>Welcome, {userEmail}</span>
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={styles.navLink}>Login</Link>
          )}
        </div>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#333',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  leftItems: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  rightItems: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navItem: {
    marginRight: '20px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '18px',
    marginLeft: '10px',
  },
  dateTime: {
    color: '#fff',
    fontSize: '14px',
    marginLeft: '20px',
  },
};

export default Navbar;
