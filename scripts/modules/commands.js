// scripts/modules/commands.js
import { spawn } from 'child_process';

export function runCLI(args) {
	return new Promise((resolve, reject) => {
		const [command, ...extraArgs] = args.slice(2); // skip 'node' and 'dev.js'

		if (!command) {
			console.error('❌ No command provided.');
			process.exit(1);
		}

		// Map 'mcp' to the real command
		const fullCommand = command === 'mcp' ? 'npx' : command;
		const fullArgs = command === 'mcp' ? ['-y', 'task-master-mcp'] : extraArgs;

		console.log(`🛠️  Running command: ${fullCommand} ${fullArgs.join(' ')}`);

		const subprocess = spawn(fullCommand, fullArgs, {
			stdio: 'inherit',
			shell: true,
		});

		subprocess.on('close', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`Command "${command} ${extraArgs.join(' ')}" exited with code ${code}`));
			}
		});
	});
}
