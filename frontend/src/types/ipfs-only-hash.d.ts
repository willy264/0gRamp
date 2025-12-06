declare module 'ipfs-only-hash' {
  export interface HashOptions {
    cidVersion?: 0 | 1
    rawLeaves?: boolean
    // Additional options supported by some versions; kept optional for flexibility
    cidBase?: 'base32' | 'base58btc'
  }

  /**
   * Compute an IPFS CID locally from the provided content without uploading.
   * Returns a CID string (v0 or v1 depending on options).
   */
  export function of(
    input: Uint8Array | ArrayBuffer | string,
    options?: HashOptions
  ): Promise<string>
}