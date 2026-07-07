<template>
  <div class="container-fluid py-4">

    <!-- Tab chuyển giữa Chat và Liên hệ -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'chat' }" @click="activeTab = 'chat'">
          💬 Chat realtime
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'contact' }" @click="activeTab = 'contact'">
          📩 Liên hệ
          <span v-if="unreadContacts > 0" class="badge bg-danger ms-1">{{ unreadContacts }}</span>
        </button>
      </li>
    </ul>

    <!-- ===== PHẦN CHAT REALTIME ===== -->
    <div v-if="activeTab === 'chat'">
      <div class="row g-3">
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
                  <button class="btn btn-brown" @click="sendReply" :disabled="!replyText.trim()">Gửi</button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== PHẦN LIÊN HỆ ===== -->
    <div v-if="activeTab === 'contact'">
      <div v-if="loadingContacts" class="text-center py-4">
        <div class="spinner-border text-secondary"></div>
      </div>

      <div v-else-if="contacts.length === 0" class="text-center text-muted py-5">
        📩 Chưa có liên hệ nào
      </div>

      <div v-else class="contact-list">
        <div
          v-for="c in contacts"
          :key="c._id"
          class="contact-card"
          :class="{ unread: !c.isRead }"
        >
          <div class="contact-card-header">
            <div>
              <span class="fw-semibold">{{ c.name }}</span>
              <span class="text-muted small ms-2">{{ c.email }}</span>
              <span v-if="!c.isRead" class="badge bg-danger ms-2 small">Mới</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="text-muted small">{{ formatDate(c.createdAt) }}</span>
              <button
                v-if="!c.isRead"
                class="btn btn-sm btn-outline-secondary"
                @click="markRead(c._id)"
              >✓ Đã đọc</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteContact(c._id)">🗑</button>
            </div>
          </div>
          <div class="contact-message">{{ c.message }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useAdminChatStore } from '../store/adminChatStore';

const auth = useAuthStore();
const chatStore = useAdminChatStore();

const activeTab = ref('chat');
const selectedUser = ref(null);
const replyText = ref('');
const messagesEl = ref(null);
let socket = null;

// Liên hệ
const contacts = ref([]);
const loadingContacts = ref(false);
const unreadContacts = computed(() => contacts.value.filter(c => !c.isRead).length);

const getTime = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const formatDate = (d) => new Date(d).toLocaleString('vi-VN');

const config = () => ({ headers: { Authorization: `Bearer ${auth.token}` } });

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
  socket.emit('admin_reply', { targetSocketId: selectedUser.value.socketId, text, time: getTime() });
  replyText.value = '';
  scrollToBottom();
};

// Load liên hệ từ DB
const loadContacts = async () => {
  loadingContacts.value = true;
  try {
    const res = await axios.get('/api/contact', config());
    contacts.value = res.data;
  } catch {} finally {
    loadingContacts.value = false;
  }
};

const markRead = async (id) => {
  try {
    await axios.put(`/api/contact/${id}/read`, {}, config());
    const c = contacts.value.find(x => x._id === id);
    if (c) c.isRead = true;
  } catch {}
};

const deleteContact = async (id) => {
  if (!confirm('Xóa liên hệ này?')) return;
  try {
    await axios.delete(`/api/contact/${id}`, config());
    contacts.value = contacts.value.filter(c => c._id !== id);
  } catch {}
};

// Khi bấm tab liên hệ → load
watch(activeTab, (tab) => {
  if (tab === 'contact') loadContacts();
});

onMounted(() => {
  socket = io('http://localhost:5000');

  socket.on('connect', () => {
    socket.emit('admin_join', { token: auth.token });
  });

  socket.on('user_connected', (user) => chatStore.addUser(user));

  socket.on('user_message', (data) => {
    const { socketId, text, time, userName } = data;
    chatStore.addUser({ socketId, userName });
    chatStore.addMessage(socketId, { text, sender: 'user', time });
    chatStore.updateLastMsg(socketId, text);
    if (selectedUser.value?.socketId !== socketId) chatStore.incrementUnread(socketId);
    else scrollToBottom();
  });

  socket.on('user_disconnected', (socketId) => {
    chatStore.removeUser(socketId);
    if (selectedUser.value?.socketId === socketId) selectedUser.value = null;
  });

  // Nhận liên hệ mới realtime
  socket.on('new_contact', (data) => {
    contacts.value.unshift({ ...data, _id: data.id, isRead: false });
    // Nếu đang ở tab liên hệ thì không cần thông báo riêng
    if (activeTab.value !== 'contact') {
      // Badge tự cập nhật qua unreadContacts computed
    }
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

/* Liên hệ */
.contact-list { display: flex; flex-direction: column; gap: 12px; }
.contact-card {
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(62,39,35,0.08);
  border-left: 4px solid transparent;
}
.contact-card.unread {
  border-left-color: #c0392b;
  background: #fffbf0;
}
.contact-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.contact-message {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.6;
  white-space: pre-wrap;
}

.nav-link { cursor: pointer; color: #6d4c41; }
.nav-link.active { color: #6d4c41; border-bottom: 2px solid #6d4c41; background: transparent; }
</style>