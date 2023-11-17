import { useParams, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function GroupDetails() {
  const { groupId } = useParams();
  const groups = useSelector(state => Object.values(state.groupState.Groups));
  const group = groups.find(el => el.id == groupId);

  return (
    <>
      <NavLink to='/groups'>&lt; Groups</NavLink>
      <h1>{group.name}</h1>
    </>
  )
}
