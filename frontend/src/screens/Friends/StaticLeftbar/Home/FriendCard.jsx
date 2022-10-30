import { Avatar } from '@mui/material';
import MUI from '../../../../components/MUI';

export default function FriendCard(props) {
  const { profileDetails, firstButtonConfig, secondButtonConfig } = props;

  return (
    <div className="friend-card">
      <Avatar
        className="image"
        alt="avatar"
        src={profileDetails.picture}
      >
        {profileDetails.profile_name?.at(0)}
      </Avatar>
      <div className="bottom">
        <span>{profileDetails.profile_name}</span>

        <MUI.Button
          style={{ marginTop: '12px' }}
          {...firstButtonConfig}
        >
          Confirm
        </MUI.Button>
        <MUI.Button
          style={{ marginTop: '12px' }}
          {...secondButtonConfig}
        >
          Deny
        </MUI.Button>
      </div>
    </div>
  );
}
