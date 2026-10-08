import 'dotenv/config';
import { spawnSync } from 'child_process';
import net from 'net';

const PORT = 3002;
const HOST = '127.0.0.1';

function checkPort(port: number, host: string): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const onError = (): void => {
      socket.destroy();
      resolve(false);
    };

    socket.setTimeout(1000);
    socket.once('error', onError);
    socket.once('timeout', onError);

    socket.connect(port, host, () => {
      socket.end();
      resolve(true);
    });
  });
}

async function main(): Promise<void> {
  const isDevRunning = await checkPort(PORT, HOST);

  if (isDevRunning === true) {
    console.warn('\x1b[33m[Docusaurus Build] Dev server is active on port 3002.\x1b[0m');
    console.warn(
      '\x1b[33m[Docusaurus Build] WARNING: Running production build while dev server is active WILL crash the dev server!\x1b[0m',
    );
    console.warn(
      '\x1b[33m[Docusaurus Build] Proceeding anyway in 3 seconds. Please restart your dev server later.\x1b[0m\n',
    );
    await new Promise((resolve) => setTimeout(resolve, 3000));
  } else {
    console.info(
      '[Docusaurus Build] Dev server not active on port 3002. Proceeding with docusaurus build...',
    );
  }

  process.env.NODE_ENV = 'production';

  console.info('[Docusaurus Build] Clearing previous build artifacts...');
  spawnSync('pnpm', ['exec', 'docusaurus', 'clear'], {
    stdio: 'inherit',
    shell: true,
  });

  const result = spawnSync('pnpm', ['exec', 'docusaurus', 'build'], {
    stdio: 'inherit',
    shell: true,
  });
  process.exit(result.status ?? 0);
}

void main();
