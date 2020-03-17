const socket = io();

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName = '';

const login = event => {
  event.preventDefault();
  if (userNameInput.value.length) {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('newMember', {
      user: userName,
    });
  } else {
    alert('Your nick have to have length :)');
  }
};

loginForm.addEventListener('submit', login);

const addMessage = (author, messageContent) => {
  const message = `
    <li class="message ${
      userName == author
        ? 'message--self'
        : `${author === 'Chat Bot' && 'message--bot'}`
    } message--received">
            <h3 class="message__author">${author}</h3>
            <div class="message__content">
              ${messageContent}
            </div>
          </li>
    `;
  messagesList.insertAdjacentHTML('beforeend', message);
};

const sendMessage = event => {
  event.preventDefault();
  if (messageContentInput.value.length) {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', {
      author: userName,
      content: messageContentInput.value,
    });
    messageContentInput.value = '';
  } else {
    alert('Type something before pressing send button');
  }
};

addMessageForm.addEventListener('submit', sendMessage);

socket.on('message', ({ author, content }) => addMessage(author, content));
