/**
 * WebCrypto AES-GCM-256 & SHA-256 Cryptographic Operations Engine
 */

export interface EncryptedChunk {
  ciphertext: ArrayBuffer;
  iv: Uint8Array;
}

export async function generateAESKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function exportRawKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  const exportedArray = new Uint8Array(exported);
  return Array.from(exportedArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function encryptChunk(data: ArrayBuffer, key: CryptoKey): Promise<EncryptedChunk> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );
  return { ciphertext, iv };
}

export async function decryptChunk(
  ciphertext: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array
): Promise<ArrayBuffer> {
  return await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    ciphertext
  );
}

export async function calculateSHA256(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
