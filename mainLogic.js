// ====== API BASE URL ======

const baseUrl = "https://tarmeezacademy.com/api/v1"

// ===== Status login & logout =====
function setupUI() {
    const token = localStorage.getItem("token")
    // const username = JSON.parse(localStorage.getItem("user"))

    // 
    const addBtn = document.getElementById("plus-icon")
    // 
    const loginDiv = document.getElementById("logged-in-div")
    const logoutDiv = document.getElementById("logout-div")



    if (token != null) {
        if (addBtn != null) {
            addBtn.style.setProperty("display", "block", "important")
        }
        loginDiv.style.setProperty("display", "none", "important")
        logoutDiv.style.setProperty("display", "block", "important")
        getCurrentUser()
    } else {
        if (addBtn != null) {
            addBtn.style.setProperty("display", "none", "important")
        }
        loginDiv.style.setProperty("display", "block", "important")
        logoutDiv.style.setProperty("display", "none", "important")
    }
}


// =========== AUTH FUNCTIONS ===========

// Login 
function loginBtnClick() {

    const username = document.getElementById("username_input").value
    const password = document.getElementById("password_input").value

    const params = {
        "username": username,
        "password": password
    }
    const url = `${baseUrl}/login`
    toggleLoader(true)
    axios.post(url, params)
        .then((response) => {
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            const modal = document.getElementById("modal_login")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert('Logged In Successfuly!')
            setupUI()
        }).catch((error) => {
            showAlert(error.response.data.message, "danger")
        }).finally(() => {
            toggleLoader(false)
        })



}

// Register
function registerBtnClick() {
    const name = document.getElementById("name_reg").value
    const username = document.getElementById("username_reg").value
    const email = document.getElementById("email_reg").value
    const password = document.getElementById("password_reg").value
    const image = document.getElementById("image_reg").files[0]

    let formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("image", image)

    const url = `${baseUrl}/register`
    toggleLoader(true)
    axios.post(url, formData)
        .then((response) => {
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            const modal = document.getElementById("modal_register")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("Register Successfuly")
            setupUI()
        }).catch((error) => {
            showAlert(error.response.data.message, "danger")
        }).finally(() => {
            toggleLoader(false)
        })
}

// Log out
function logout() {

    if (confirm("Are You Sure Of Logout") == true) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        showAlert('Logged Out Successfuly!', "danger")
    }
    setupUI()
}


// ========== ALERT ==========

//  Alert of bootstrap
function showAlert(alertMessage, type = "success") {

    const alertPlaceholder = document.getElementById('AlertShows')

    const alert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }
    alert(alertMessage, type)


}


// ======= GET CURRENT USER =======

// Get Current user
function getCurrentUser() {
    let user = null
    const stroageUser = localStorage.getItem("user")

    if (stroageUser != null) {
        user = JSON.parse(stroageUser)
        document.getElementById("user").innerHTML = user.username
        document.getElementById("profile_image").src = user.profile_image
    }

    return user
}



// ==== creat New Post ====
function creatNewPostClick() {
    // disabiled btn
    // let addBtn = document.getElementById("post-add-btn")
    // addBtn.disabled = true




    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const image = document.getElementById("post-image-input").files[0]
    const token = localStorage.getItem("token")


    let formData = new FormData()
    formData.append("title", title)
    formData.append("body", body)
    formData.append("image", image)

    let url = ``
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }

    let postId = document.getElementById("post-id-input").value;
    let isCreat = postId == null || postId == ""

    if (isCreat) {
        // Creat a new post
        url = `${baseUrl}/posts`
        let alertMessage = "Post Has Been created"
    } else {
        // Edit post
        formData.append("_method", "put")
        url = `${baseUrl}/posts/${postId} `
        alertMessage = "Post Has Been Update"
    }

    toggleLoader(true)
    axios.post(url, formData, {
        headers: headers
    })
        .then((response) => {


            const modal = document.getElementById("creat-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert(alertMessage)
            getPosts()
            addBtn.disabled = false
        }).catch((error) => {
            showAlert(error.response.data.message, "danger")
            console.log(error)
        }).finally(() => {
            toggleLoader(false)
        })


}

function addBtnClicked() {

    document.getElementById("post-add-btn").innerHTML = "Creat"
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modal-title").innerHTML = "Creat A New Post "
    document.getElementById("post-title-input").value = ""
    document.getElementById("post-body-input").value = ""
    // document.getElementById("post-image-input").files[0] = post.image

    let postModal = new bootstrap.Modal(document.getElementById("creat-post-modal"), {})
    postModal.toggle()
}

function postClicked(postId) {
    window.location = `postDetails.html?postId=${postId}`
}

// ===== Upadate Post =====
function editPost(postObj) {
    let post = JSON.parse(decodeURIComponent(postObj))

    document.getElementById("post-add-btn").innerHTML = "Update"
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body
    document.getElementById("post-image-input").files[0] = post.image

    let postModal = new bootstrap.Modal(document.getElementById("creat-post-modal"), {})
    postModal.toggle()
}

// ===== Delete post =====
function deletePost(postObj) {
    let post = JSON.parse(decodeURIComponent(postObj))

    document.getElementById("delete-post-id-input").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModal.toggle()
}

function confirmPostDelete() {
    const postId = document.getElementById("delete-post-id-input").value

    const token = localStorage.getItem("token")
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }

    const url = `${baseUrl}/posts/${postId}`
    toggleLoader(true)
    axios.delete(url, {
        headers: headers
    })
        .then((response) => {
            const modal = document.getElementById("delete-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert('The Post Has Been Deleted Successfuly!')
            getPosts()
        }).catch((error) => {
            showAlert(error.response.data.message, "danger")
        }).finally(() => {
            toggleLoader(false)
        })
}


function profileClicked() {
    const user = getCurrentUser()
    const userId = user.id
    window.location = `profile.html?userId=${userId}`
}


function toggleLoader(show = true) {
    if (show) {
        document.getElementById("loader").style.visibility = 'visible'
    } else {
        document.getElementById("loader").style.visibility = 'hidden'
    }
}