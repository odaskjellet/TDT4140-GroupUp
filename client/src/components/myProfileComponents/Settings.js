import SettingsPicture from './settingsWheel.png';

function Settings () {
    return (
        <div style={{
            position: 'absolute', 
            left: '60%', 
            top: '12%',
            transform: 'translate(-50%, -50%)'
        }}>
             <img style={{width:"50px", height:"50px", borderRadius:"80px"}} src={SettingsPicture} />
        </div>
    );
}  

export default Settings;