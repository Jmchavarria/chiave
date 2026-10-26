import { VaultDE } from '../../domain/entities/vault.domain-entity';
import type { VaultItemsOrmEntity } from '../persistence/vault-item.orm-entity';

export class VaultMapper {
  static toDomain(vault: VaultItemsOrmEntity): VaultDE {
    return VaultDE.reconstituite({
      id: vault.id,
      userId: vault.userId,
      folderId: vault.folderId,
      type: vault.type,
      title: vault.title,
      isFavorite: vault.isFavorite,
      notes: vault.notes,
      username: vault.username,
      passwordHash: vault.passwordHash,
      authenticatorKey: vault.authenticatorKey,
      website: vault.website,
      cardholderName: vault.cardholderName,
      brand: vault.brand,
      number: vault.number,
      expMonth: vault.expMonth,
      expYear: vault.expYear,
      cvv: vault.cvv,
      courtesyTitle: vault.courtesyTitle,
      firstName: vault.firstName,
      middleName: vault.middleName,
      lastName: vault.lastName,
      identityUsername: vault.identityUsername,
      company: vault.company,
      ssn: vault.ssn,
      passportNumber: vault.passportNumber,
      licenseNumber: vault.licenseNumber,
      email: vault.email,
      phone: vault.phone,
      address1: vault.address1,
      address2: vault.address2,
      address3: vault.address3,
      city: vault.city,
      state: vault.state,
      postalCode: vault.postalCode,
      country: vault.country,
      publicKey: vault.publicKey,
      privateKey: vault.privateKey,
      fingerPrint: vault.fingerPrint,
      createdAt: vault.createdAt,
      updatedAt: vault.updatedAt,
    });
  }
}
