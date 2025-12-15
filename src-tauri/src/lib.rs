use serde::Serialize;
use std::time::Duration;
use sysinfo::{
    ComponentRefreshKind, CpuRefreshKind, MemoryRefreshKind, RefreshKind, System,
};
use tauri::{
    async_runtime::{spawn, sleep},
    AppHandle, Manager, Runtime, WebviewWindow,
};

#[derive(Debug, Serialize, Clone)]
struct TemperatureProbe {
    label: String,
    temperature: f32,
}

#[derive(Debug, Serialize, Clone)]
struct TelemetryPayload {
    cpu_usage: f32,
    memory_used: u64,
    memory_total: u64,
    temperatures: Vec<TemperatureProbe>,
}

#[derive(Debug, Serialize, Clone)]
struct Specs {
    host: String,
    os_version: String,
    cpu_brand: String,
    physical_cores: Option<usize>,
    total_memory: u64,
}

#[tauri::command]
async fn get_specs() -> Specs {
    let mut sys = System::new_all();
    sys.refresh_all();

    Specs {
        host: sys.host_name().unwrap_or_else(|| "unknown".into()),
        os_version: sys
            .long_os_version()
            .unwrap_or_else(|| "Unknown OS".into()),
        cpu_brand: sys.global_cpu_info().brand().to_string(),
        physical_cores: sys.physical_core_count(),
        total_memory: sys.total_memory(),
    }
}

#[tauri::command]
async fn set_click_through(window: WebviewWindow, passthrough: bool) -> Result<(), String> {
    window
        .set_ignore_cursor_events(passthrough)
        .map_err(|e| e.to_string())
}

fn spawn_telemetry_stream<R: Runtime>(app: AppHandle<R>) {
    spawn(async move {
        let mut sys = System::new_with_specifics(
            RefreshKind::nothing()
                .with_cpu(CpuRefreshKind::everything())
                .with_memory(MemoryRefreshKind::everything())
                .with_components(ComponentRefreshKind::everything()),
        );

        loop {
            sys.refresh_specifics(
                RefreshKind::nothing()
                    .with_cpu(CpuRefreshKind::everything())
                    .with_memory(MemoryRefreshKind::everything())
                    .with_components(ComponentRefreshKind::everything()),
            );

            let cpu_usage = sys.global_cpu_info().cpu_usage();
            let memory_used = sys.used_memory();
            let memory_total = sys.total_memory();

            let temperatures = sys
                .components()
                .iter()
                .map(|component| TemperatureProbe {
                    label: component.label().to_string(),
                    temperature: component.temperature(),
                })
                .collect::<Vec<_>>();

            let payload = TelemetryPayload {
                cpu_usage,
                memory_used,
                memory_total,
                temperatures,
            };

            let _ = app.emit("telemetry://metrics", payload);
            sleep(Duration::from_millis(1000)).await;
        }
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            spawn_telemetry_stream(app.handle());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_specs, set_click_through])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
