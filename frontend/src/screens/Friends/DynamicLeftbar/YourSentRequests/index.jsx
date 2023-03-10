import { useLayoutEffect, useMemo, useState, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import TwoColumns from '../../../../components/Layout/TwoColumns';
import LeftbarTitle from '../LeftbarTitle';
import { LeftbarSentRequest } from '../LeftbarMiddleItem';
import UserProfile from '../../../UserProfile/UserProfile';
import { Helper } from '../../../../utils/Helper';
import { getAllSentRequest } from '../../../../redux/friend/friendAPI';
import { addFriendRequest } from '../../../../redux/friend/friendSaga';
import {
  getGalleryImg,
  getProfileDetail,
} from '../../../../redux/profile/profileAPI';
import { getPostByProfile } from '../../../../redux/apiRequest';
import { getAllFriend } from '../../../../redux/friend/friendAPI';
import '../index.css';

export default function YourSentRequests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = location.search.slice(1).replace(/id=/gi, ''); //remove all the "id=" with this regex

  // #region redux variables
  const accessToken = useSelector(
    (state) => state.auth?.login?.currentUser?.access
  );
  const refreshToken = useSelector(
    (state) => state.auth?.login?.currentUser?.refresh
  );
  const profileData = useSelector(
    (state) => state.profile?.profileDetails?.data
  );
  const sentRequests = useSelector(
    (state) => state.friends?.getSentRequests?.data,
    shallowEqual
  );
  const isFetchingSent = useSelector(
    (state) => state.friends?.getSentRequests?.isFetching
  );
  const isFetchingProfileDetail = useSelector(
    (state) => state.profile?.profileDetails?.isFetching
  );
  const isFetchingCancel = useSelector(
    (state) => state.friends?.addFriend?.isFetching
  );
  // #endregion

  const [listCancel, setListCancel] = useState([]);
  const currentId = useRef(null);

  var sentList = useMemo(() => {
    return sentRequests;
  }, [sentRequests]);

  var checkId = useMemo(() => {
    return sentList?.data?.some(
      (e) => e.profile_id.toString() === queryParams.toString()
    );
  }, [queryParams]);

  var checkQueryParam = useMemo(() => {
    return Helper.isNullOrEmpty(queryParams);
  }, [queryParams]);

  // #region loading variables
  var isLoadingSent = useMemo(() => {
    var result = false;
    if (isFetchingSent) {
      result = true;
    } else {
      result = false;
    }
    return result;
  }, [isFetchingSent]);

  var isLoadingProfileDetail = useMemo(() => {
    var result = false;
    if (isFetchingProfileDetail) {
      result = true;
    } else {
      result = false;
    }
    return result;
  }, [isFetchingProfileDetail]);

  var isLoadingCancel = useMemo(() => {
    var result = false;
    if (isFetchingCancel) {
      result = true;
    } else {
      result = false;
    }
    return result;
  }, [isFetchingCancel]);
  // #endregion

  // call get all sent requests once
  useLayoutEffect(() => {
    let onDestroy = false;
    if (!onDestroy) {
      getAllSentRequest(accessToken, refreshToken, dispatch);
    }
    return () => {
      onDestroy = true;
    };
  }, []);

  // view profile details
  useLayoutEffect(() => {
    let onDestroy = false;
    if (!onDestroy) {
      if (!checkQueryParam) {
        getProfileDetail(
          accessToken,
          refreshToken,
          queryParams,
          dispatch
        );
        getPostByProfile(
          accessToken,
          refreshToken,
          queryParams,
          dispatch
        );
        getGalleryImg(
          accessToken,
          refreshToken,
          queryParams,
          dispatch
        );
        getAllFriend(
          accessToken,
          refreshToken,
          queryParams,
          dispatch
        );
      }
    }
    return () => {
      onDestroy = true;
    };
  }, [location]);

  return (
    <TwoColumns
      leftBarConfig={{
        classNameConfig: {
          listClassname: 'friend-list suggestions',
        },
        before: (
          <LeftbarTitle
            title="Sent Requests"
            subTitle={
              isLoadingSent
                ? null
                : Helper.isMultiple(
                    'Sent Request',
                    sentList?.page?.totalElement,
                    'You Have Not Sent Any Request'
                  )
            }
          />
        ),
        after: isLoadingSent && (
          <div className="friend-left-bar-skeleton">
            {[...Array(8)].map((item, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                width={360}
                height={96}
              />
            ))}
          </div>
        ),
        leftBarList: isLoadingSent
          ? null
          : sentList?.data?.map((x) => {
              var profileChecked =
                !checkQueryParam &&
                x.profile_id === profileData?.profile_id;

              return {
                left: {
                  url: x.avatar,
                  name: x.profile_name,
                },
                middle: (
                  <LeftbarSentRequest
                    profile={x}
                    listCancel={listCancel}
                    isLoading={isLoadingCancel}
                    currentId={currentId.current}
                    cancelButtonConfig={{
                      onClick: (e) => {
                        e.stopPropagation();
                        addFriendRequest({
                          accessToken,
                          refreshToken,
                          id: x.profile_id,
                          callRefreshProfile: profileChecked,
                          dispatch,
                        });

                        setListCancel((old) => [
                          ...old,
                          x.profile_id,
                        ]);

                        currentId.current = x.profile_id;
                      },
                    }}
                  />
                ),
                onClick: () => {
                  navigate(`?id=${x.profile_id}`);
                },
                selected: !isLoadingProfileDetail && profileChecked,
                disabled: isLoadingProfileDetail
                  ? true
                  : profileChecked,
              };
            }),
        leftBarColor: 'white',
      }}
    >
      {!checkQueryParam && checkId && (
        <UserProfile action={setListCancel} actionList={listCancel} />
      )}
    </TwoColumns>
  );
}
