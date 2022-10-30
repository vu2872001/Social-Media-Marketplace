import { Route, Routes } from 'react-router-dom';
import Home from './screens/Home/Home';
import Login from './screens/Auth/Login';
import Register from './screens/Auth/Register';
import WithNav from '../src/components/Layout/Navbar/WithNav';
import WithoutNav from '../src/components/Layout/Navbar/WithoutNav';
import UserProfile from './screens/UserProfile/UserProfile';
import Settings from './screens/Setting/Settings';
import Messenger from './screens/Messenger/Messenger';
import RequireAuth from './screens/Auth/RequireAuth';
import Error from './screens/Error/Error';
import { DynamicLeftbarLayout, StaticLeftbarLayout } from './screens/Friends';
import { FriendHome, Birthday, } from './screens/Friends/StaticLeftbar';
import { AllFriends, FriendRequests, FriendSuggestions } from './screens/Friends/DynamicLeftbar';

function App() {
  return (
    <>
      <Routes>
        <Route element={<WithoutNav />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        <Route element={<RequireAuth />}>
          <Route element={<WithNav />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="friends" element={<StaticLeftbarLayout />}>
              <Route path="" element={<FriendHome />} />
              <Route path="birthdays" element={<Birthday />} />
            </Route>

            <Route path="friends/" element={<DynamicLeftbarLayout />}>
              <Route path="requests" element={<FriendRequests />} />
              <Route path="suggestions" element={<FriendSuggestions />} />
              <Route path="all" element={<AllFriends />} />
            </Route>
            <Route path='/messenger' element={<Messenger/>} />
          </Route>
        </Route>

        <Route path="*" element={<Error />} />
        <Route path="forbidden" element={<Error status="403" />} />
      </Routes>
    </>
  );
}

export default App;
