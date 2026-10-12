import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailServicePort } from '../../../common/email/ports/email-service.port';
import { CustomError } from '../../../common/errors/custom.error';
import { ErrorCode } from '../../../common/errors/error-code-enum';

@Injectable()
export class ResendEmailAdapter extends EmailServicePort {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    super();

    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    this.resend = new Resend(apiKey);
  }

  async sendVerificationEmail(params: { to: string; name: string; token: string }): Promise<void> {
    const from = this.configService.get<string>('RESEND_FROM_EMAIL');

    if (!from) {
      throw new CustomError({
        code: ErrorCode.internal_server_error,
        message: 'RESEND_FROM_EMAIL is not configured',
      });
    }

    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL').replace(/\/+$/, '');

    const verificationUrl = `${frontendUrl}/auth/verify-email?token=${encodeURIComponent(params.token)}`;

    const result = await this.resend.emails.send({
      from,
      to: params.to,
      subject: 'Verifica tu cuenta de Chiave',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;">
          <h1>¡Bienvenido a Chiave!</h1>
          <p>Hola ${this.escapeHtml(params.name)},</p>
          <p>Para verificar tu correo electrónico, haz clic en el siguiente enlace:</p>
          <p>
            <a href="${this.escapeHtml(verificationUrl)}">
              Verificar mi correo
            </a>
          </p>
          <p>Este enlace caduca en 30 minutos.</p>
          <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
        </div>
      `,
      text: [
        `Hola ${params.name},`,
        'Verifica tu cuenta de Chiave usando este enlace:',
        verificationUrl,
        'Este enlace caduca en 30 minutos.',
      ].join('\n\n'),
    });

    if (result.error) {
      throw new Error(`No se pudo enviar el correo de verificación: ${result.error.message}`);
    }
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };

      return entities[character];
    });
  }
}
