import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

/** Utility to turn JSON nulls into undefined for optional props */
const NullToUndefined = () => Transform(({ value }) => (value === null ? undefined : value));

export class GitHubOwnerDto {
  @IsString()
  @Expose()
  login!: string;

  @IsInt()
  @Expose()
  id!: number;
}

export class GitHubItemDto {
  @IsInt()
  @Expose()
  id!: number;

  @IsString()
  @Expose()
  name!: string;

  @IsString()
  @Expose({ name: 'full_name' })
  fullName!: string;

  // primary URL
  @IsUrl()
  @Expose({ name: 'html_url' })
  htmlUrl!: string;

  @IsOptional()
  @IsString()
  @NullToUndefined()
  @Expose()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GitHubOwnerDto)
  @NullToUndefined()
  @Expose()
  owner?: GitHubOwnerDto;

  @IsOptional()
  @IsString()
  @NullToUndefined()
  @Expose()
  language?: string;

  @IsInt()
  @Expose({ name: 'stargazers_count' })
  stargazersCount!: number;

  @IsInt()
  @Expose({ name: 'forks_count' })
  forksCount!: number;

  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'created_at' })
  createdAt!: Date;

  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'updated_at' })
  updatedAt!: Date;

  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'pushed_at' })
  pushedAt!: Date;

  @IsInt()
  @Expose()
  @Transform(({ obj }) => {
    const src = (obj.updatedAt instanceof Date ? obj.updatedAt : undefined) ?? obj.updated_at;
    const updated = src instanceof Date ? src : new Date(src);
    if (Number.isNaN(updated.getTime())) return 0;
    const now = new Date();
    return Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
  })
  daysSinceUpdate!: number;
}

export class GitHubSearchResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GitHubItemDto)
  @Expose()
  items!: GitHubItemDto[];

  @IsInt()
  @Expose({ name: 'total_count' })
  totalCount!: number;

  @IsBoolean()
  @Expose({ name: 'incomplete_results' })
  incompleteResults!: boolean;
}
