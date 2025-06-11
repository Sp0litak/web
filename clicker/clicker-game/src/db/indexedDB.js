import { get, set } from 'idb-keyval';

export const saveProgress = async (state) => {
  try {
    await set('clicker-save', state);
  } catch (e) {
    console.error('Помилка збереження', e);
  }
};

export const loadProgress = async () => {
  try {
    return await get('clicker-save') || {};
  } catch (e) {
    console.error('Помилка завантаження', e);
    return {};
  }
};
