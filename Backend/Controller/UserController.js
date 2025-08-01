import bcrypt from "bcrypt";

import User from "../models/User.js";

import cookie from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Tweet from "../models/Tweets.js";
import mongoose from "mongoose";

dotenv.config();

export const signUpController = async (req, res) => {
  try {
    const { firstName, lastName, userName, emailId, password } = req.body;

    const exitUser = await User.findOne({ emailId: emailId });
    if (exitUser) {
      return res.json({ message: "User already exists" });
    }

    // console.log("ifout")

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      /// create a newUser by User Model
      firstName,
      lastName,
      emailId,
      userName,
      password: hashPassword,
    });

    const data = await newUser.save(); // save in database

    return res.json({ message: "signUp Successfully", data });
  } catch (err) {
    // console.log("catch")

    return res.status(400).json({ error: err.message });
  }
};
export const LoginController = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Search User in data
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const userPassword = user.password;

    const isMatch = await bcrypt.compare(password, userPassword); // compare the password of inputPassword with exist password
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" });
    }

    // creating token for create cookie
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); // process.env.JWT_SECRET, secret key

    // send cookie as identity card
    // res.cookie("token",token);

    return res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .json({ message: "Login successfully", user, success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const LogOutController = async (req, res) => {
  try {
    res.cookie("token", process.env.SECRET_KEY, {
      expires: new Date(Date.now()),
    });
    return res.json({ message: "logout succesfully", success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// for updating the profile so we have to first fetch the profile from DB

export const editProfileController = async (req, res) => {
  try {
    const userId = req.userId;
    const loggedinUser = req.user;
    const allowedForEdit = ["firstName", "lastName", "userName", "bio"];

    /*
                    Object.keys() return an array of all keys of object 
                    and .every(()=>{
                        })

                        it iterate all the element of array that return by object.keys(),
                        and run a callback function on each element and if the callback condtion is satisfeid for all elements then it return true otherwise it return false even on one element condition false
                    */
    const isValidUpdate = Object.keys(req.body).every((key) =>
      allowedForEdit.includes(key)
    );
    if (!isValidUpdate) {
      return res.json({ message: "not permissable to edit" });
    }

    Object.keys(req.body).forEach(
      (field) => (loggedinUser[field] = req.body[field])
    ); // update the fields of the loggInUser
    const updated = await loggedinUser.save();

    await Tweet.updateMany(
      { userId: userId },
      {
        $set: {
          "userDetails.0.firstName": updated.firstName,
          "userDetails.0.lastName": updated.lastName,
          "userDetails.0.userName": updated.userName,
          "userDetails.0.bio": updated.bio,
        },
      }
    );

    return res.json({
      message: "Profile updated successfully ",
      updated,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const bookmarksController = async (req, res) => {
  try {
    const userId = req.userId;
    // console.log(userId);
    const tweetId = req.params.id; // find tweetId
    console.log(userId);
    const loggedInUser = await User.findById(userId);
      const tweet = await Tweet.findById(tweetId);
    console.log("tweet-> ",tweet?.userId);
    if(userId===tweet.userId.toString()){
          return res.status(201).json({message:"u can only other's bookmarks "});
    }

    let updatedUserData;
    let bookmarkCnt=0;
    if (loggedInUser.bookmarks.includes(tweetId)) {
       updatedUserData = await User.findByIdAndUpdate(
        userId,
        { $pull: { bookmarks: tweetId } },
        { new: true }
      );
      bookmarkCnt--;
      if(bookmarkCnt<0){
        bookmarkCnt=0;
      }

      return res.json({
        message: " remove bookmarks successfully",
        updatedUserData,
        bookmarkCnt
      });
    } else if(userId!==tweet.userId.toString()) {
      
      updatedUserData = await User.findByIdAndUpdate(
        userId,
        { $push: { bookmarks: tweetId } },
        { new: true }
      );
      bookmarkCnt++;
      return res.json({
        message: " bookmarks successfully",
        updatedUserData,
        bookmarkCnt
      });
    }
    else{
      return res.status(201).json({message:"u can not bookmarks ur tweet "});
    }
  
  } catch (error) {
    return res.status(200).json({ message: error.message });
  }
};
export const getBookmarksTweetsController = async (req, res) => {
  try {
    const { ids } = req.body;
    // const loggedInUser=req.body.params;

    if (ids?.length === 0) {
      return res.status(401).json({ message: "empty ids Array" });
    }
    // const id = "67f5491bb0b176b8142b7a1f";
    // const tweets = await Tweet.findById(id);
    const tweets = await Tweet.find({
      _id: { $in: ids},
    }).sort({ createdAt: -1 });

    console.log(tweets);
    return res.json({ tweets });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
export const getProfileController = async (req, res) => {
  try {
    //   const user=req?.user;
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    return res.json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getOthersProfileController = async (req, res) => {
  try {
    const userId = req.userId;

    const otherUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    if (!otherUsers) {
      return res.status(400).json({ message: "there is not User" });
    }
    return res.json({ message: "get OtherUsersProfile", otherUsers });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const FollowingController = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const loggedInUserId = req.userId;
    const following = loggedInUser?.following;

    const userId = req.params.id;

    const user = await User.findById(userId); // the person , i follow
    if (!user) {
      return res.json({ message: "user not found" });
    }
    const followers = user?.followers;
      let updatedData;
    if (!following.includes(userId)) {
       updatedData=await User.findByIdAndUpdate(loggedInUserId, {
        $push: { following: userId },
      }); // push the user userId into following{ARRAY} of LoggedInUser
      await User.findByIdAndUpdate(userId, {
        $push: { followers: loggedInUserId },
      }); // push the loggedInUserId of loggedInUser into followers{ARRAY} of user
      return res.json({
        message: `You just follow ${user.firstName}`,
        success: true,
        updatedData
      });
    }
    // else{

    //     return res.json({message:`You already follow  ${user.firstName}`});
    // }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
export const unFollowController = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const loggedInUserId = req.userId;
    const following = loggedInUser?.following;

    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ message: "user not found" });
    }
    const followers = user?.followers;

    if (following.includes(userId)) {
      await User.findByIdAndUpdate(loggedInUserId, {
        $pull: { following: userId },
      }); // pull the user userId from following{ARRAY} of LoggedInUser
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: loggedInUserId },
      }); // pull the loggedInUserId of loggedInUser from followers{ARRAY} of user
      return res.json({
        message: `You unfollow  ${user.firstName}`,
        success: true,
      });
    }

    // return res.json({message:`${user.firstName} has not follwed yet`});
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
