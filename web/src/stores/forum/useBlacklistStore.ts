import { useLocalStorage } from '@/util';
import { LSKey } from '../key';

interface BlockUserComment {
  usernames: string[];
  tags: string[];
}

export const useBlacklistStore = defineStore(LSKey.Blacklist, () => {
  const blacklist = useLocalStorage<BlockUserComment>(LSKey.Blacklist, {
    usernames: [],
    tags: [],
  });

  function addUser(username: string) {
    if (!blacklist.value.usernames.includes(username)) {
      blacklist.value.usernames.push(username);
    }
  }

  function removeUser(username: string) {
    blacklist.value.usernames = blacklist.value.usernames.filter(
      (name) => name !== username,
    );
  }

  function isUserBlocked(userName: string) {
    return blacklist.value.usernames.includes(userName);
  }

  function addTag(tag: string) {
    if (blacklist.value.tags.includes(tag)) {
      blacklist.value.tags.push(tag);
    }
  }

  function removeTag(tag: string) {
    blacklist.value.tags = blacklist.value.tags.filter((input) => input != tag);
  }

  function parseTag() {
    let str = ' ';
    blacklist.value.tags.forEach((tag) => {
      str += `-${tag}$`;
    });
  }

  return {
    blacklist,
    addUser: addUser,
    removeUser: removeUser,
    isUserBlocked: isUserBlocked,
    addTag: addTag,
    removeTag: removeTag,
    parseTag: parseTag,
  };
});
