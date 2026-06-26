import { defineStore } from 'pinia';

export const useAdminChatStore = defineStore('adminChat', {
  state: () => ({
    chatUsers: [],
    allMessages: {}
  }),
  getters: {
    totalUnread: (state) => state.chatUsers.reduce((sum, u) => sum + (u.unread || 0), 0)
  },
  actions: {
    addUser(user) {
      if (!this.chatUsers.find(u => u.socketId === user.socketId)) {
        this.chatUsers.push({ ...user, unread: 0, lastMsg: '' });
      }
    },
    addMessage(socketId, msg) {
      if (!this.allMessages[socketId]) this.allMessages[socketId] = [];
      this.allMessages[socketId].push(msg);
    },
    incrementUnread(socketId) {
      const user = this.chatUsers.find(u => u.socketId === socketId);
      if (user) user.unread++;
    },
    clearUnread(socketId) {
      const user = this.chatUsers.find(u => u.socketId === socketId);
      if (user) user.unread = 0;
    },
    removeUser(socketId) {
      this.chatUsers = this.chatUsers.filter(u => u.socketId !== socketId);
    },
    updateLastMsg(socketId, text) {
      const user = this.chatUsers.find(u => u.socketId === socketId);
      if (user) user.lastMsg = text;
    }
  }
});