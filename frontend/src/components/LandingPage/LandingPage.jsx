import './LandingPage.css';
import ph_ig from './PH_infographic.jpg';
import ph_icon from './PH_icon.jpg';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function LandingPage() {
  const sessionUser = useSelector(state => state.session.user);
  const isLinkInactive = !sessionUser;

  const handleCreateGroup = () => {
    return 'lp-link-text' + (!isLinkInactive ? '' : ' inactive');
  }

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
          <img className='info-pic' src={ph_ig} />
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
          <img className='lp-btn-pic' src={ph_icon} />
          <NavLink to='/groups' className={'lp-link-text'}>See all groups</NavLink>
          <p className='lp-btn-text'>Meetup ipsum dolor amet ham t-bone hamburger
          filet mignon.</p>
        </div>
        <div className='lp-btn-container'>
          <img className='lp-btn-pic' src={ph_icon} />
          <NavLink to='/events' className={'lp-link-text'}>Find an event</NavLink>
          <p className='lp-btn-text'>Meetup ipsum dolor amet ham t-bone hamburger
          filet mignon.</p>
        </div>
        <div className='lp-btn-container'>
          <img className='lp-btn-pic' src={ph_icon} />
          <NavLink className={handleCreateGroup}>Start a group</NavLink>
          <p className='lp-btn-text'>Meetup ipsum dolor amet ham t-bone hamburger
          filet mignon.</p>
        </div>
      </div>
      <div className='lp-sec4-container'>
        <button>Join Meetup</button>
      </div>
    </div>
  )
}
