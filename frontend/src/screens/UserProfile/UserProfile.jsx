import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AvatarWithText from '../../components/Avatar/AvatarWithText';
import {
  PhotoCamera,
  Edit,
  AddCircle,
  MoreHoriz,
  School,
  Home,
  Favorite,
  AccessTimeFilled,
  RssFeed,
  CloseOutlined,
} from '@mui/icons-material';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import {
  FaUserCheck,
  FaUserPlus,
  FaUserMinus,
  FaUserTimes,
} from 'react-icons/fa';
import { MdWallpaper } from 'react-icons/md';
import {
  Avatar,
  ClickAwayListener,
  Modal,
  Paper,
  TextareaAutosize,
} from '@mui/material';
import SideBarButton from './SideBarButton';
import SideBarLi from './SideBarLi';
import FullWidthHr from '../../components/FullWidthHr/FullWidthHr';
import HoverButton from './HoverButton';
import CardPost from '../../components/Card/CardPost';
import GridSideInfo from './GridSideInfo';
import PostModal from '../Home/PostModal';
import {
  getAllFriends,
  getPostByProfile,
  getProfile,
} from '../../redux/apiRequest';
import { Helper } from '../../utils/Helper';
import MUI from '../../components/MUI';
import {
  acceptSaga,
  addFriendSaga,
  denySaga,
  unfriendSaga,
} from '../../redux/friend/friendSlice';
import {
  updateAvtSaga,
  updateDetailSaga,
  updateWallpaperSaga,
} from '../../redux/profile/profileSlice';
import PostStatus from '../../components/PostStatus/PostStatus';
import { ValidateForm, FormChildren } from '../../components/Form';
import './index.css';

