const socket = io('http://localhost:3000'); // Connect to the server

window.socket = socket;

// Listen for connection
socket.on('connect', async () => {
    const token = JSON.parse(localStorage.getItem("auth")).userId
    let userData = {};

    try {
        const response = await fetch(`/api/user/${token}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        userData = await response.json()
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }

    console.log(`user ${userData.name} connected on socket ${socket.id}`);

    socket.emit("register", token)
});

export default socket;