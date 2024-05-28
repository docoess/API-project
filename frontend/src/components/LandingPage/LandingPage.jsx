import './LandingPage.css';
import main_ig from './main.png';
import group_icon from './highfive.png';
import event_icon from './ticketstub.jpg';
import new_group_icon from './group.png';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { thunkFetchGroups } from '../../store/groups';
import { thunkFetchEvents } from '../../store/events';

export default function LandingPage() {
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const isLinkInactive = !sessionUser;

  const handleCreateGroup = () => {
    return 'lp-link-text' + (!isLinkInactive ? '' : ' inactive');
  }

  useEffect(() => {

    const getGroupsAndEvents = async () => {
      await dispatch(thunkFetchGroups());
      await dispatch(thunkFetchEvents());
    }

    getGroupsAndEvents();
  }, [dispatch]);

  return (
    <div className='landing-page-container'>
      <div className='lp-sec1-container'>
        <div className='intro-text'>
          <span className='intro-heading'>The people platform</span>
          <span className='intro-heading'>Where interests</span>
          <span className='intro-heading'>become friendships</span>
          <span className='intro-body'>Meetup ipsum dolor amet ham t-bone hamburger
          filet mignon biltong shank salami sausage ham hock chislic brisket.
          Bresaola swine turkey doner pork chop spare ribs meatloaf
          frankfurter beef turducken.</span>
        </div>
        <div className='infographic'>
          <img className='info-pic' src={main_ig} />
        </div>
      </div>
      <div className='lp-sec2-container'>
        <p className='subtitle-text'>How Meetup works</p>
        <p className='caption-text'>Bacon ipsum dolor amet hamburger
        fatback swine pig burgdoggen shank, shankle jerky ham hock cupim
        meatball ham frankfurter chicken.</p>
      </div>
      <div className='lp-sec3-container'>
        <div className='lp-btn-container'>
          <img className='lp-btn-pic' src={group_icon} />
          <NavLink to='/groups' className={'lp-link-text'}>See all groups</NavLink>
          <p className='lp-btn-text'>Meetup ipsum dolor amet ham t-bone hamburger
          filet mignon.</p>
        </div>
        <div className='lp-btn-container'>
          <img className='lp-btn-pic' src={event_icon} />
          <NavLink to='/events' className={'lp-link-text'}>Find an event</NavLink>
          <p className='lp-btn-text'>Meetup ipsum dolor amet ham t-bone hamburger
          filet mignon.</p>
        </div>
        <div className='lp-btn-container'>
          <img className='lp-btn-pic' src={new_group_icon} />
          <NavLink to='/groups/new' className={handleCreateGroup}>Start a group</NavLink>
          <p className='lp-btn-text'>Meetup ipsum dolor amet ham t-bone hamburger
          filet mignon.</p>
        </div>
      </div>
    </div>
  )
}
