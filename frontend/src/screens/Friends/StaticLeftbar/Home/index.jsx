import { useLayoutEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FriendCard from './FriendCard';
import {
  acceptSaga,
  addFriendSaga,
  denySaga,
  getFriendRequestSaga,
  getFriendSuggestionSaga,
} from '../../../../redux/friend/friendSlice';
import '../index.css';

const FriendHome = () => {
  const reRenderLayout = useOutletContext();
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state) => state.auth?.login?.currentUser?.access
  );
  const refreshToken = useSelector(
    (state) => state.auth?.login?.currentUser?.refresh
  );
  const friendRequests = useSelector(
    (state) => state.friends?.getRequests?.data?.data
  );
  const friendSuggestions = useSelector(
    (state) => state.friends?.getSuggestion?.data?.data
  );

  useLayoutEffect(() => {
    let onDestroy = false;
    if (!onDestroy) {
      reRenderLayout(); //re-render the parent layout

      dispatch(
        getFriendRequestSaga({
          accessToken,
          refreshToken,
          callRefreshFriend: true,
          dispatch,
        })
      );

      dispatch(
        getFriendSuggestionSaga({
          accessToken,
          refreshToken,
          callRefreshFriendSuggestion: true,
          dispatch,
        })
      );
    }
    return () => {
      onDestroy = true;
    };
  }, []);

  return (
    <>
      <h2 className="friend-home-title">Friend Requests</h2>
      {friendRequests?.length > 0 ? (
        <div className="friend-home-grid">
          {friendRequests.map((item, index) => (
            <div key={index}>
              <FriendCard
                profileDetails={item}
                firstButtonConfig={{
                  onClick: () => {
                    dispatch(
                      acceptSaga({
                        accessToken,
                        refreshToken,
                        id: item.profile_id,
                        dispatch,
                      })
                    );
                  },
                }}
                secondButtonConfig={{
                  onClick: () => {
                    dispatch(
                      denySaga({
                        accessToken,
                        refreshToken,
                        id: item.profile_id,
                        dispatch,
                      })
                    );
                  },
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <h3 className="text-[8rem] text-center pt-[10rem]">
          You have no friend requests
        </h3>
      )}

      <h2 className="friend-home-title">People you may know</h2>
      {friendSuggestions?.length > 0 ? (
        <div className="friend-home-grid">
          {friendSuggestions?.map((item, index) => (
            <div key={index}>
              <FriendCard
                type="suggestions"
                profileDetails={item}
                firstButtonConfig={{
                  name:
                    item.isSentFriendRequest != 'REQUEST'
                      ? 'Add Friend'
                      : 'Cancel',
                  onClick: () => {
                    dispatch(
                      addFriendSaga({
                        accessToken,
                        refreshToken,
                        id: item.profile_id,
                        dispatch,
                      })
                    );
                  },
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <h3 className="text-[8rem] text-center pt-[10rem]">
          No one here
        </h3>
      )}
    </>
  );
};

export default FriendHome;
