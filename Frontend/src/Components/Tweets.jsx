import React from "react";
import Avatar from "react-avatar";
import { FaImage } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { Link } from "react-router-dom";
import { PiBookmarkSimpleBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {TWEET_API_END_POINT} from '../Utils/constant'
import { getRefresh } from "../redux/tweetSlice";
import {toast} from 'react-hot-toast'
import { MdOutlineDelete } from "react-icons/md";



const  Tweets=({tweet})=> {
  
  const {userDetails}=tweet;

  


  const {user}=useSelector(store=>store.user);
 
  const dispatch=useDispatch();


 
  const likeDisLikeHandler= async (id)=>{
          try {
            console.log("tweet",tweet);
              const res=await axios.put(`${TWEET_API_END_POINT}/tweetLikeOrDisLike/${id}`, {id:user?._id}, {
                withCredentials:true
              })
              dispatch(getRefresh());
        
              console.log("likes res->",res);

              if(res?.data?.success){
                  toast.success(res?.data?.message);
              }
              else{
                toast.success(res?.data?.message);
              }
          }
           catch (error) {
              console.error(error);
          }
  }
    
  const DeleteTweetHandler=async (tweetId)=>{
            try {

                    const res=await axios.delete(`${TWEET_API_END_POINT}/deleteTweet/${tweetId}`,{
                      withCredentials:true
                    })
                    dispatch(getRefresh());
                    if(res?.data?.success){
                      toast.success(res?.data?.message);
                    }
                    else{
                      toast.success(res?.data?.message);
                    }
                    console.log("res inside DeleteHandler-> ",res);
            } 
            catch(error){
                console.error(error);
            }
     }
  return (
    <>
      <div className="border-b border-gray-200">
        <div className="w-full">
          <div>
            <div className="ml-1 flex  items-center">
              <Avatar
                className="m-1 cursor-pointer"
                src="https://tecdn.b-cdn.net/img/new/avatars/2.webp"
                size="50"
                round={true}/>
              <div className="ml-2 w-full">
                <div className="flex ml-2 items-center mt-4">
                  <h1 className="font-bold text-lg ml-1">{userDetails[0]?.firstName}</h1>
                  <p className="ml-1">{userDetails[0]?.userName} .1m</p>
                  
                </div>
                <div>
                  <p>{tweet?.description}</p>
                </div>
              </div>
            </div>
            <div>
            <div className="flex justify-between p-8">
                <div className="flex  hover:bg-green-200 p-2 rounded-full cursor-pointer">
                <FaRegComment size={23}/>
                <p className="ml-2">0</p>
                </div>
                <div className="flex hover:bg-pink-200 p-2 rounded-full cursor-pointer">
               <Link onClick={()=>likeDisLikeHandler(tweet?._id)}>
               <BiLike size={25}/>
               </Link>
                <p className="ml-2">{`${tweet.likes.length}`}</p>
                </div>
                <div className="flex hover:bg-yellow-200 p-2 rounded-full cursor-pointer">
                <PiBookmarkSimpleBold size={25}/>
                <p className="ml-2">0</p>
                </div>
                <div className="flex items-center">
               <Link onClick={()=>DeleteTweetHandler(tweet?._id)}>
                 <MdOutlineDelete  size={25}/> 
               </Link>
             
                
                </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tweets;
