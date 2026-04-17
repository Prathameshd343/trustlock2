/**
 * Utility functions for Client-Side Encryption (Zero-Knowledge Architecture)
 */

// Generate a random AES-GCM key
export const generateEncryptionKey = async (): Promise<CryptoKey> => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

// Export key to string to give to the user (since the server shouldn't store it)
export const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  const exportedKeyBuffer = new Uint8Array(exported);
  return btoa(String.fromCharCode(...exportedKeyBuffer));
};

// Import key from string
export const importKey = async (keyString: string): Promise<CryptoKey> => {
  const binaryDerString = atob(keyString);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }
  return await window.crypto.subtle.importKey(
    'raw',
    binaryDer.buffer,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );
};

// Encrypt a file blob
export const encryptFile = async (file: File, key: CryptoKey): Promise<{ encryptedBlob: Blob; iv: Uint8Array }> => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const fileBuffer = await file.arrayBuffer();

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    fileBuffer
  );

  return {
    encryptedBlob: new Blob([encryptedBuffer], { type: 'application/octet-stream' }),
    iv,
  };
};

// Decrypt a file blob
export const decryptFile = async (encryptedBlob: Blob, key: CryptoKey, iv: Uint8Array, originalType: string): Promise<Blob> => {
  const encryptedBuffer = await encryptedBlob.arrayBuffer();

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedBuffer
  );

  return new Blob([decryptedBuffer], { type: originalType });
};
