import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

export const uploadToFireBase = async (uri: any, name: any, onProgress: any) => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();
  console.log("theblob", theBlob);
  const imageRef = ref(getStorage(), `images/${name}`);

  const uploadTask = uploadBytesResumable(imageRef, theBlob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ downloadUrl, metadata: uploadTask.snapshot.metadata });
      }
    );
  });
};
