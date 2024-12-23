import React from 'react'
import ironman from '../assets/ironman.jpeg'
function ProfilePic() {
  return (
    <div>
      <h2 className='username'>User Name</h2>
      <img src={ironman} alt="User profile" className='userProfile'/>
    </div>
  )
}

export default ProfilePic;
