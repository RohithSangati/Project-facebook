window.onload = async () => {
    var obj = {
        email: "rohith@gmail.com",
        status: "accepted"
    }
    let myGrps = await $.post("http://localhost:7777/groups/getMyGroups", obj);
    madeMyGrps(myGrps.data);
    obj = {
        email: "raghu@gmail.com"
    }
    let grpsOfMe = await $.post("http://localhost:7777/groups/getGroupsCreatedByMe", obj);
    madeGrpsOfMe(grpsOfMe.data);
    obj = {
        email: "rohith@gmail.com"
    }
    let globalGrps = await $.post("http://localhost:7777/groups/getNotMyGroups", obj);
    madeGlobalGrps(globalGrps.data);

}


function madeGlobalGrps(arr) {
    $("#globalgrpslist").html("")
    for (x in arr) {
        data = arr[x]._id;
        $("#globalgrpslist").append(
            `<li class="globalgrps" style="cursor:pointer">
                <div class="nearly-pepls">
                    <figure>
                        <a href="time-line.html" title=""><img
                                src="images/resources/${data.groupPic}"
                                alt=""></a>
                    </figure>
                    <div class="pepl-info">
                        <h4><a href="time-line.html" title="">${data.groupName}</a>
                        </h4>
                        <span>ftv model</span>
                        <a href="#" title="" class="add-butn"
                            data-ripple="" onclick = "makegrprequest('${data.groupPic}','${data.groupName}','${data.groupOwnerEmail}','${data.groupOwnerPic}','${data.groupOwnerName}')">Ask To Join</a>
                    </div>
            </div>
        </li>`
        )
    }
}

async function makegrprequest(groupPic1,groupName1,groupOwnerEmail1,groupOwnerPic1,groupOwnerName1){
    let obj = {
        groupName : groupName1,
        groupPic : groupPic1,
        groupOwnerName : groupOwnerName1,
        groupOwnerEmail : groupOwnerEmail1,
        groupOwnerPic : groupOwnerPic1,
        senderName : "Rohith",
        senderEmail : "rohith@gmail.com",
        senderPic : "rohithPic",
        status : "pending"
    }
    let data = await $.post("http://localhost:7777/groups/joinRequest",obj);
    alert(data.message);
}


function madeMyGrps(arr) {
    for (x in arr) {
        let data = arr[x];
        $("#mygrplist").append(
            `<li style="cursor: pointer;">
                <div class="nearly-pepls">
                    <figure>
                        <a href="time-line.html" title=""><img
                                src="images/resources/${data.groupPic}"
                                alt=""></a>
                    </figure>
                    <div class="pepl-info">
                        <h4><a href="time-line.html" title="">${data.groupName}</a>
                        </h4>
                        <span>ftv model</span>
                        <a href="#" title="" class="add-butn"
                            data-ripple="" onclick="exitgrp('${data.groupName}')">Exit Group</a>
                    </div>
                </div>
            </li>`
        )
    }
}

function exitgrp(grpname) {
    let obj = {
        email: "rohith@gmail.com",
        groupName: grpname
    }
    let data = $.post("http://localhost:7777/groups/leaveGroup", obj);
    alert(data);
    alert(data.message);
}

function madeGrpsOfMe(arr) {
    for (x in arr) {
        let data = arr[x];
        $("#mygrprequestlist").append(
            `<li style="cursor: pointer;">
                <div class="nearly-pepls">
                    <figure>
                        <a href="time-line.html" title=""><img
                                src="images/resources/${data.groupPic}"
                                alt=""></a>
                    </figure>
                    <div class="pepl-info">
                        <h4><a href="time-line.html" title="">${data.groupName}</a>
                        </h4>
                        <span>ftv model</span>
                        <a href="#" title="" class="add-butn"
                            data-ripple="" data-toggle="modal" data-target="#myModal" onclick="showrequest('${data.groupName}')">View Requests</a>
                    </div>
                </div>
            </li>`
        )
    }
}

async function showrequest(grpname) {
    let obj = {
        status: "pending",
        email: "raghu@gmail.com",
        groupName: grpname
    }
    let specificGrpRequests = await $.post("http://localhost:7777/groups/groupRequests", obj);
    console.log(specificGrpRequests.message)
    appendrequests(specificGrpRequests.data, grpname);
    $("myModal").modal('show');
}


function appendrequests(arr, grpname) {
    $("#specificgrprequests").html("")
    for (x in arr) {
        data = arr[x];
        $("#specificgrprequests").append(
            `<li>
            <div class="nearly-pepls">
                <figure>
                    <a href="time-line.html" title=""><img src="images/resources/${data.senderPic}" alt=""></a>
                </figure>
                <div class="pepl-info">
                    <h4><a href="time-line.html" title="">${data.senderName}</a></h4>
                    <a href="#" title="" class="add-butn more-action" data-ripple="" onclick="rejectgrp('${data.senderEmail}','${grpname}')">Reject</a>
                    <a href="#" title="" class="add-butn" data-ripple="" onclick="acceptgrp('${data.senderEmail}','${grpname}')">Accept</a>
                </div>
            </div>
        </li>`
        );
    }
}


async function acceptgrp(senderEmail, grpname) {
    let obj = {
        email: "raghu@gmail.com",
        senderEmail: senderEmail,
        groupName: grpname,
        status: "accept"
    }
    let data = await $.post("http://localhost:7777/groups/acceptOrRejectRequest", obj);
    alert(data.message)
}

async function rejectgrp(senderEmail, grpname) {
    let obj = {
        email: "raghu@gmail.com",
        senderEmail: senderEmail,
        groupName: grpname,
        status: "reject"
    }
    let data = await $.post("http://localhost:7777/groups/acceptOrRejectRequest", obj);
    alert(data.message)
}




$("#grpsearch").keyup(() => {
    let input = $("#grpsearch").val().toLowerCase();
    let groups = $(".globalgrps");
    for (let i = 0; i < groups.length; i++) {
        let grpName = groups[i].childNodes[1].childNodes[3].childNodes[1].childNodes[0].innerHTML;
        if (!grpName.toLowerCase().includes(input)) {
            groups[i].style.display = "none";
        }
        else {
            groups[i].style.display = "block"
        }
    }
})


$("#createGrp").click(async () => {
    // let obj = {
    //     groupName : $("#grpnameinput").val(),
    //     groupPic : $("#grpprofilepicinput").val()
    // }
    let obj = {
        groupName: "Mumbai Indians",
        groupPic: "mumbai.jpg",
        groupOwnerName: "Pranay",
        groupOwnerEmail: "pranay@gmail.com",
        groupOwnerPic: "pranayPic",
        senderName: "Pranay",
        senderEmail: "pranay@gmail.com",
        senderPic: "pranayPic",
        status: "accepted"
    }
    let data = await $.post("http://localhost:7777/groups/createGroup", obj);
    alert(data.message);
})