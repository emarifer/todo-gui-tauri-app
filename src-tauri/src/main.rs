#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::collections::HashMap;

#[tauri::command]
fn show_data() -> Result<HashMap<String, (bool, String, u64)>, String> {
    let todo = app::Todo::new();

    match todo {
        Ok(todo) => Ok(todo.map),
        Err(why) => Err(format!("Ha ocurrido un error π±: {}", why)),
    }
}

#[tauri::command]
fn add_todo(key: &str) -> Result<String, String> {
    let todo = app::Todo::new();

    match todo {
        Ok(mut todo) => {
            todo.insert(key);

            match todo.save() {
                Ok(resp) => Ok(resp),
                Err(why) => Err(format!("Ha ocurrido un error: {} π±", why)),
            }
        }
        Err(why) => Err(format!("Ha ocurrido un error π±: {}", why)),
    }
}

#[tauri::command]
fn remove_todo(key: &str) -> Result<String, String> {
    let todo = app::Todo::new();

    match todo {
        Ok(mut todo) => match todo.delete(key) {
            None => Err(format!(
                "'{}' no estΓ‘ presente en la lista de tareas π±",
                key.trim()
            )),
            Some(entry) => match todo.save() {
                Ok(_) => Ok(format!("La tarea '{}' ha sida eliminada π", entry)),
                Err(why) => Err(format!("Ha ocurrido un error: {} π±", why)),
            },
        },
        Err(why) => Err(format!("Ha ocurrido un error: {} π±", why)),
    }
}

#[tauri::command]
fn update_todo(key: &str) -> Result<String, String> {
    let todo = app::Todo::new();

    match todo {
        Ok(mut todo) => match todo.complete(key) {
            None => Err(format!(
                "'{}' no estΓ‘ presente en la lista de tareas π±",
                key.trim()
            )),
            Some(_) => match todo.save() {
                Ok(_) => Ok(format!("La tarea '{}' ha sida actualizada π", key.trim())),
                Err(why) => Err(format!("Ha ocurrido un error: {} π±", why)),
            },
        },
        Err(why) => Err(format!("Ha ocurrido un error: {} π±", why)),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            show_data,
            add_todo,
            remove_todo,
            update_todo
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/*
 * REFACTOR DE LA APLICACION USANDO IDEAS DE:
 * https://github.com/Proful/dynaexplorer
 *
 * Crear JSON serializando estructuras de datos:
 * https://docs.serde.rs/serde_json/#creating-json-by-serializing-data-structures
*
 * CΓ³mo usar variables globales idiomΓ‘ticamente en Rust:
 * https://www.sitepoint.com/rust-global-variables/
*
 * POSIBLE SOLUCION AL PROBLEMA DE CARGO CHECK:
 * https://stackoverflow.com/questions/47565203/cargo-build-hangs-with-blocking-waiting-for-file-lock-on-the-registry-index-a
 *
 * MANEJO DE ERRORES EN RUST:
 * https://fettblog.eu/rust-error-handling/
 */
