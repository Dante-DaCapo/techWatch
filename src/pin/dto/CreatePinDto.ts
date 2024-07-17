import { IsArray, IsString, IsUrl } from "class-validator";

export class CreatePinDto {
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
}
