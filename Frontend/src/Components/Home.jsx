import React from 'react'
import LeftSideBar from './LeftSideBar.jsx'
import RightSideBar from './RightSideBar.jsx'
import Feed from "./Feed.jsx"
import { Outlet } from 'react-router-dom'


const Home = () => {
  return (
        <>          
           
  
      <div className='flex justify-between  w-[80%] mx-auto'>
        <LeftSideBar/>
          <Outlet/>
        <RightSideBar/>
       
        </div>
     
        </>
)}

export default Home