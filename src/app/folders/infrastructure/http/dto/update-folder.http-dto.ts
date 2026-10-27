import { PartialType } from '@nestjs/mapped-types';
import { CreateFolderHttpDto } from './create-folder.http-dto';

export class UpdateFolderHttpDto extends PartialType(CreateFolderHttpDto) {}
