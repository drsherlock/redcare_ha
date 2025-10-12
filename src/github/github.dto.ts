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
  login!: string;

  @IsInt()
  id!: number;
}

export class GitHubItemDto {
  @IsInt()
  id!: number;

  @IsString()
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
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GitHubOwnerDto)
  @NullToUndefined()
  owner?: GitHubOwnerDto;

  @IsOptional()
  @IsString()
  @NullToUndefined()
  language?: string;

  @IsInt()
  @Expose({ name: 'stargazers_count' })
  stargazersCount!: number;

  @IsInt()
  @Expose({ name: 'forks_count' })
  forksCount!: number;

  @IsDate()
  @Expose({ name: 'created_at' })
  createdAt!: Date;

  @IsDate()
  @Expose({ name: 'updated_at' })
  updatedAt!: Date;

  @IsDate()
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
  recencyDays!: number;
}

export class GitHubSearchResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GitHubItemDto)
  items!: GitHubItemDto[];

  @IsInt()
  @Expose({ name: 'total_count' })
  totalCount!: number;

  @IsBoolean()
  @Expose({ name: 'incomplete_results' })
  incompleteResults!: boolean;
}
