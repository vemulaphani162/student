let body = document.body;
let profile = document.querySelector('.header .flex .profile');
let searchForm = document.querySelector('.header .flex .search-form');
let sideBar = document.querySelector('.side-bar');

// Get elements for dynamic header profile
const headerProfileImage = profile.querySelector('.image');
const headerProfileName = profile.querySelector('.name');
const headerProfileRole = profile.querySelector('.role');
const headerLoginBtn = profile.querySelector('.flex-btn .option-btn[href="login.html"]');
const headerRegisterBtn = profile.querySelector('.flex-btn .option-btn[href="register.html"]');
const headerLogoutBtn = profile.querySelector('.flex-btn .option-btn[href="logout"]');


// Function to update the header profile section
const updateHeaderProfile = async () => {
    try {
        const response = await fetch('/api/user-profile'); // Fetch user data from backend
        const data = await response.json();

        if (response.ok) {
            // User is logged in, update profile details
            headerProfileName.textContent = data.name || 'User';
            headerProfileRole.textContent = data.role || 'student';
            if (data.profileImagePath) {
                headerProfileImage.src = data.profileImagePath;
            } else {
                headerProfileImage.src = 'images/pic-1.jpg'; // Default image
            }
            // Show logout, hide login/register
            headerLoginBtn.style.display = 'none';
            headerRegisterBtn.style.display = 'none';
            headerLogoutBtn.style.display = 'inline-block';
        } else if (response.status === 401) {
            // User not authenticated, show login/register, hide logout
            headerProfileName.textContent = 'Guest';
            headerProfileRole.textContent = 'Not logged in';
            headerProfileImage.src = 'images/pic-1.jpg'; // Default guest image
            headerLoginBtn.style.display = 'inline-block';
            headerRegisterBtn.style.display = 'inline-block';
            headerLogoutBtn.style.display = 'none';
        } else {
            // Handle other errors (e.g., server error)
            console.error('Failed to fetch user profile for header:', data.message);
            headerProfileName.textContent = 'Error';
            headerProfileRole.textContent = '';
            headerProfileImage.src = 'images/pic-1.jpg'; // Default image on error
            headerLoginBtn.style.display = 'inline-block';
            headerRegisterBtn.style.display = 'inline-block';
            headerLogoutBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Network error fetching user profile for header:', error);
        headerProfileName.textContent = 'Guest';
        headerProfileRole.textContent = 'Not logged in';
        headerProfileImage.src = 'images/pic-1.jpg'; // Default image on network error
        headerLoginBtn.style.display = 'inline-block';
        headerRegisterBtn.style.display = 'inline-block';
        headerLogoutBtn.style.display = 'none';
    }
};

document.querySelector('#user-btn').onclick = () =>{
   profile.classList.toggle('active');
   searchForm.classList.remove('active');
}

document.querySelector('#search-btn').onclick = () =>{
   searchForm.classList.toggle('active');
   profile.classList.remove('active');
}

document.querySelector('#menu-btn').onclick = () =>{
   sideBar.classList.toggle('active');
   body.classList.toggle('active');
}

document.querySelector('#close-btn').onclick = () =>{
   sideBar.classList.remove('active');
   body.classList.remove('active');
}

document.querySelector('#toggle-btn').onclick = () =>{
   body.classList.toggle('dark');
}

// Call the function to update header profile on page load
document.addEventListener('DOMContentLoaded', updateHeaderProfile);
