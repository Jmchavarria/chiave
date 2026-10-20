import { Body, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { VaultDE } from '../../domain/entities/vault.domain-entity';
import { Pagination } from '../../../../common/pagintation';
import { FindVaultByUserIdQuery } from '../../application/queries/find-vault-by-user-id/find-vault-by-user-id.query';
import { FindVaultByUserIdHttpDto } from './find-vault-by-user-id.http-dto';

@Controller('vault')
export class VaultController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  findVaultByUserId(
    @Param('id', ParseIntPipe) userId: number,
    @Query() input: FindVaultByUserIdHttpDto,
  ): Promise<Pagination<VaultDE[]>> {
    return this.queryBus.execute<FindVaultByUserIdQuery, Pagination<VaultDE[]>>(
      new FindVaultByUserIdQuery(
        userId,
        input.isFavorite,
        input.search,
        input.pageQuery,
        input.takeQuery,
      ),
    );
  }
}
