import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import './request-user/request-user.interface';


require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
