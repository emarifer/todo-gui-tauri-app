import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import Swal from 'sweetalert2';

import './App.css';
import 'sweetalert2/dist/sweetalert2.min.css';

import { invoke } from '@tauri-apps/api/tauri';

import { AiFillDelete } from 'react-icons/ai';
import { MdUpdate } from 'react-icons/md';
import { BsListTask } from 'react-icons/bs';

interface Items {
	[key: string]: [boolean, string, number];
}

export const App = () => {
	const [data, setData] = useState<Items>({});

	const [todo, setTodo] = useState<string>('');

	const showData = () => {
		invoke('show_data')
			.then((content) => {
				setData(JSON.parse(content as string));
			})
			.catch((error) => {
				Swal.fire({
					title: 'Error',
					text: error,
					icon: 'error',
					confirmButtonText: 'Ok',
				});
			});
	};

	const addTask = (key: string) => {
		invoke('add_todo', { key: key })
			.then((content) => {
				Swal.fire({
					title: 'Éxito',
					text: content as string,
					icon: 'success',
					confirmButtonText: 'Ok',
				});
			})
			.catch((error) => {
				Swal.fire({
					title: 'Error',
					text: error,
					icon: 'error',
					confirmButtonText: 'Ok',
				});
			});
		showData();
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		setTodo(event.target.value);

		// console.log('value is:', event.target.value);
	};

	const handleClick = () => {
		// console.log('handleClick 👉️', todo);
		if (!todo || todo.length === 0) {
			Swal.fire({
				title: 'Info',
				text: 'No has ingresado texto. 🤐',
				icon: 'info',
				confirmButtonText: 'Ok',
			});
			return;
		}
		addTask(todo);
		setTodo('');
	};

	useEffect(() => {
		showData();
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<nav>
					<div className="parent">
						<input
							placeholder="Ingresa una tarea"
							type="text"
							id="message"
							name="message"
							onChange={handleChange}
							value={todo}
							autoComplete="off"
						/>

						<button title="Añadir tarea" className="add" onClick={handleClick}>
							<BsListTask />
						</button>
					</div>
				</nav>

				<img src={reactLogo} className="logo" alt="reactLogo" />
				<p>Mis Tareas:</p>
				<Items show={showData} data={data} />
			</header>
		</div>
	);
};

type ComponentProps = {
	data: Items;
	show: () => void;
};

export const Items = ({ data, show }: ComponentProps) => {
	const deleteTask = (key: string) => {
		invoke('remove_todo', { key: key })
			.then((content) => {
				Swal.fire({
					title: 'Éxito',
					text: content as string,
					icon: 'success',
					confirmButtonText: 'Ok',
				});
			})
			.catch((error) => {
				Swal.fire({
					title: 'Error',
					text: error,
					icon: 'error',
					confirmButtonText: 'Ok',
				});
			});
		show();
	};

	const completedTask = (key: string) => {
		invoke('update_todo', { key: key })
			.then((content) => {
				Swal.fire({
					title: 'Éxito',
					text: content as string,
					icon: 'success',
					confirmButtonText: 'Ok',
				});
			})
			.catch((error) => {
				Swal.fire({
					title: 'Error',
					text: error,
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
						onClick={() => deleteTask(task[0])}
					>
						<AiFillDelete />
					</button>
				</li>
			))}
		</div>
	);
};

/**
 * ORDENAR UN ARRAY DE ARRAYS:
 * https://stackoverflow.com/questions/50415200/sort-an-array-of-arrays-in-javascript
 *
 * ¿Cómo puedo forzar que los contenidos div permanezcan en una línea con HTML y CSS?:
 * https://stackoverflow.com/questions/5232310/how-can-i-force-div-contents-to-stay-in-one-line-with-html-and-css#39866955
 */
