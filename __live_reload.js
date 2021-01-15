const socket = io();

socket.on('live-refresh', (event) => {
    console.log(" ~ Live Refresh . . .");
    document.location.reload();
});
