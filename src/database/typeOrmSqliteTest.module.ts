import { TypeOrmModule } from "@nestjs/typeorm";

export const TypeOrmSQLITETestingModule = (entities: any[]) => [
  TypeOrmModule.forRoot({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [...entities],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([...entities]),
];
