import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsDateString()
  createdDate?: string;

  @IsInt()
  @Min(1)
  pageNumber: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 30;
}
