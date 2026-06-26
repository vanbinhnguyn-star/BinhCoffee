<template>
  <div class="container my-4">
    <h5 class="mb-3">💬 Tin nhắn từ khách hàng</h5>

    <div class="row g-3">
      <!-- Danh sách user -->
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-header bg-brown text-white">Khách đang chat</div>
          <div class="list-group list-group-flush">
            <div
              v-for="user in chatStore.chatUsers"
              :key="user.socketId"
              class="list-group-item list-group-item-action"
              :class="{ active: selectedUser?.socketId === user.socketId }"
              @click="selectUser(user)"
            >
              <div class="d-flex justify-content-between">
                <span>👤 {{ user.userName }}</span>
                <span v-if="user.unread > 0" class="badge bg-danger">{{ user.unread }}</span>
              </div>
              <small class="text-muted text-truncate d-block">{{ user.lastMsg }}</small>
            </div>
            <div v-if="chatStore.chatUsers.length === 0" class="list-group-item text-center text-muted py-4">
              Chưa có khách nào nhắn tin
            </div>
          </div>
        </div>
      </div>

      <!-- Khung chat -->
      <div class="col-md-8">
        <div class="card h-100">
          <div v-if="!selectedUser" class="card-body d-flex align-items-center justify-content-center text-muted">
            Chọn một khách hàng để bắt đầu chat
          </div>
          <template v-else>
            <div class="card-header bg-brown text-white">
              💬 {{ selectedUser.userName }}
            </div>
            <div class="card-body chat-messages" ref="messagesEl">
              <div
                v-for="(msg, i) in currentMessages"
                :key="i"
                class="chat-msg"
                :class="msg.sender === 'admin' ? 'msg-admin' : 'msg-user'"
              >
                <div class="msg-bubble">{{ msg.text }}</div>
                <div class="msg-time">{{ msg.time }}</div>
              </div>
            </div>
            <div class="card-footer p-2">
              <div class="input-group">
                <input
                  v-model="replyText"
                  @keyup.enter="sendReply"
                  type="text"
                  class="form-control"
                  placeholder="Nhập phản hồi..."
                />
                <button class="btn btn-brown" @click="sendReply" :disabled="!replyText.trim()">
                  Gửi
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useAdminChatStore } from '../store/adminChatStore';

const auth = useAuthStore();
const chatStore = useAdminChatStore();

const selectedUser = ref(null);
const replyText = ref('');
const messagesEl = ref(null);
let socket = null;

const getTime = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

const currentMessages = computed(() =>
  selectedUser.value ? (chatStore.allMessages[selectedUser.value.socketId] || []) : []
);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
};

const selectUser = (user) => {
  selectedUser.value = user;
  chatStore.clearUnread(user.socketId);
  scrollToBottom();
};

const sendReply = () => {
  const text = replyText.value.trim();
  if (!text || !selectedUser.value) return;

  const msg = { text, sender: 'admin', time: getTime() };
  chatStore.addMessage(selectedUser.value.socketId, msg);

  socket.emit('admin_reply', {
    targetSocketId: selectedUser.value.socketId,
    text,
    time: getTime()
  });

  replyText.value = '';
  scrollToBottom();
};

onMounted(() => {
  socket = io('http://localhost:5000');

  socket.on('connect', () => {
    socket.emit('admin_join', { token: auth.token });
  });

  socket.on('user_connected', (user) => {
    chatStore.addUser(user);
  });

  socket.on('user_message', (data) => {
    const { socketId, text, time, userName } = data;
    chatStore.addUser({ socketId, userName });
    chatStore.addMessage(socketId, { text, sender: 'user', time });
    chatStore.updateLastMsg(socketId, text);

    if (selectedUser.value?.socketId !== socketId) {
      chatStore.incrementUnread(socketId);
    } else {
      scrollToBottom();
    }
  });

  socket.on('user_disconnected', (socketId) => {
    chatStore.removeUser(socketId);
    if (selectedUser.value?.socketId === socketId) selectedUser.value = null;
  });
});

onUnmounted(() => {
  if (socket) socket.disconnect();
});

watch(currentMessages, scrollToBottom);
</script>

<style scoped>
.bg-brown { background-color: #6d4c41; }
.btn-brown { background-color: #6d4c41; color: white; border-color: #6d4c41; }
.btn-brown:hover { background-color: #8d6242; color: white; }
.chat-messages {
  height: 340px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.chat-msg { display: flex; flex-direction: column; }
.msg-user { align-items: flex-start; }
.msg-admin { align-items: flex-end; }
.msg-bubble {
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  word-break: break-word;
}
.msg-user .msg-bubble { background: #f0e9e5; color: #333; }
.msg-admin .msg-bubble { background: #6d4c41; color: white; }
.msg-time { font-size: 10px; color: #aaa; margin-top: 2px; }
.list-group-item.active { background-color: #f5ebe6; color: #333; border-color: #e0d5d0; }
</style>