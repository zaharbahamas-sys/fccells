import { spawn, type ChildProcess } from "child_process";

let pythonProcess: ChildProcess | null = null;
let isReady = false;

const PYTHON_HEALTH_URL = "http://127.0.0.1:5001/api/python/health";
const MAX_RETRIES = 30;
const RETRY_DELAY_MS = 1000;

export function isPythonReady(): boolean {
  return isReady;
}

async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(PYTHON_HEALTH_URL);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForHealth(): Promise<boolean> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    if (await checkHealth()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  }
  return false;
}

export async function startPythonService(): Promise<boolean> {
  console.log("[python] Starting Python service...");
  
  // Use local .venv Python environment
  const venvPath = `${process.cwd()}/.venv`;
  const pythonPath = `${venvPath}/bin/python`;
  
  pythonProcess = spawn(pythonPath, [
    "-m", "gunicorn",
    "--bind", "0.0.0.0:5001",
    "--workers", "1",
    "--threads", "4",
    "--timeout", "60",
    "--reuse-port",
    "python_services.app:app"
  ], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PYTHONPATH: `${venvPath}/lib/python3.11/site-packages:${process.cwd()}`,
      PATH: `${venvPath}/bin:${process.env.PATH}`,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  pythonProcess.stdout?.on("data", (data) => {
    const lines = data.toString().split("\n").filter(Boolean);
    lines.forEach((line: string) => console.log(`[python] ${line}`));
  });

  pythonProcess.stderr?.on("data", (data) => {
    const lines = data.toString().split("\n").filter(Boolean);
    lines.forEach((line: string) => console.log(`[python] ${line}`));
  });

  pythonProcess.on("exit", (code, signal) => {
    console.log(`[python] Process exited with code ${code}, signal ${signal}`);
    isReady = false;
    pythonProcess = null;
  });

  pythonProcess.on("error", (err) => {
    console.error("[python] Failed to start:", err.message);
    isReady = false;
  });

  const healthy = await waitForHealth();
  if (healthy) {
    isReady = true;
    console.log("[python] Service is ready");
  } else {
    console.error("[python] Service failed to start within timeout");
  }
  
  return healthy;
}

export function stopPythonService(): void {
  if (pythonProcess) {
    console.log("[python] Stopping Python service...");
    pythonProcess.kill("SIGTERM");
    pythonProcess = null;
    isReady = false;
  }
}

process.on("exit", stopPythonService);
process.on("SIGTERM", stopPythonService);
process.on("SIGINT", stopPythonService);
