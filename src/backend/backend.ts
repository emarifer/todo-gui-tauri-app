import { invoke } from '@tauri-apps/api';
import { Items } from '../types';

const showData = async (): Promise<Items> =>
	(await invoke('show_data')) as Items;

const addTask = async (key: string): Promise<string> =>
	(await invoke('add_todo', { key: key })) as string;

const deleteTask = async (key: string): Promise<string> =>
	(await invoke('remove_todo', { key: key })) as string;

const updateTask = async (key: string): Promise<string> =>
	(await invoke('update_todo', { key: key })) as string;

export { showData, addTask, deleteTask, updateTask };
