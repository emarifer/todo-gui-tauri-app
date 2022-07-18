import { deleteTask, updateTask } from '../backend/backend';

import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';

import { ComponentProps } from '../types';

import { AiFillDelete } from 'react-icons/ai';
import { MdUpdate } from 'react-icons/md';

export const ComponentItems = ({ data, show }: ComponentProps) => {
	const removeTodo = (key: string) => {
		deleteTask(key)
			.then((content) => {
				Swal.fire({
					title: 'Éxito',
					text: content,
					icon: 'success',
					confirmButtonText: 'Ok',
				});
			})
			.catch((error) => {
				Swal.fire({
					title: 'Error',
					text: error as string,
					icon: 'error',
					confirmButtonText: 'Ok',
				});
			});
		show();
	};

	const completedTask = (key: string) => {
		updateTask(key)
			.then((content) => {
				Swal.fire({
					title: 'Éxito',
					text: content,
					icon: 'success',
					confirmButtonText: 'Ok',
				});
			})
			.catch((error) => {
				Swal.fire({
					title: 'Error',
					text: error as string,
					icon: 'error',
					confirmButtonText: 'Ok',
				});
			});
		show();
	};

	const sortData = (data: [string, [boolean, string, number]][]) =>
		data.sort((a, b) => b[1][2] - a[1][2]);

	return (
		<div>
			{sortData(Object.entries(data)).map((task) => (
				<li className={task[1][0] ? 'active' : 'inactive'} key={task[0]}>
					<div title={task[0]} className="todo">
						{task[0]}
					</div>
					:&nbsp;&nbsp;🕒&nbsp;&nbsp;
					<div style={{ whiteSpace: 'nowrap' }}>{task[1][1]}</div>
					<button
						title="Completar"
						className="completed"
						onClick={() => completedTask(task[0])}
					>
						<MdUpdate />
					</button>
					<button
						title="Eliminar"
						className="delete"
						onClick={() => removeTodo(task[0])}
					>
						<AiFillDelete />
					</button>
				</li>
			))}
		</div>
	);
};
