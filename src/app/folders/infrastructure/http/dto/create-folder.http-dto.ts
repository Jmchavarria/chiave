import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFolderHttpDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
