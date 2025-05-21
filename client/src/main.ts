import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


export const logE = (message: string, ...args: any[]) => {
  console.log(`${message}`, ...args);
}

export const logI = (message: string, ...args: any[]) => {
  console.log(`${message}`, ...args);
}
