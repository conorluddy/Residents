let accessToken = null;

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    try {
        const response = await fetch('/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = 'Login successful!';
            messageElement.style.color = 'green';
            // Store the access token in memory
            accessToken = data.accessToken;
            console.log('Access token stored in memory');

            updateLoggedInContent();

        } else {
            messageElement.textContent = data.message || 'Login failed. Please try again.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        
    }
});

// Function to get the access token (to be used when making authenticated requests)
async function getAccessToken() {
    if (!accessToken) {
        // If we don't have an access token, try to get a new one using the refresh token
        try {
            const response = await fetch('/auth/refresh', {
                method: 'POST',
                credentials: 'include', // This is important to include cookies
            });

            if (response.ok) {
                const data = await response.json();
                accessToken = data.accessToken;
            } else {
                // If refresh failed, user needs to login again
                console.log('Token refresh failed. Please log in again.');
                return null;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    }
    return accessToken;
}

// Example of how to use the access token for authenticated requests
async function makeAuthenticatedRequest(url, method = 'GET', body = null) {
    const token = await getAccessToken();
    if (!token) {
        console.log('No valid token available. Please log in.');
        return;
    }

    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Always include cookies
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        // Handle response...
    } catch (error) {
        console.error('Error making authenticated request:', error);
    }
}

// Function to check if user is logged in and show/hide content accordingly
function updateLoggedInContent() {
    const loggedInContent = document.getElementById('loggedInContent');
    if (accessToken) {
        loggedInContent.style.display = 'block';
    } else {
        loggedInContent.style.display = 'none';
    }
}



// Add a logout button to the logged-in content
const logoutButton = document.createElement('button');
logoutButton.textContent = 'Logout';
logoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/auth/logout', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            accessToken = null;
            updateLoggedInContent();
            document.getElementById('message').textContent = 'Logged out successfully.';
            document.getElementById('message').style.color = 'green';
        } else {
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
        document.getElementById('message').textContent = 'Logout failed. Please try again.';
        document.getElementById('message').style.color = 'red';
    }
});
document.getElementById('loggedInContent').appendChild(logoutButton);

// Call updateLoggedInContent on page load to handle cases where the user is already logged in
updateLoggedInContent();