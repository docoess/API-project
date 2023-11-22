import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from './logo.png';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='navbar-container'>
      <li>
        <NavLink exact={'true'} to="/">
          <img className='logo-image' src={logo} />
        </NavLink>
      </li>
      {isLoaded && (
        <li className='profile-button-container'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
