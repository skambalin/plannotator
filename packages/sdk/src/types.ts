/**
 * SDKClient is the consumer interface for external plugins to communicate
 * with the host agent (e.g. sending messages back to the coding session).
 */
export interface SDKClient {
  send?(message: string): Promise<void>;
}
