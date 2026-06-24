export function mockUpload(fileName: string) {
  return {
    url: `https://minio.example.com/threevine/uploads/${fileName}`,
    fileName,
    persisted: true,
  }
}
