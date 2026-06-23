export function mockUpload(fileName: string) {
  return {
    url: `/mock-assets/${fileName}`,
    fileName,
  }
}
