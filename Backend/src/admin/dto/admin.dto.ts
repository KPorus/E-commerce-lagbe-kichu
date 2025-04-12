import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { AccountStatus, UserRole } from 'src/schema/users';

export class GetUsersQueryDto {
  @IsOptional()
  // @IsEnum(UserRole)
  role?: UserRole | string;

  @IsOptional()
  // @IsEnum(AccountStatus)
  status?: AccountStatus | string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number = 10;
}
