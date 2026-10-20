import type { IPagination } from '../../../../../common/interfaces/pagination.interface';

export class FindVaultByUserIdQuery implements IPagination {
  constructor(
    public readonly userId: number,
    public readonly isFavorite: boolean,
    public readonly search: string,
    public readonly pageQuery = 1,
    public readonly takeQuery = 5,
  ) {}
}
