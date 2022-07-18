import { useEffect, useState } from 'react';
import { Items } from './types';
import { addTask, showData } from './backend/backend';

import reactLogo from './assets/react.svg';

import Swal from 'sweetalert2';

import './App.css';
import 'sweetalert2/dist/sweetalert2.min.css';

import { ComponentItems } from './components';

import { BsListTask } from 'react-icons/bs';

export const App = () => {
	const [data, setData] = useState<Items>({});

	const [newTodo, setNewTodo] = useState<string>('');

	const displayTasks = () =>
		showData()
			.then((Items) => setData(Items))
			.catch((error) => {
				Swal.fire({
					title: 'Error',
					text: error as string,
					icon: 'error',
					confirmButtonText: 'Ok',
				});
			});

	const addTodo = (key: string) => {
		addTask(key)
			.then((content) => {
				Swal.fire({
					title: 'Completado',
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
		displayTasks();
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		setNewTodo(event.target.value);
	};

	const handleClick = () => {
		if (!newTodo || newTodo.length === 0) {
			Swal.fire({
				title: 'Info',
				text: 'No has ingresado texto. 🤐',
				icon: 'info',
				confirmButtonText: 'Ok',
			});
			return;
		}
		addTodo(newTodo);
		setNewTodo('');
	};

	useEffect(() => {
		displayTasks();
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
							value={newTodo}
							autoComplete="off"
						/>

						<button title="Añadir tarea" className="add" onClick={handleClick}>
							<BsListTask />
						</button>
					</div>
				</nav>

				<img src={reactLogo} className="logo" alt="reactLogo" />
				<p>Mis Tareas:</p>
				<ComponentItems show={displayTasks} data={data} />
			</header>
		</div>
	);
};

/**
 * ORDENAR UN ARRAY DE ARRAYS:
 * https://stackoverflow.com/questions/50415200/sort-an-array-of-arrays-in-javascript
 *
 * ¿Cómo puedo forzar que los contenidos div permanezcan en una línea con HTML y CSS?:
 * https://stackoverflow.com/questions/5232310/how-can-i-force-div-contents-to-stay-in-one-line-with-html-and-css#39866955
 *
 * REFACTOR DE LA APLICACION USANDO IDEAS DE:
 * https://github.com/Proful/dynaexplorer
 */