function UserProfile(props) {
  const dispatch = useDispatch();
  const [reRender, setReRender] = useState(false);
  const [openAvatarModal, setOpenAvatarModal] = useState(false); //toggle update avatar modal
  const [openDetailsModal, setOpenDetailsModal] = useState(false); //toggle update details modal
  const [editBio, setEditBio] = useState(false); //toggle edit bio

  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]);

  const SideBarList = [
    { text: 'Went to Truong THCS Long Duc', icon: <School /> },
    { text: 'Lives in Tra Vinh', icon: <Home /> },
    { text: 'Single', icon: <Favorite /> },
    { text: 'Joined on October 2014', icon: <AccessTimeFilled /> },
    { text: 'Followed by 52 people', icon: <RssFeed /> },
  ];

  const accessToken = useSelector(
    (state) => state.auth.login.currentUser.access
  );
  const refreshToken = useSelector(
    (state) => state.auth.login.currentUser.refresh
  );
  const posts = useSelector(
    (state) => state.post.getByProfile?.posts?.results?.data
  );
  const profileData = useSelector(
    (state) => state.profile?.profileDetails?.data
  );
  const userData = useSelector(
    (state) => state.auth?.user?.userData?.profile
  );
  const allFriends = useSelector(
    (state) => state.friends.getAll?.data
  );

  var id = profileData?.profile_id ?? userData?.profile_id;
  var profile_description =
    profileData?.profile_description ?? userData?.profile_description;

  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [postUpdateData, setPostUpdateData] = useState();
  const handleOpenPostModel = () => {
    setOpenCreatePost((prev) => !prev);
  };
  const handleGetPostUpdateData = (data) => {
    setPostUpdateData(data);
  };
  const handleActions = (action) => {
    action();
    if (Helper.checkURL('profile', {}, true)) {
      setReRender(!reRender);
    } else {
      props.setReRender(false);
    }
  };

  const [wallpaper, setWallpaper] = useState();
  const [wallpaperURL, setWallpaperURL] = useState();
  const onImageChange = (e) => {
    const [file] = e.target.files;
    setWallpaper(file);
    setWallpaperURL(URL.createObjectURL(file));
  };
  const clearWallpaper = () => {
    setWallpaper('');
    setWallpaperURL('');
  };

  useLayoutEffect(() => {
    let onDestroy = false;
    if (!onDestroy) {
      if (Helper.checkURL('profile', {}, true)) {
        getProfile(
          accessToken,
          refreshToken,
          queryParams.id || id,
          dispatch
        );
        getPostByProfile(
          accessToken,
          refreshToken,
          queryParams.id || id,
          dispatch
        );
        getAllFriends(
          accessToken,
          refreshToken,
          queryParams.id || id,
          dispatch,
          false
        );
      }
    }
    return () => {
      onDestroy = true;
    };
  }, [reRender]);

  return (
    <>
      {openCreatePost && (
        <PostModal
          showModal={openCreatePost}
          postUpdateData={postUpdateData}
          setPostUpdateData={setPostUpdateData}
          setShowModal={setOpenCreatePost}
          setReRender={setReRender}
          profile={profileData}
        />
      )}
      {wallpaper && wallpaperURL && (
        <div id="updateWallpaper">
          <div id="leftSide">
            <MdWallpaper style={{ fontSize: '3.2rem' }} />
            <span className="leading-[1.8rem] text-[1.8rem]">
              Change your wallpaper
            </span>
          </div>
          <div id="rightSide">
            <MUI.Button onClick={clearWallpaper}>Cancel</MUI.Button>
            <MUI.Button
              onClick={() => {
                dispatch(
                  updateWallpaperSaga({
                    accessToken,
                    refreshToken,
                    wallpaper,
                    id,
                    dispatch,
                  })
                );
                clearWallpaper();
              }}
            >
              Save changes
            </MUI.Button>
          </div>
        </div>
      )}
      <div id="profileTop" className="shadow-md">
        <div className="relative h-[46rem]">
          <div
            style={
              wallpaperURL
                ? { backgroundImage: `url(${wallpaperURL}` }
                : profileData?.wallpaper
                ? { backgroundImage: `url(${profileData?.wallpaper}` }
                : null
            }
            id="wallpaper"
            className="shadow-lg"
          ></div>
          {profileData?.profile_id == userData?.profile_id && (
            <>
              <button
                id="editWallpaper"
                className="shadow-inner"
                onClick={() => {
                  document.getElementById('wallpaperRef').click();
                }}
              >
                <PhotoCamera style={{ fontSize: '2.5rem' }} />
                <span className="text-[1.8rem]">Edit Wallpaper</span>
              </button>
              <input
                className="hidden"
                type="file"
                onChange={onImageChange}
                id="wallpaperRef"
              />
            </>
          )}
          <div className="">
            <div className="bigRoundAvt absolute left-[3.5rem] top-[26rem]">
              <Avatar
                sx={{
                  width: '18rem',
                  height: '18rem',
                  fontSize: '10rem',
                }}
                alt={profileData?.profile_name}
                src={profileData?.avatar}
              >
                {profileData?.profile_name?.at(0)}
              </Avatar>
              {profileData?.profile_id == userData?.profile_id && (
                <button
                  className="bg-white absolute right-0 top-[12rem] z-1 p-[0.65rem] rounded-[50%] shadow-lg hover:cursor-pointer"
                  onClick={() => {
                    setOpenAvatarModal(true);
                  }}
                >
                  <PhotoCamera
                    className=" bg-white right-0 top-[12rem] z-1"
                    style={{ fontSize: '2.5rem' }}
                  />
                </button>
              )}
            </div>
            <div className="flex pl-[24rem] pr-[4rem] items-center justify-center py-[3.6rem]">
              <div className="flex-1 flex flex-col gap-[0.3rem] ">
                <span className=" font-semibold text-[3rem]">
                  {profileData?.profile_name}
                </span>
                <span className="text-[1.8rem] leading-[2.4rem] font-bold text-gray-600">
                  {allFriends?.page?.totalElement > 0 &&
                    Helper.isMultiple(
                      'friend',
                      allFriends?.page?.totalElement,
                      ''
                    )}
                </span>
              </div>
              <div className="flex items-end gap-[1rem]">
                <ProfileAction
                  isMainUser={
                    profileData?.profile_id == userData?.profile_id
                  }
                  isFriend={profileData?.isFriend}
                  isSentFriendReq={profileData?.isSentFriendRequest}
                  actionProps={{
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    id: profileData?.profile_id,
                    mainId: userData?.profile_id,
                    dispatch: dispatch,
                  }}
                  action={handleActions}
                />
              </div>
            </div>
            {profileData?.isSentFriendRequest == 'TARGET' && (
              <div className="text-[2rem] flex pl-[24rem] pr-[4rem] py-[2rem] mt-[3.5rem] items-center justify-end bg-[#f7f8fa] rounded-[0.75rem]">
                <span className="flex-1 font-medium">
                  {profileData?.profile_name} sent you a friend
                  request
                </span>
                <div className="flex items-end gap-[1rem]">
                  <MUI.Button
                    className="gap-[0.8rem]"
                    style={{ minWidth: '14rem' }}
                    onClick={() => {
                      handleActions(
                        dispatch(
                          acceptSaga({
                            accessToken,
                            refreshToken,
                            id,
                            dispatch,
                          })
                        )
                      );
                    }}
                  >
                    <FaUserPlus style={{ fontSize: '2.2rem' }} />
                    <span className=" text-[1.6rem] font-semibold">
                      Confirm
                    </span>
                  </MUI.Button>
                  <MUI.Button
                    className="gap-[0.8rem]"
                    style={{ minWidth: '14rem' }}
                    onClick={() => {
                      handleActions(() => {
                        dispatch(
                          denySaga({
                            accessToken,
                            refreshToken,
                            id,
                            dispatch,
                          })
                        );
                      });
                    }}
                  >
                    <FaUserMinus style={{ fontSize: '2.2rem' }} />
                    <span className=" text-[1.6rem] font-semibold">
                      Deny
                    </span>
                  </MUI.Button>
                </div>
              </div>
            )}
            {/* tab in profile - dont delete 
            <hr className="mt-[1.5rem] h-[0.15rem] border-0 bg-slate-300 rounded-sm  w-full " />
            <div className="flex items-center py-[1.5rem] px-[1rem]">
              <HoverButton
                ulGap="1.5rem"
                listButton={[
                  { text: 'Post' },
                  { text: 'About' },
                  { text: 'Friends' },
                  { text: 'Photos' },
                  { text: 'Videos' },
                  { text: 'Check-ins' },
                ]}
              />
              <MoreHoriz
                className="Icon"
                style={{ fontSize: '2.2rem' }}
              />
            </div> */}
          </div>
        </div>
      </div>
      <div className="mt-[2rem] flex mx-auto w-[120rem] gap-[2rem]">
        <div className="leftSideInfo w-[45%]  flex flex-col relative">
          <div className="sticky top-[-83.5rem] ">
            <div className="bg-white rounded-xl p-[1.5rem] shadow-md mb-[2rem] ">
              <div className="flex flex-col">
                <span className="font-bold text-[2.3rem]">Intro</span>
                {userData?.profile_id == profileData?.profile_id ? (
                  !editBio ? (
                    <>
                      {profile_description?.description && (
                        <span id="profileBio">
                          {profile_description?.description}
                        </span>
                      )}
                      <SideBarButton
                        id="editBioBtn"
                        label="Edit bio"
                        onClick={() => {
                          setEditBio(true);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <TextareaAutosize
                        placeholder="Describe Yourself"
                        autoFocus
                        maxLength="200"
                        id="profileBioEditor"
                        defaultValue={
                          profile_description?.description
                        }
                      />
                      <div id="editBioAction">
                        <MUI.Button
                          onClick={() => {
                            setEditBio(false);
                          }}
                        >
                          Cancel
                        </MUI.Button>
                        <MUI.Button
                          onClick={() => {
                            let description = {
                              description: document.getElementById(
                                'profileBioEditor'
                              )?.value,
                            };
                            dispatch(
                              updateDetailSaga({
                                accessToken,
                                refreshToken,
                                description,
                                id,
                                dispatch,
                              })
                            );
                            setEditBio(false);
                          }}
                        >
                          Save
                        </MUI.Button>
                      </div>
                    </>
                  )
                ) : null}
                <ul className="mt-[2rem] flex flex-col gap-[2rem] [&>li]:flex [&>li]:items-center [&>li]:gap-[1rem]">
                  {SideBarList?.map((li, index) => {
                    return (
                      <SideBarLi
                        key={index}
                        text={li.text}
                        icon={li.icon}
                      />
                    );
                  })}
                </ul>
                {userData?.profile_id == profileData?.profile_id && (
                  <SideBarButton
                    label="Edit details"
                    onClick={() => {
                      setOpenDetailsModal(true);
                    }}
                  />
                )}
                {/* <SideBarButton label="Add Hobbies" />
                <SideBarButton label="Add Featured" /> */}
              </div>
            </div>
            <GridSideInfo
              type="photo"
              leftLabel="Photo"
              rightLabel={{ text: 'See all Photos' }}
              listImg={[
                { url: 'https://source.unsplash.com/random/211×212' },
                { url: 'https://source.unsplash.com/random/211×211' },
                { url: 'https://source.unsplash.com/random/211×213' },
                { url: 'https://source.unsplash.com/random/211×214' },
                { url: 'https://source.unsplash.com/random/211×215' },
                { url: 'https://source.unsplash.com/random/211×216' },
                { url: 'https://source.unsplash.com/random/211×218' },
                { url: 'https://source.unsplash.com/random/211×217' },
                { url: 'https://source.unsplash.com/random/211×219' },
              ]}
            />
            {allFriends?.page?.totalElement > 0 && (
              <GridSideInfo
                type="friendPhoto"
                leftLabel="Friends"
                rightLabel={{ text: 'See all Friends' }}
                listImg={allFriends?.data?.map((x) => {
                  return {
                    url: x.avatar,
                    name: x.profile_name,
                  };
                })}
                total={allFriends?.page?.totalElement}
              />
            )}
          </div>
        </div>
        <div className="rightSidePosts w-[55%]">
          {profileData?.profile_id == userData?.profile_id && (
            <PostStatus
              profile={profileData}
              onClick={handleOpenPostModel}
            />
          )}
          {posts?.map((post) => (
            <CardPost
              postData={post}
              key={post.post_id}
              profile={profileData}
              setReRender={setReRender}
              handleOpenPostModel={handleOpenPostModel}
              handleGetPostUpdateData={handleGetPostUpdateData}
            />
          ))}
        </div>
      </div>
      <UpdateAvatar
        modalProps={[openAvatarModal, setOpenAvatarModal]}
        profileData={profileData}
        actionProps={{
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: profileData?.profile_id,
          dispatch: dispatch,
        }}
      />
      <EditDetails
        modalProps={[openDetailsModal, setOpenDetailsModal]}
        profileDescription={profile_description}
        actionProps={{
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: profileData?.profile_id,
          dispatch: dispatch,
        }}
      />
    </>
  );
}

function ProfileAction({
  isMainUser,
  isFriend,
  isSentFriendReq,
  actionProps,
  action,
}) {
  const { accessToken, refreshToken, id, mainId, dispatch } =
    actionProps;
  const navigate = useNavigate();
  const [menuClicked, setMenuClicked] = useState(false);

  function handleFirstAction() {
    if (isMainUser) {
    } else {
      if (isFriend) {
        setMenuClicked(!menuClicked);
      } else {
        if (isSentFriendReq == 'NONE') {
          action(() => {
            dispatch(
              addFriendSaga({
                accessToken,
                refreshToken,
                id,
                dispatch,
              })
            );
          });
        } else if (isSentFriendReq == 'REQUEST') {
          action(() => {
            dispatch(
              addFriendSaga({
                accessToken,
                refreshToken,
                id,
                dispatch,
              })
            );
          });
        } else if (isSentFriendReq == 'TARGET') {
          setMenuClicked(!menuClicked);
        }
      }
    }
  }

  function handleSecondAction() {
    if (isMainUser) {
    } else {
      navigate('/messenger');
    }
  }

  var actionList = [];
  if (isFriend) {
    actionList = [
      {
        middle: 'Unfriend',
        onClick: () => {
          action(() => {
            dispatch(
              unfriendSaga({
                accessToken,
                refreshToken,
                id,
                mainId,
                dispatch,
              })
            );
          });
        },
      },
    ];
  }
  if (isSentFriendReq == 'TARGET') {
    actionList = [
      {
        middle: 'Confirm',
        onClick: () => {
          action(() => {
            dispatch(
              acceptSaga({
                accessToken,
                refreshToken,
                id,
                dispatch,
              })
            );
          });
        },
      },
      {
        middle: 'Deny',
        onClick: () => {
          action(() => {
            dispatch(
              denySaga({
                accessToken,
                refreshToken,
                id,
                dispatch,
              })
            );
          });
        },
      },
    ];
  }

  return (
    <>
      <ClickAwayListener
        onClickAway={() => {
          setMenuClicked(false);
        }}
      >
        <div>
          <MUI.Button
            className="gap-[0.8rem]"
            style={{ minWidth: '14rem' }}
            onClick={handleFirstAction}
          >
            {isMainUser ? (
              <>
                <AddCircle style={{ fontSize: '2.2rem' }} />
                <span className=" text-[1.6rem] font-semibold">
                  Add to story
                </span>
              </>
            ) : isFriend ? (
              <>
                <FaUserCheck style={{ fontSize: '2.2rem' }} />
                <span className=" text-[1.6rem] font-semibold">
                  Friends
                </span>
              </>
            ) : isSentFriendReq == 'NONE' ? (
              <>
                <FaUserPlus style={{ fontSize: '2.2rem' }} />
                <span className=" text-[1.6rem] font-semibold">
                  Add Friend
                </span>
              </>
            ) : isSentFriendReq == 'REQUEST' ? (
              <>
                <FaUserTimes style={{ fontSize: '2.2rem' }} />
                <span className=" text-[1.6rem] font-semibold">
                  Cancel
                </span>
              </>
            ) : isSentFriendReq == 'TARGET' ? (
              <>
                <FaUserCheck style={{ fontSize: '2.2rem' }} />
                <span className=" text-[1.6rem] font-semibold">
                  Respond
                </span>
              </>
            ) : null}
          </MUI.Button>

          {menuClicked && (
            <MUI.Menu
              style={{
                width: 'auto',
                zIndex: 1,
              }}
              list={actionList}
            />
          )}
        </div>
      </ClickAwayListener>

      <MUI.Button
        className="gap-[0.8rem]"
        style={{ minWidth: '14rem' }}
        onClick={handleSecondAction}
      >
        {isMainUser ? (
          <>
            <Edit style={{ fontSize: '2.2rem' }} />
            <span className=" text-[1.6rem] font-semibold">
              Edit profile
            </span>
          </>
        ) : (
          <>
            <BiMessageRoundedDetail style={{ fontSize: '2.2rem' }} />
            <span className=" text-[1.6rem] font-semibold">
              Message
            </span>
          </>
        )}
      </MUI.Button>
    </>
  );
}

function UpdateAvatar({ modalProps, profileData, actionProps }) {
  const { accessToken, refreshToken, id, dispatch } = actionProps;
  const [avatar, setAvatar] = useState();
  const [imageURL, setImageURL] = useState();
  const [openConfirm, setOpenConfirm] = useState(false);

  const onImageChange = (e) => {
    const [file] = e.target.files;
    setAvatar(file);
    setImageURL(URL.createObjectURL(file));
  };

  const handleClose = () => {
    if (imageURL) {
      setOpenConfirm(true);
    } else {
      modalProps[1](false);
    }
  };

  return (
    <Modal
      open={modalProps[0]}
      onClose={handleClose}
      closeAfterTransition
    >
      <Paper id="modal-wrapper" style={{ width: '44rem' }}>
        <div className="text-center">
          <span className="font-bold text-[2rem]">
            Update profile picture
          </span>
          <MUI.BetterIconButton
            onClick={handleClose}
            className="[&>button>svg]:text-[2rem] [&>div]:w-[3.2rem] [&>div]:h-[3.2rem] absolute top-[1.2rem] right-[1.2rem]"
          >
            <CloseOutlined />
          </MUI.BetterIconButton>
        </div>

        <div className="mt-[1.2rem] flex flex-col justify-center items-center gap-[2rem]">
          <div className="relative w-[80%]">
            <MUI.Button
              className="w-[100%]"
              onClick={() => {
                document.getElementById('avatarRef').click();
              }}
            >
              Upload photo
            </MUI.Button>
            <input
              className="hidden"
              type="file"
              onChange={onImageChange}
              id="avatarRef"
            />
          </div>
          <Avatar
            id="modal-avatar"
            alt={profileData?.profile_name}
            src={
              imageURL
                ? imageURL
                : profileData?.avatar
                ? profileData?.avatar
                : null
            }
            onClick={() => {
              document.getElementById('avatarRef').click();
            }}
          >
            {profileData?.profile_name?.at(0)}
          </Avatar>
        </div>

        <div className="mt-[2rem] text-right">
          <MUI.Button
            style={{ marginRight: '1.6rem' }}
            onClick={handleClose}
          >
            Cancel
          </MUI.Button>
          <MUI.Button
            onClick={() => {
              dispatch(
                updateAvtSaga({
                  accessToken,
                  refreshToken,
                  avatar,
                  id,
                  dispatch,
                })
              );
              modalProps[1](false);
            }}
          >
            Save
          </MUI.Button>
        </div>

        <MUI.ConfirmDialog
          modalProps={[openConfirm, setOpenConfirm]}
          title="Discard change"
          actionName="discard change"
          confirmAction={() => {
            setOpenConfirm(false);
            modalProps[1](false);
            setImageURL('');
          }}
        />
      </Paper>
    </Modal>
  );
}

function EditDetails({
  modalProps,
  profileDescription,
  actionProps,
}) {
  const { accessToken, refreshToken, id, dispatch } = actionProps;

  const handleClose = () => {
    modalProps[1](false);
  };

  profileDescription = Helper.isEmptyObject(profileDescription, true)
    ? {
        carrer: '',
        location: '',
        school: '',
      }
    : profileDescription;

  return (
    <Modal
      open={modalProps[0]}
      onClose={handleClose}
      closeAfterTransition
    >
      <Paper id="modal-wrapper">
        <div className="text-center">
          <span className="font-bold text-[2rem]">
            Update details
          </span>
          <MUI.BetterIconButton
            onClick={handleClose}
            className="[&>button>svg]:text-[2rem] [&>div]:w-[3.2rem] [&>div]:h-[3.2rem] absolute top-[1.2rem] right-[1.2rem]"
          >
            <CloseOutlined />
          </MUI.BetterIconButton>
        </div>

        <ValidateForm
          initialValues={profileDescription}
          onSubmit={(values) => {
            var description = values;
            dispatch(updateDetailSaga({accessToken, refreshToken, description, id, dispatch}));
            handleClose();
          }}
          style={{
            width: '52rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <FormChildren.InputForm name="carrer" label="Carrer" />
          <FormChildren.SelectForm name="location" label="Location" options={["HCM", "HN"]} />
          <FormChildren.InputForm name="school" label="School" />
          <div className="w-[100%] flex justify-end gap-[1.2rem]">
            <MUI.Button type="button" name="Cancel" />
            <MUI.Button type="submit" name="Save" />
          </div>
        </ValidateForm>
      </Paper>
    </Modal>
  );
}

export default UserProfile;
