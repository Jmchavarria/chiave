import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationHttpDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageQuery: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  takeQuery: number;
}
