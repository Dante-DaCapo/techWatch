import { IsArray, IsDate, IsNumber, IsString, IsUrl } from "class-validator";

export class PinDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  imageUrl: string;

  @IsUrl()
  sourceUrl: string;

  @IsArray()
  tags: string[];

  @IsDate()
  createdDate: Date;
}
