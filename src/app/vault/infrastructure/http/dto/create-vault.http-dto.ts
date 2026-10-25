import {
  IsEnum,
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsUrl,
  IsCreditCard,
  Length,
  Matches,
  IsEmail,
  ValidateIf,
  IsInt,
  Min,
} from 'class-validator';
import { VaultItemEnumType } from '../../../types/vault-item-type.enum';
import { CourtesyTitle } from '../../../types/courtesy-title-type.enum';

export class CreateVaultHttpDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(VaultItemEnumType)
  type: VaultItemEnumType;

  @IsInt()
  @Min(1)
  @IsOptional()
  folderId?: number;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.LOGIN)
  @IsString()
  @IsNotEmpty()
  username?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.LOGIN)
  @IsString()
  @IsNotEmpty()
  password?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.LOGIN)
  @IsString()
  @IsOptional()
  authenticatorKey?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.LOGIN)
  @IsString()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.CARD)
  @IsString()
  @IsNotEmpty()
  cardholderName?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.CARD)
  @IsString()
  @IsOptional()
  brand?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.CARD)
  @IsCreditCard()
  @IsNotEmpty()
  number?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.CARD)
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])$/)
  expMonth?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.CARD)
  @IsString()
  @Matches(/^([0-9]{2}|[0-9]{4})$/)
  expYear?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.CARD)
  @IsString()
  @Length(3, 4)
  @Matches(/^[0-9]{3,4}$/)
  cvv?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsEnum(CourtesyTitle)
  @IsOptional()
  courtesyTitle?: CourtesyTitle;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  firstName?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  middleName?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  lastName?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  identityUsername?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  company?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  ssn?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  passportNumber?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsEmail()
  @IsOptional()
  email?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  phone?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  address1?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  address2?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  address3?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  city?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  state?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.IDENTITY)
  @IsString()
  @IsOptional()
  country?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.SSH_KEY)
  @IsString()
  @IsOptional()
  publicKey?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.SSH_KEY)
  @IsString()
  @IsOptional()
  privateKey?: string;

  @ValidateIf((o: CreateVaultHttpDto) => o.type === VaultItemEnumType.SSH_KEY)
  @IsString()
  @IsOptional()
  fingerPrint?: string;
}
