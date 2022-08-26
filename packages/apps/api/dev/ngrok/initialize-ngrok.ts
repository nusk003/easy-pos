import ngrok from 'ngrok';

export const initializeNgrok = async () => {
  const url = await ngrok.connect(5000);
  return url;
};
