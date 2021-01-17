import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  // to create new Nest app, we use the NestFactory class
  const app = await NestFactory.create(AppModule); // the create method return the application object
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
// npm run start:dev
