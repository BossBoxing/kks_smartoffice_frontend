import { version } from 'src/version';


export const environment = {
  production: true,
  apiUrl: '/api/',
  authUrl: 'https://localhost:5000',
  reportUrl: 'http://localhost:8080/report',
  timeStamp: version.timeStamp
};
