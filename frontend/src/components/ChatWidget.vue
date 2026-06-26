<template>
  <!-- Nút mở chat -->
  <div class="chat-launcher" @click="toggleChat">
    <span class="chat-icon">💬</span>
    <span v-if="unread > 0" class="chat-badge">{{ unread }}</span>
  </div>

  <!-- Cửa sổ chat -->
  <div class="chat-window" :class="{ open: isOpen }">
    <!-- Header -->
    <div class="chat-header">
      <div class="d-flex align-items-center gap-2">
        <div class="avatar">☕</div>
        <div>
          <div class="fw-bold">Bình Coffee</div>
          <div class="chat-status">● Trực tuyến</div>
        </div>
      </div>
      <button class="btn-close-chat" @click="toggleChat">✕</button>
    </div>

    <!-- Messages -->
    <div class="chat-messages" ref="messagesEl">
      <div v-if="messages.length === 0" class="chat-empty">
        Xin chào! Bạn cần hỗ trợ gì không? 😊
      </div>
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="chat-msg"
        :class="msg.sender === 'user' ? 'msg-user' : 'msg-admin'"
      >
        <div class="msg-bubble">{{ msg.text }}</div>
        <div class="msg-time">{{ msg.time }}</div>
      </div>
    </div>

    <!-- Input -->
    <div class="chat-input">
      <input
        v-model="inputText"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Nhập tin nhắn..."
        :disabled="!isConnected"
      />
      <button @click="sendMessage" :disabled="!inputText.trim() || !isConnected">
        ➤
      </button>
    </div>
    <div v-if="!isConnected" class="chat-offline">Đang kết nối...</div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

const auth = useAuthStore();
const isOpen = ref(false);
const inputText = ref('');
const messages = ref([]);
const unread = ref(0);
const isConnected = ref(false);
const messagesEl = ref(null);

let socket = null;

const getTime = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

const scrollToBottom = async () => {
  await nextTick();
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
  }
};

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) unread.value = 0;
};

const sendMessage = () => {
  const text = inputText.value.trim();
  if (!text || !socket) return;

  const msg = {
    text,
    sender: 'user',
    time: getTime(),
    userName: auth.user?.name || 'Khách',
    userId: auth.user?._id || 'guest'
  };

  messages.value.push(msg);
  socket.emit('user_message', msg);
  inputText.value = '';
  scrollToBottom();
};

onMounted(() => {
  socket = io('http://localhost:5000');

  socket.on('connect', () => {
    isConnected.value = true;
    // Gửi thông tin user khi kết nối
    socket.emit('user_join', {
      userId: auth.user?._id || 'guest',
      userName: auth.user?.name || 'Khách'
    });
  });

  socket.on('disconnect', () => {
    isConnected.value = false;
  });

  // Nhận tin nhắn từ admin
  socket.on('admin_reply', (msg) => {
    messages.value.push({ ...msg, sender: 'admin', time: getTime() });
    if (!isOpen.value) unread.value++;
    scrollToBottom();
  });
});

onUnmounted(() => {
  if (socket) socket.disconnect();
});

watch(messages, scrollToBottom);
</script>

<style scoped>
.chat-launcher {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: #6d4c41;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  z-index: 999;
  transition: transform 0.2s;
}
.chat-launcher:hover { transform: scale(1.1); }
.chat-icon { font-size: 24px; }
.chat-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #e53935;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-window {
  position: fixed;
  bottom: 90px;
  right: 24px;
  width: 320px;
  height: 420px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  z-index: 998;
  opacity: 0;
  pointer-events: none;
  transform: translateY(20px);
  transition: opacity 0.25s, transform 0.25s;
}
.chat-window.open {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.chat-header {
  background: #6d4c41;
  color: white;
  padding: 12px 16px;
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.avatar {
  width: 36px;
  height: 36px;
  background: #d7a86e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.chat-status { font-size: 11px; color: #a5d6a7; }
.btn-close-chat {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 0 4px;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.chat-empty {
  text-align: center;
  color: #aaa;
  margin-top: 40px;
  font-size: 14px;
}
.chat-msg { display: flex; flex-direction: column; }
.msg-user { align-items: flex-end; }
.msg-admin { align-items: flex-start; }
.msg-bubble {
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  word-break: break-word;
}
.msg-user .msg-bubble { background: #6d4c41; color: white; border-bottom-right-radius: 4px; }
.msg-admin .msg-bubble { background: #f0e9e5; color: #333; border-bottom-left-radius: 4px; }
.msg-time { font-size: 10px; color: #aaa; margin-top: 2px; }
.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #f0e9e5;
  gap: 8px;
}
.chat-input input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 13px;
  outline: none;
}
.chat-input input:focus { border-color: #6d4c41; }
.chat-input button {
  background: #6d4c41;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.chat-input button:hover { background: #8d6242; }
.chat-input button:disabled { background: #ccc; cursor: not-allowed; }
.chat-offline {
  text-align: center;
  font-size: 11px;
  color: #aaa;
  padding: 4px;
}
</style>