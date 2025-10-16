import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  language!: string;

  @IsDateString()
  createdAt!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageNumber: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 30;
}
