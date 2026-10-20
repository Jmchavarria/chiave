import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationHttpDto } from '../../../../common/http/dto/pagination.http-dto';

export class FindVaultByUserIdHttpDto extends PaginationHttpDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsOptional()
  @IsBoolean()
  isFavorite: boolean;
}
