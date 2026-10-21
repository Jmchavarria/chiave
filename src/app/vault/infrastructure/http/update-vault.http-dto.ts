import { PartialType } from '@nestjs/mapped-types';
import { CreateVaultHttpDto } from './create-vault.http-dto';

export class UpdateVaultHttpDto extends PartialType(CreateVaultHttpDto) {}
