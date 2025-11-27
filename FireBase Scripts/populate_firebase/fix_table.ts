import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// 🔹 Inicializa tu app con credenciales de servicio
initializeApp({
  credential: cert({
    projectId: "appmoviles-b5003",
    clientEmail: "firebase-adminsdk-fbsvc@appmoviles-b5003.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQClJO1NbzDiNlq6\nAw2mzQo/CGZBXrIyqDpS9+ay5TqCKSsPed/Mi54BD5NvIFoUsh+R8q7CgljNKYop\nIMqoQJyLRADU568HzGvXRx6LBNW3rEAiPwZ8vZyATEIihjYWZf08+wYcv1vucNU4\niYVRLvPgnSHD0/HnHf7h5kvW8adL/vIzvMCJU3XRgEEaZG7uQAVAYrTmObaW/wKh\ngkPuTEia/RclJOGN0Lf40lIJ3vccEQQonuEqaPwg0WydNN2TfNTudqt15smAQzv7\n8L+SjATvN1J16pZ0NIAUVZ+5XXUXaAIdh/AtQyc2VfPiZ1twbCTJx2ulwsXcPN4o\nKWC7m3qxAgMBAAECggEAALJdr/Byp9mr21IM+jGuQ+LQr6DrJoyQJm52UjXmX8s1\nq8yLVa0XHxEGQbdEugagXHjGJPrwzfjJZPAG+tu+7VV9nWhW1DUYFWHu7o44Kpy2\n7o4OhHM2WFI6CzQ+wSxv+5Rhi7iA9koSlDj8T4HftIhlLpLT1/JH84MJud/uIUNx\n3Pk6vKpLK+wBu6NUOUi8MDBazrwjx3msb0mIjiCljfl5y2SLcMlNq7QRnAFwjYeo\nBKgL7uULyvf4rkasPAuxhZQBC4sVhYNfJjZw4/Qh/W36XniWz7bPznUZJpeUKoaI\nh3UCTBnzsUugJNav73HUwW83+CB3c3q2xPudFsIPYwKBgQDPpWdmyl/e8mpkdVOb\nKSPX/bVsRuWteB8qzP/onfqIL3bOiIYdfXf0rOwL69hcky3TFldbwRz1gMnDQ6Qh\n02bhwhaczs611BsirDSIFbTeSD+mLwvyIXENGNS+3FahtHG2XSak9BzSo/9lV07K\nXSA2ckLyhn1M4s0YEtmAKmjyBwKBgQDLmdIliEwo9SQRv2U1V+WTo2OuYkU1dI9g\nbjs2IWBlkthvnp7rkb24pI9qnqy9vttHAKDIlyVt2EM9uJn7bq1D7z6cumrhlgju\npNSoE7vj7sBOz++CP6tbljXInWSPs8pEWoATG0qhMF2Ok5XEVqM9Qcic6SsDcLg5\nK6QQXiMfhwKBgDOqsW7nPjGoWgbDFtmNxAhzbZgSkAW41PB+b9K+tF78iHBdkhl2\nZcmw2U8iEQT/7jAO6A/BnmYL9KgshYORKZFVDPFZmB+wNkxLUwrlc8q3aXb9T9ig\nr5OVsSIIi1nTH1REG2CCCUX0XpElx0odH+3MQpI8GqNt76Bk2E/GvbQzAoGAXjvy\nvPZpsadMq343nMny8zNzhpnrSIOLfOloNHScRkcCMB9tlMCe3CAmVQXeE/CLU0Ci\nKlVyuHWZIa8Ybfxa64+HHklWANVNiw71clm35BZ0IcYyJ8nKSRisCg93JN/lJV/x\n2WYPU62sD7qVXgtvgIG7FY0CIJSCX8uoIv8/KG8CgYAZZwWBnKCowo2phfr9vv6o\nT7Y83UojJc8QRKnnHugqpBPz0ZzX0LpSmV4xjmK9026QKqsiDZA9Bg78GY+DaGw3\nZFkVHvYTl6L8iwW18wlekOQ0P+XTXX3KTZTE6U8lkkjqLDJpq7GPGG1aaTW+TPxJ\nBsQ8TaLPal/S2HLERa/Gqg==\n-----END PRIVATE KEY-----\n"})
});

const db = getFirestore();
const collectionName = 'fichamedica'; // Ajusta al nombre de tu colección

async function normalizeFields() {
  const snapshot = await db.collection(collectionName).get();
  console.log(`Se encontraron ${snapshot.size} documentos.`);

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const updatedData: any = {};

    // 🔹 Recorrer todas las propiedades y pasar a minúscula
    Object.keys(data).forEach(key => {
      const lowerKey = key.toLowerCase();
      updatedData[lowerKey] = data[key];
    });

    // 🔹 Sobrescribir el documento con los campos en minúscula
    await doc.ref.set(updatedData, { merge: true });
    console.log(`Documento ${doc.id} actualizado.`);
  }

  console.log('Normalización de campos completa.');
}

normalizeFields().catch(console.error);
