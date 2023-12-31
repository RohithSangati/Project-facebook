window.onload=async ()=>{
    let result = await validateUser();
    
    let email=window.location.hash.substring(1);

    let totalFriendsAndFollowers = await $.post(backendHost+"/friends/totalfriendandfollowers",{email:email})
    $("#followers").text(totalFriendsAndFollowers.data.followers)
    // alert(totalFriendsAndFollowers.data.followers)

    let data = await $.post(backendHost+"/users/getsingleuser",{email:email})
    var userData = data.data

    $("#name").text(userData.firstName+" "+userData.lastName)
    $("#firstName").text(userData.firstName+" "+userData.lastName)
    $("#email").text(userData.email)
    $("#mobileNo").text(userData.mobileNo)
    $("#city").text(userData.city)
    $("#dob").text(userData.dob)
    $("#aboutMe").text(userData.aboutMe)
    $("#facebookLink").attr('href',userData.facebookLink)
    $("#twitterLink").attr('href',userData.twitterLink)
    $("#googleLink").attr('href',userData.googleLink)

    if(userData.profilePic!=null)
    $("#profile-photo").attr('src',userData.profilePic)
    if(userData.coverPic!=null)
    $("#cover-photo").attr('src',userData.coverPic)
}