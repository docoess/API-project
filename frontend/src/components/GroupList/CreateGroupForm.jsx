import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { thunkFetchPostGroup } from '../../store/groups';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './CreateGroupForm.css';

export default function CreateGroupForm() {
  const [groupName, setGroupName] = useState('');
  const [groupLoc, setGroupLoc] = useState('');
  const [groupAbout, setGroupAbout] = useState('');
  const [groupPrivacy, setGroupPrivacy] = useState('');
  const [groupType, setGroupType] = useState('');
  const [groupImg, setGroupImg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const errors = {};

    if (!groupLoc) {
      errors.loc = 'Location is required'
    }

    if (!groupName) {
      errors.name = 'Name is required'
    }

    if (groupAbout.length < 50) {
      errors.desc = 'Description must be at least 50 characters long'
    }

    if (groupType === '') {
      errors.type = 'Group Type is required'
    }

    if (groupPrivacy === '') {
      errors.privacy = 'Visibility Type is required'
    }

    if (!groupImg || (!groupImg.endsWith('.png') && !groupImg.endsWith('.jpg') && !groupImg.endsWith('.jpeg'))) {
      errors.image = 'Image URL must end in .png, .jpg, or .jpeg';
    }

    setValidationErrors(errors);
  }, [groupName, groupLoc, groupAbout, groupPrivacy, groupType, groupImg]);

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
        "state": locState,
        "previewImage": groupImg
      }

      const createGroupImageReqBody = {
        "url": groupImg,
        "preview": true
      }

      const newGroup = await dispatch(thunkFetchPostGroup(createGroupReqBody));
      const newGroupId = newGroup.id;

      await fetch(`/api/groups/${newGroupId}/images`, {method: 'POST', headers: {"Content-Type": "application/json", "XSRF-Token": Cookies.get('XSRF-TOKEN')}, body: JSON.stringify(createGroupImageReqBody)})


      navigate(`/groups/${newGroupId}`);

    }
  }

  return (
    <>
      <p id='create-group-title'>BECOME AN ORGANIZER</p>
      <p className='create-group-heading-top'>We&apos;ll walk you through a few steps to build your local community</p>
      <form onSubmit={onSubmit}>
        <p className='create-group-heading'>First, set your group&apos;s location.</p>
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
        <p className='create-group-heading'>What will your group&apos;s name be?</p>
        <p>Choose a name that will give people a clear idea of what the group is about.
           Feel free to get creative! You can edit this later if you change your mind.
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
        <p className='create-group-heading'>Describe the purpose of your group.</p>
        <p>People will see this when we promote your group, but you&apos;ll be able to
           add to it later, too.
        </p>
        <ol>
          <li>What&apos;s the purpose of the group?</li>
          <li>Who should join?</li>
          <li>What will you do at your events?</li>
        </ol>
        <textarea
          id='create-group-textarea'
          onChange={e => setGroupAbout(e.target.value)}
          value={groupAbout}
          placeholder='Please write at least 50 characters.'
        />
        <p className='create-group-errors'>
          {hasSubmitted && validationErrors.desc && validationErrors.desc}
        </p>
        <div className='create-group-bottom'>
          <p className='create-group-heading'>Final steps...</p>
          <label>Is this an in-person or online group?</label>
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
          <label>Is this group private or public?</label>
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
          <label>Please add an image URL for your group below:</label>
          <input
            type="text"
            onChange={e => setGroupImg(e.target.value)}
            value={groupImg}
            placeholder='Image Url'
          />
          <p className='create-group-errors'>
            {hasSubmitted && validationErrors.image && validationErrors.image}
          </p>
        </div>
        <div className='create-group-btn-div'>
          <button id='create-group-btn'>Create Group</button>
        </div>
      </form>
    </>
  )
}
