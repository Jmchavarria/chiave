export class Pagination<T> {
  public readonly totalPages: number;
  constructor(
    public readonly data: T,
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
  ) {
    this.totalPages = Math.ceil(this.total / this.limit);
  }
}
