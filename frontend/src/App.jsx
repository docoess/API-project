import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import LandingPage from './components/LandingPage';
import GroupList from './components/GroupList';
import EventList from './components/EventList';
import GroupDetails from './components/GroupList/GroupDetails';
import CreateGroupForm from './components/GroupList/CreateGroupForm';
import UpdateGroupForm from './components/GroupList/UpdateGroupForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      {
       isLoaded &&
        <>
          <Navigation isLoaded={isLoaded} />
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/groups' element={<GroupList />} />
            <Route path='/events' element={<EventList />} />
            <Route path='/groups/:groupId' element={<GroupDetails />} />
            <Route path='/groups/new' element={<CreateGroupForm />} />
            <Route path='/groups/:groupId/edit' element={<UpdateGroupForm />} />
          </Routes>
        </>
      }
    </>
  );
}

function App() {
  return <Layout />;
}

export default App;
