use chrono::{Local, Timelike, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time;

#[derive(Debug, Serialize, Deserialize)]
pub struct Todo {
    // Usamos el tipo HashMap que está incorporado en Rust.
    pub map: HashMap<String, (bool, String, u64)>,
}

impl Todo {
    pub fn new() -> Result<Todo, Box<dyn std::error::Error>> {
        let f = std::fs::OpenOptions::new()
            .write(true)
            .create(true)
            .read(true)
            .open(get_database())?;

        // Serializar el archivo json como HashMap
        match serde_json::from_reader(f) {
            Ok(map) => Ok(Todo { map }),
            Err(e) if e.is_eof() => Ok(Todo {
                map: HashMap::new(),
            }),
            Err(e) => Err(Box::new(e)),
        }
    }

    pub fn insert(&mut self, key: &str) {
        // Insertamos un nuevo valor en nuestro mapa.
        // Por default, el value va a ser true por default.
        self.map.insert(
            key.trim().to_string(),
            (true, get_time_and_date().0, get_time_and_date().1),
        );
    }

    pub fn save(self) -> Result<String, Box<dyn std::error::Error>> {
        // Abrir db.json
        let f = std::fs::OpenOptions::new()
            .write(true)
            .truncate(true) // VER NOTA-1 ABAJO:
            .create(true)
            .open(get_database())?;

        // Escribir en el archivo con serde
        serde_json::to_writer_pretty(f, &self.map)?;
        Ok("Tarea guardada correctamente 😀".into())
    }

    pub fn complete(&mut self, key: &str) -> Option<()> {
        match self.map.get_mut(key.trim()) {
            Some(v) => Some(*v = (false, get_time_and_date().0, get_time_and_date().1)),
            None => None,
        }
    }

    pub fn delete(&mut self, key: &str) -> Option<String> {
        match self.map.remove_entry(key.trim()) {
            Some(e) => Some(e.0),
            None => None,
        }
    }
}

fn get_time_and_date() -> (String, u64) {
    let now = Local::now();
    let date = Utc::now().date().format("%d-%m-%Y");
    let (is_pm, hour) = now.hour12();

    let duration = time::SystemTime::now()
        .duration_since(time::SystemTime::UNIX_EPOCH)
        .expect("SystemTime before UNIX EPOCH!");

    let timestamp = duration.as_secs();

    let time_and_date = format!(
        "{:02}:{:02}:{:02} {} • {}",
        hour,
        now.minute(),
        now.second(),
        if is_pm { "PM" } else { "AM" },
        date
    );

    (time_and_date, timestamp)
}

fn get_database() -> String {
    let mut database = String::new();

    match home::home_dir() {
        Some(path) => match path.join(".db.json").to_str() {
            None => println!("¡El path no es una secuencia UTF-8 válida! 😱"),
            Some(my_home) => database = my_home.to_string(),
        },
        None => println!("¡Imposible conseguir el directorio Home! 😱"),
    }

    database
}

/*
 * OBTENCIÓN DEL TIMESTAMP EN RUST:
 * https://doc.rust-lang.org/std/time/struct.SystemTime.html#implementations
 */
