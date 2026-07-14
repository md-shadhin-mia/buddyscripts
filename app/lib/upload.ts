import { getAccessToken } from "./apiClient";

type UploadResponse = {
  key: string;
  url: string;
};

export type UploadProgressCallback = (progress: number) => void;

export async function uploadFile(file: File, onProgress?: UploadProgressCallback): Promise<string> {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append("file", file);

  if (onProgress) {
    const url = await xhrUpload(formData, token, onProgress);
    return url;
  }

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }

  const json = await res.json();
  const data = json?.data ?? json;
  return data.url;
}

export async function uploadMultiple(files: File[]): Promise<string[]> {
  return Promise.all(files.map((f) => uploadFile(f)));
}

function xhrUpload(formData: FormData, token: string | null, onProgress: UploadProgressCallback): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText);
          const data = json?.data ?? json;
          resolve(data.url);
        } catch {
          reject(new Error("Failed to parse upload response"));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(formData);
  });
}
