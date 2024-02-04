/* For index.html */


document.addEventListener('DOMContentLoaded', function () {
  const commentForm = document.getElementById('commentForm');
  commentForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const commentTextarea = document.getElementById('comment_body');
    const messageBody = commentTextarea.value; 

    if (messageBody) {
      postMessage(messageBody)
        .then(response => {
          console.log('Message posted successfully:', response);
        })
        .catch(error => {
          console.error('Error posting message:', error);
        });
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const profileDetails = document.querySelector('.profileDetails');
  const userId = WATCH_PARTY_USER_ID;

  profileDetails.addEventListener('click', function (event) {
    const targetButton = event.target.closest('button'); 
    if (targetButton) {
      const updateType = targetButton.classList[0]; 
      const inputValue = profileDetails.querySelector(`.${updateType}`).value;
      console.log(inputValue)
      if (updateType === 'username') {
        updateUsername(inputValue);
      } else if (updateType === 'password') {
        updatePassword(inputValue);
      }
    }
  });

  
  function updateUsername(newUsername) {
    fetch('http://127.0.0.1:5000/api/user/name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ new_username: newUsername, uid: userId}),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Username updated successfully:', data);
      })
      .catch(error => {
        console.error('Error updating username:', error);
      });
  }


  function updatePassword(newPassword) {
    fetch('http://127.0.0.1:5000/api/user/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ new_password: newPassword, uid: userId}),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Password updated successfully:', data);
      })
      .catch(error => {
        console.error('Error updating password:', error);
      });
  }
});

function postMessage(messageBody) {
  const userId = WATCH_PARTY_USER_ID;
  const roomId = WATCH_PARTY_ROOM_ID
  const apiKey = WATCH_PARTY_API_KEY;
  const url = `http://127.0.0.1:5000/api/rooms/${roomId}/messages`;

  const data = {
    body: messageBody,
    uid: userId
  };

  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
      throw error; 
    });
}



function getMessages(roomId) {
  const apiKey = WATCH_PARTY_API_KEY;

  return fetch(`http://127.0.0.1:5000/api/rooms/${roomId}/messages`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function startMessagePolling() {
  const roomID = WATCH_PARTY_ROOM_ID
  clearChatHistory(); 
  function fetchAndDisplayMessages() {
    getMessages(roomID).then(messages => {
      clearChatHistory(); 
      messages.forEach(message => {
        displayMessage(message);
      });
    }).finally(() => {
      setTimeout(fetchAndDisplayMessages, 100);
    });
  }
  fetchAndDisplayMessages();
}

function clearChatHistory() {
  const messagesContainer = document.querySelector('.messages');
  while (messagesContainer.firstChild) {
    messagesContainer.removeChild(messagesContainer.firstChild);
  }
}


function displayMessage(message) {
  const messagesContainer = document.querySelector('.messages');
  const messageElement = document.createElement('message');
  messageElement.innerHTML = `
    <author>${message.user_name}</author>
    <content>${message.body}</content>
  `;

  messagesContainer.appendChild(messageElement);
}


document.addEventListener("DOMContentLoaded", function () {
  const display = document.querySelector('.display');
  const edit = document.querySelector('.edit');
  const roomNameSpan = document.querySelector('.roomName');
  const roomNameInput = document.getElementById('roomNameInput');
  const editLink = document.getElementById('editLink');
  const saveLink = document.getElementById('saveLink');
  const roomId = WATCH_PARTY_ROOM_ID
  editLink.addEventListener('click', function (event) {
    event.preventDefault();
    display.classList.add('hide');
    edit.classList.remove('hide');
  });

  saveLink.addEventListener('click', function (event) {
    event.preventDefault();
    const newRoomName = roomNameInput.value;

    fetch('http://127.0.0.1:5000/api/rooms/name', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({name: newRoomName, rid: roomId}),
    })
    .then(response => response.json())
    .then(data => {
      roomNameSpan.textContent = newRoomName;
      display.classList.remove('hide');
      edit.classList.add('hide');
    })
    .catch(error => {
      console.error('Error updating room name:', error);
    });
  });
});



// TODO: If a user clicks to create a chat, create an auth key for them
// and save it. Redirect the user to /chat/<chat_id>
function createChat() {

}