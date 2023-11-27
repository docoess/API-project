import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { thunkFetchGroupInfo, thunkFetchPutGroup } from '../../store/groups';
import './UpdateGroupForm.css';

export default function UpdateGroupForm() {
  const { groupId } = useParams();
  const group = useSelector(state => state.groupState[groupId]);
  const user = useSelector(state => state.session.user);
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState(group && `${group.name}`);
  const [groupLoc, setGroupLoc] = useState(group && `${group.city}, ${group.state}`);
  const [groupAbout, setGroupAbout] = useState(group && `${group.about}`);
  const [groupPrivacy, setGroupPrivacy] = useState(group && group.private);
  const [groupType, setGroupType] = useState(group && `${group.type}`);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const dispatch = useDispatch();

  if (!user || (user && group && group.organizerId !== user.id)) {
    navigate('/');
  }

  useEffect(() => {

    const getGroupDetails = async () => {
      await dispatch(thunkFetchGroupInfo(groupId));
    }

    getGroupDetails();
  }, [dispatch]);

  useEffect(() => {
    const errors = {};

      if (!groupLoc) {
        errors.loc = 'Location is required'
      }

      if (!groupName) {
        errors.name = 'Name is required'
      }

      if (groupAbout && groupAbout.length < 50) {
        errors.desc = 'Description must be at least 50 characters long'
      }

      if (groupType === '') {
        errors.type = 'Group Type is required'
      }

      if (groupPrivacy === '') {
        errors.privacy = 'Visibility Type is required'
      }

    setValidationErrors(errors);
  }, [groupName, groupLoc, groupAbout, groupPrivacy, groupType]);

  const onSubmit = async e => {
    e.preventDefault();

    setHasSubmitted(true);

    if (!Object.values(validationErrors).length) {
      const splitLoc = groupLoc.split(', ');
      const locCity = splitLoc[0];
      const locState = splitLoc[1];

      const createGroupReqBody = {
        "name": groupName,
        "about": groupAbout,
        "type": groupType,
        "private": groupPrivacy,
        "city": locCity,
        "state": locState
      }

      await dispatch(thunkFetchPutGroup(createGroupReqBody, groupId));

      navigate(`/groups/${groupId}`);

    }
  }



  return (
    <>
    <div id='update-group-form-container'>
        <p id='update-group-title'>UPDATE YOUR GROUP&apos;S INFORMATION</p>
        <p className='update-group-heading-top'>We&apos;ll walk you through a few steps to update your group&apos;s information</p>
        <form onSubmit={onSubmit}>
          <p className='update-group-heading'>First, set your group&apos;s location.</p>
          <p>Meetup groups meet locally, in person, and online. We&apos;ll connect you
            with people in your area.
          </p>
          <input
            type="text"
            onChange={e => setGroupLoc(e.target.value)}
            value={groupLoc}
            placeholder='City, STATE'
          />
          <p className='create-group-errors'>
            {hasSubmitted && validationErrors.loc && validationErrors.loc}
          </p>
          <p className='update-group-heading'>What will your group&apos;s name be?</p>
          <p>Choose a name that will give people a clear idea of what the group is about.
            Feel free to get creative!
          </p>
          <input
            type="text"
            onChange={e => setGroupName(e.target.value)}
            value={groupName}
            placeholder='What is your group name?'
          />
          <p className='create-group-errors'>
            {hasSubmitted && validationErrors.name && validationErrors.name}
          </p>
          <p className='update-group-heading'>Describe the purpose of your group.</p>
          <p>People will see this when we promote your group, but you&apos;ll be able to
            add to it later, too.
          </p>
          <ol>
            <li>What&apos;s the purpose of the group?</li>
            <li>Who should join?</li>
            <li>What will you do at your events?</li>
          </ol>
          <textarea
            onChange={e => setGroupAbout(e.target.value)}
            value={groupAbout}
            placeholder='Please writte at least 50 characters.'
          />
          <p className='create-group-errors'>
            {hasSubmitted && validationErrors.desc && validationErrors.desc}
          </p>
          <div>
            <p className='update-group-heading'>Final steps...</p>
            <p>Is this an in person or online group?</p>
            <select
              onChange={e => setGroupType(e.target.value)}
              value={groupType}
            >
              <option value='' disabled>(select one)</option>
              <option>In person</option>
              <option>Online</option>
            </select>
            <p className='create-group-errors'>
              {hasSubmitted && validationErrors.type && validationErrors.type}
            </p>
            <p>Is this group private or public?</p>
            <select
              onChange={e => setGroupPrivacy(e.target.value === 'Private' ? true : false)}
              value={groupPrivacy === '' ? '' : (groupPrivacy ? 'Private' : 'Public')}
            >
              <option value='' disabled>(select one)</option>
              <option>Private</option>
              <option>Public</option>
            </select>
            <p className='create-group-errors'>
              {hasSubmitted && validationErrors.privacy && validationErrors.privacy}
            </p>
          </div>
          <button id='update-group-btn'>Update Group</button>
        </form>
      </div>
    </>
  )
}
