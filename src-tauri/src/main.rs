#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
fn show_data() -> Result<String, String> {
  let todo = app::Todo::new();

  match todo {
      Ok(todo) => match serde_json::to_string(&todo.map) {
          Ok(map) => Ok(map),
          Err(_) => Err("No ha sido posible leer el archivo de DB 😱".into()),
      },
      Err(why) => Err(format!("Ha ocurrido un error 😱: {}", why)),
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
              Err(why) => Err(format!("Ha ocurrido un error: {} 😱", why)),
          }
      }
      Err(why) => Err(format!("Ha ocurrido un error 😱: {}", why)),
  }
}

#[tauri::command]
fn remove_todo(key: &str) -> Result<String, String> {
  let todo = app::Todo::new();

  match todo {
      Ok(mut todo) => match todo.delete(key) {
          None => Err(format!(
              "'{}' no está presente en la lista de tareas 😱",
              key.trim()
          )),
          Some(entry) => match todo.save() {
              Ok(_) => Ok(format!("La tarea '{}' ha sida eliminada 😀", entry)),
              Err(why) => Err(format!("Ha ocurrido un error: {} 😱", why)),
          },
      },
      Err(why) => Err(format!("Ha ocurrido un error: {} 😱", why)),
  }
}

#[tauri::command]
fn update_todo(key: &str) -> Result<String, String> {
  let todo = app::Todo::new();

  match todo {
      Ok(mut todo) => match todo.complete(key) {
          None => Err(format!(
              "'{}' no está presente en la lista de tareas 😱",
              key.trim()
          )),
          Some(_) => match todo.save() {
              Ok(_) => Ok(format!("La tarea '{}' ha sida actualizada 😀", key.trim())),
              Err(why) => Err(format!("Ha ocurrido un error: {} 😱", why)),
          },
      },
      Err(why) => Err(format!("Ha ocurrido un error: {} 😱", why)),
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
* Crear JSON serializando estructuras de datos:
* https://docs.serde.rs/serde_json/#creating-json-by-serializing-data-structures
*
* Cómo usar variables globales idiomáticamente en Rust:
* https://www.sitepoint.com/rust-global-variables/
*
* POSIBLE SOLUCION AL PROBLEMA DE CARGO CHECK:
* https://stackoverflow.com/questions/47565203/cargo-build-hangs-with-blocking-waiting-for-file-lock-on-the-registry-index-a
* 
* MANEJO DE ERRORES EN RUST:
* https://fettblog.eu/rust-error-handling/
*/
