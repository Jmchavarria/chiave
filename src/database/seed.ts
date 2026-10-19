import 'dotenv/config';
import * as argon2 from 'argon2';
import { dataSource } from './data-source';
import type { UserStatus } from '../app/users/domain/types/user-status.type';
import { UserOrmEntity } from '../app/users/infrastructure/persistence/user.orm-entity';

async function seed(): Promise<void> {
  await dataSource.initialize();

  try {
    await dataSource.synchronize();

    const userRepository = dataSource.getRepository(UserOrmEntity);

    const users: {
      name: string;
      email: string;
      password: string;
      status: UserStatus;
      emailVerifiedAt: Date | null;
    }[] = [
      {
        name: 'Administrador de Prueba',
        email: 'admin@example.com',
        password: 'Admin_Test_2026!',
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
      },
      {
        name: 'Usuario de Prueba',
        email: 'usuario@example.com',
        password: 'User_Test_2026!',
        status: 'PENDING_VERIFICATION',
        emailVerifiedAt: null,
      },
    ];

    for (const userData of users) {
      const existingUser = await userRepository.findOneBy({
        email: userData.email,
      });

      if (existingUser) {
        console.log(`El usuario ${userData.email} ya existe.`);
        continue;
      }

      const user = userRepository.create({
        name: userData.name,
        email: userData.email,
        passwordHash: await argon2.hash(userData.password),
        status: userData.status,
        emailVerifiedAt: userData.emailVerifiedAt,
      });

      await userRepository.save(user);

      console.log(`Usuario creado: ${userData.email}`);
    }

    console.log('Base de datos inicializada correctamente.');
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error('Error inicializando la base de datos:', error);
  process.exitCode = 1;
});
