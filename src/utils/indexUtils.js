const { postModel } = require("../models/postModel");
const mongoose = require('mongoose')

async function fetchMyPosts(email){
    let result = {
        success: false,
        message: "",
        data: ""
    }
    try{
        let posts = await postModel.find({ userEmail: email});
        if(posts.length != 0){
            result.success = true;
            result.message = "Fetched posts";
            result.data = posts;
        }
        else{
            result.message = "No posts till now";
        }
    }
    catch(e){
        result.message = "Failed to fetch posts";
    }
    return result;
}



async function addUserToLikedArray(email,postid){
    //postid is object id
    let result = {
        success: false,
        message: "",
        data: ""
    }
    try{
        let updateResult = await postModel.updateOne({_id:new mongoose.Types.ObjectId(postid)},{$push:{likedUsers:email}});
        if(updateResult.modifiedCount != 0){
            result.success = true;
            result.message = "Added user to liked list";
            result.data = "";
        }
        else{
            result.message = "Addeding user to liked list failed";
        }
    }
    catch(e){
        result.message = "failed to add user to liked list";
    }
    return result;
}



async function removeUserFromLikedArray(email,postid){
    //postid is object id
    let result = {
        success: false,
        message: "",
        data: ""
    }
    try{
        let updateResult = await postModel.updateOne({_id:new mongoose.Types.ObjectId(postid)},{$pull:{likedUsers:email}});
        if(updateResult.modifiedCount != 0){
            result.success = true;
            result.message = "removed user from liked list";
            result.data = "";
        }
        else{
            result.message = "removing user from liked list failed";
        }
    }
    catch(e){
        result.message = "failed to remove user from liked list";
    }
    return result;
}



async function removeUserFromDislikedArray(email,postid){
    let result = {
        success: false,
        message: "",
        data: ""
    }
    try{
        let updateResult = await postModel.updateOne({_id:new mongoose.Types.ObjectId(postid)},{$pull:{dislikedUsers:email}});
        if(updateResult.modifiedCount != 0){
            result.success = true;
            result.message = "removed user from dislikedUsers list";
            result.data = "";
        }
        else{
            result.message = "removing user from dislikedUsers list failed";
        }
    }
    catch(e){
        result.message = "failed to remove user from dislikedUsers list";
    }
    return result;
}



async function addUserToDislikedArray(email,postid){
    let result = {
        success: false,
        message: "",
        data: ""
    }
    try{
        let updateResult = await postModel.updateOne({_id:new mongoose.Types.ObjectId(postid)},{$push:{dislikedUsers:email}});
        if(updateResult.modifiedCount != 0){
            result.success = true;
            result.message = "Added user to dislikedUsers list";
            result.data = "";
        }
        else{
            result.message = "Addeding user to dislikedUsers list failed";
        }
    }
    catch(e){
        result.message = "failed to add user to dislikedUsers list";
    }
    return result;
}




async function fetchPostData(postid){
    //postid is object id
    let result = {
        success: false,
        message: "",
        data: ""
    }
    // console.log("postid",new mongoose.Types.ObjectId(postid))
    try{
        let fetchResult = await postModel.findOne({_id: new mongoose.Types.ObjectId(postid)});
            result.success = true;
            result.message = "fetched post data";
            result.data = fetchResult;
    }
    catch(e){
        result.message = "fetching post data failed";
    }
    return result;
}



async function addNewComment(commentData){
    let result = {
        success: false,
        message: "",
        data: ""
    }
    // console.log("commentData",commentData)
    try{
        let newComment = {
            userPic : commentData.userPic,
            userName : commentData.userName,
            commentText : commentData.commentText,
            commentedTime : new Date()
        }
        // console.log("newComment",newComment)
        let updateResult = await postModel.updateOne({_id:new mongoose.Types.ObjectId(commentData.postId)},{$push:{comments:newComment}});
        if(updateResult.modifiedCount != 0){
            // console.log("updated")
            result.success = true;
            result.message = "Added comment to comments list";
            result.data = "";
        }
        else{
            result.message = "Adding comment to comments list failed";
        }
    }
    catch(e){
        result.message = "failed to Add comment to comments list";
    }
    return result;
}


async function fetchMyFeedPosts(email){
    let result = {
        success: false,
        message: "",
        data: ""
    }
    try{

        let now = new Date();
        let yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        let myEmail = email; 

        // Find my friends from friends collection
        let myFriends = await friendsModel.find({
        $and: [
            { $or: [{ senderEmail: myEmail }, { receiverEmail: myEmail }] },
            { status: "accept" },
        ],
        }).distinct("senderEmail receiverEmail");

        // Find my groups from groups collection
        let myGroups = await groupModel.find({
        $or: [{ groupOwnerEmail: myEmail }, { senderEmail: myEmail }],
        status: "accepted",
        }).distinct("groupName");

        // Find posts from my friends and all posts posted in groupName where groupName is in my groups which are posted in last 24 hours
        let posts = await postModel.find({
            $and: [
                {
                $or: [
                    { userEmail: { $in: myFriends } },
                    { groupName: { $in: myGroups } },
                ],
                },
                { postedTime: { $gte: yesterday } },
                { userEmail: { $ne: myEmail } },
            ],
        });

        let myFriendsPosts = await postModel.find({
            $and: [
              { userEmail: { $in: myFriends } },
              { postedTime: { $gte: yesterday } },
              { userEmail: { $ne: myEmail } },
            ],
          });
          
          let myGroupsPosts = await groupPostModel.find({
            $and: [
              { groupName: { $in: myGroups } },
              { postedTime: { $gte: yesterday } },
              { senderEmail: { $ne: myEmail } },
            ],
          });


          let finalPosts = {
            groupPosts : myGroupsPosts ? myGroupsPosts : [],
            friendsPosts : myFriendsPosts ? myFriendsPosts : []
          }


        if(myFriendsPosts.length != 0 || myGroupsPosts.length != 0){
            result.success = true;
            result.message = "Fetched posts";
            result.data = finalPosts;
        }
        else{
            result.message = "No posts found";
        }
    }
    catch(e){
        result.message = "Failed to fetch posts";
    }
    return result;
}

module.exports = {fetchMyPosts, addUserToDislikedArray, addUserToLikedArray, removeUserFromDislikedArray, removeUserFromLikedArray, fetchPostData, addNewComment, fetchMyFeedPosts};