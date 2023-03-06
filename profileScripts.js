
setupUI()
getUser()
getPosts()

function getCurrentUserId() {
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get("userId")
    return userId
}

function getUser() {
    const id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}`)
        .then((response) => {
            console.log(response)
            const userInfo = response.data.data

            // get user info
            document.getElementById("user-image").src = userInfo.profile_image
            document.getElementById("user-email").innerHTML = userInfo.email
            document.getElementById("username").innerHTML = userInfo.username
            document.getElementById("name-user").innerHTML = userInfo.name
            document.getElementById("name-posts").innerHTML = userInfo.username
            // posts & comments count
            document.getElementById("commnets-count").innerHTML = userInfo.comments_count
            document.getElementById("posts-count").innerHTML = userInfo.posts_count
        })
}

function getPosts() {
    const id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}/posts?limit=2`)
        .then((response) => {
            const posts = response.data.data
            document.getElementById("user-posts").innerHTML = ""

            for (post of posts) {

                let username = post.author.username
                let profileLogo = post.author.profile_image
                let postImage = post.image
                let created_at = post.created_at
                let title = post.title
                let body = post.body
                let comments_count = post.comments_count

                // SHow or Hide (edit&delete) button
                let user = getCurrentUser()
                let isMyPost = user != null && post.author.id == user.id
                let editBtnContent = ``

                if (isMyPost) {
                    editBtnContent =
                        `
                    <div>
                        <button class="btn btn-danger mx-2" style='float:right;' onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                        <button class="btn btn-secondary" style='float:right;' onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                    </div>
                    `
                }
                if (title == null) {
                    title = ""
                }

                let content = `
                <div class="card rounded-4 shadow-sm mt-4">
                <div class="card-header" style="display: flex;align-items: center; justify-content:space-between">
                    <div>
                        <img src="${profileLogo}" alt="" srcset="" style="width: 40px; height: 40px;border-radius: 50%;">
                        <b class="mx-2 mt-1">${username}</b>
                    </div>

                    ${editBtnContent}
                </div>

                <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer">
                    <img src="${postImage}" alt="" srcset="" style="width: 100%;">
                    <h6 style="opacity: 50%;">${created_at}</h6>


                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${body}</p>

                    <hr>

                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
                            viewBox="0 0 16 16">
                            <path
                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                        </svg>
                        <span>(${comments_count}) Comments</span>
                    </div>
                </div>
            </div>
        `
                document.getElementById("user-posts").innerHTML += content

            }
        })
        .catch((error) => {
            showAlert(error.response.data.message, "danger")
        })
}