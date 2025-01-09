/**
 * Since workers inherit the exec options from the parent thread, we
 * must be careful to avoid infinite "@babel/register" setup loops.
 *
 * If @babel/register is imported using the -r/--require flag, the worker
 * will have the same flag and we must avoid registering the @babel/register
 * hook again.
 *
 * - markInRegisterWorker() can be used to mark a set of env vars (that will
 *   be forwarded to a worker) as being in the @babel/register worker.
 * - isInRegisterWorker will be true in @babel/register workers.
 */

const envVarName = "___INTERNAL___IS_INSIDE_BABEL_REGISTER_WORKER___";
const envVarValue = "yes_I_am";

const markInRegisterWorker = (env: NodeJS.ProcessEnv) => ({
  ...env,
  [envVarName]: envVarValue,
});
const isInRegisterWorker = process.env[envVarName] === envVarValue;

export = { markInRegisterWorker, isInRegisterWorker };
