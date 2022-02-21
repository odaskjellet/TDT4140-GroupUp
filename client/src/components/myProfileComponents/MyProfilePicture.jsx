
import Picture from './picture.jpg';


function MyProfilePicture() {
  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '20%',
      transform: 'translate(-50%, -50%)',
    }}>
      <img style={{width: '160px', height: '160px', borderRadius: '80px'}} src={Picture} alt="Profile picture" />
    </div>
  );
}


export default MyProfilePicture;
