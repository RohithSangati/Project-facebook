window.onload=async function(){
    var obj={
        email:"pranay@gmail.com"
    }

    let friends_data = await $.post("http://localhost:7777/friends/getfriends",obj)
    addfriends(friends_data.data)
    
    let requests_data = await $.post("http://localhost:7777/friends/getpendingfriendrequests",obj)
    addfriendrequests(requests_data.data)

    let followers_data = await $.post("http://localhost:7777/friends/getmyfollowers",obj)
    addmyfollowers(followers_data.data)

    let following_data = await $.post("http://localhost:7777/friends/getmyfollowing",obj)
    addmyfollowing(following_data.data)

    let my_requests = await $.post("http://localhost:7777/friends/getmyfriendrequests",obj)
    addmyrequests(my_requests.data)

}
function addfriends(data)
{
    for(x in data)
    {
        if(data[x].receiverEmail=="pranay@gmail.com")
        {
            $("#friendslist").append(
                `<li>
                <div class="nearly-pepls">
                    <figure>
                        <a href="time-line.html" title=""><img src="images/resources/friend-avatar9.jpg" alt=""></a>
                    </figure>
                    <div class="pepl-info">
                        <h4><a href="time-line.html" title="">${data[x].senderName}</a></h4>
                        <span>Cricketer</span>
                        <a href="#" title="" class="add-butn more-action" data-ripple="" onclick="deletefriend('${data[x].senderEmail}','${data[x].receiverEmail}')">unfriend</a>
                    </div>
                </div>
            </li>`
            )
        }
        else
        {
            $("#friendslist").append(
                `<li>
                <div class="nearly-pepls">
                    <figure>
                        <a href="time-line.html" title=""><img src="images/resources/friend-avatar9.jpg" alt=""></a>
                    </figure>
                    <div class="pepl-info">
                        <h4><a href="time-line.html" title="">${data[x].receiverName}</a></h4>
                        <span>Cricketer</span>
                        <a href="#" title="" class="add-butn more-action" data-ripple="" onclick="deletefriend('${data[x].senderEmail}','${data[x].receiverEmail}')">unfriend</a>
                    </div>
                </div>
            </li>`
            )
        }
    }
}

function addfriendrequests(data)
{
    for(x in data)
    {
        $("#friendrequestlist").append(
            `<li>
            <div class="nearly-pepls">
                <figure>
                    <a href="time-line.html" title=""><img src="images/resources/friend-avatar9.jpg" alt=""></a>
                </figure>
                <div class="pepl-info">
                    <h4><a href="time-line.html" title="">${data[x].senderName}</a></h4>
                    <span>Cricketer</span>
                    <a href="#" title="" class="add-butn more-action" data-ripple="" onclick="deleterequest('${data[x].senderEmail}','${data[x].receiverEmail}')">delete Request</a>
                    <a href="#" title="" class="add-butn" data-ripple="" onclick="confirmrequest('${data[x].senderEmail}','${data[x].receiverEmail}')">Confirm</a>
                </div>
            </div>
        </li>`
        )
    }
    
}

function addmyfollowing(data)
{
    for(x in data)
    {
        $("#friendfollowinglist").append(
            `<li style="cursor:pointer">
            <div class="nearly-pepls">
                <figure>
                    <a href="time-line.html" title=""><img
                            src="images/resources/nearly4.jpg"
                            alt=""></a>
                </figure>
                <div class="pepl-info">
                    <h4><a href="time-line.html" title="">${data[x].receiverName}</a>
                    </h4>
                    <span>Cricketer</span>
                    <a href="#" title="" class="add-butn"
                        data-ripple="" onclick="deletefriend('${data[x].senderEmail}','${data[x].receiverEmail}')">Unfollow</a>
                </div>
            </div>
        </li>`
        )
    }
}

function addmyfollowers(data)
{
    for(x in data)
    {
        $(".followers").append(
            `<li>
            <figure><img src="images/resources/friend-avatar3.jpg" alt=""></figure>
            <div class="friend-meta">
                <h4><a href="time-line.html" title="">${data[x].senderName}</a></h4>
                <a href="#" title="" class="underline">Add Friend</a>
            </div>
        </li>`
        )
    }
}

function addmyrequests(data)
{
    for(x in data)
    {
        $("#myrequestlist").append(
                `<li style="cursor:pointer">
                <div class="nearly-pepls">
                    <figure>
                        <a href="time-line.html" title=""><img
                                src="images/resources/nearly4.jpg"
                                alt=""></a>
                    </figure>
                    <div class="pepl-info">
                        <h4><a href="time-line.html" title="">${data[x].receiverName}</a>
                        </h4>
                        <span>Cricketer</span>
                        <a href="#" title="" class="add-butn"
                            data-ripple="" onclick="revokerequest('${data[x].senderEmail}','${data[x].receiverEmail}')">Revoke Request</a>
                    </div>
                </div>
            </li>`
            )
        }
}

$("#friendssearch").keyup(() => {
    let input = $("#friendssearch").val().toLowerCase();
    let groups = $(".globalfriends");
    for(let i=0;i<groups.length;i++){
        let grpName = groups[i].childNodes[1].childNodes[3].childNodes[1].childNodes[0].innerHTML;
        if(!grpName.toLowerCase().includes(input)){
            groups[i].style.display="none";
        }
        else{
            groups[i].style.display="block";
        }
    }
})

async function deletefriend(senderEmail,receiverEmail)
{
    let data=await $.post("http://localhost:7777/friends/unfollowfriend",{senderEmail:senderEmail,receiverEmail:receiverEmail})
    alert("successfully deleted your friend")
}

async function deleterequest(senderEmail,receiverEmail)
{
    let data = await $.post("http://localhost:7777/friends/rejectpendingfriendrequest",{senderEmail:senderEmail,receiverEmail:receiverEmail})
    alert("succesfully deleted the request")
}

async function confirmrequest(senderEmail,receiverEmail)
{
    let data=await $.post("http://localhost:7777/friends/acceptpendingfriendrequest",{senderEmail:senderEmail,receiverEmail:receiverEmail})
    alert("succesfully accepted the request")
}

async function revokerequest(senderEmail,receiverEmail)
{
    let data=await $.post("http://localhost:7777/friends/revokefriendrequest",{senderEmail:senderEmail,receiverEmail:receiverEmail})
    alert("succesfully revoked the request")
}