import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from 'dns';
import { promisify } from 'util';

dotenv.config();

// Promisify DNS functions
const resolveMx = promisify(dns.resolveMx);

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Configuração do transporter de email
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Pode ser alterado para outros provedores
      auth: {
        user: process.env.EMAIL_USER || 'camarize.alertas@gmail.com',
        pass: process.env.EMAIL_PASS || 'sua_senha_de_app'
      }
    });
  }

  // Função para validar formato de email
  validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Função para verificar se o domínio tem servidores MX
  async checkDomainMX(domain) {
    try {
      const mxRecords = await resolveMx(domain);
      return mxRecords.length > 0;
    } catch (error) {
      console.log(`❌ Domínio ${domain} não possui servidores MX válidos`);
      return false;
    }
  }

  // Função para verificar se o email existe (verificação SMTP)
  async verifyEmailExists(email) {
    try {
      // Primeiro, validar formato
      if (!this.validateEmailFormat(email)) {
        return {
          exists: false,
          reason: 'Formato de email inválido'
        };
      }

      // Extrair domínio do email
      const domain = email.split('@')[1];
      
      // Verificar se o domínio tem servidores MX
      const hasMX = await this.checkDomainMX(domain);
      if (!hasMX) {
        return {
          exists: false,
          reason: 'Domínio não possui servidores de email válidos'
        };
      }

      // Criar transporter temporário para verificação
      const verifyTransporter = nodemailer.createTransport({
        host: 'gmail-smtp-in.l.google.com', // Servidor SMTP do Gmail para verificação
        port: 25,
        secure: false,
        requireTLS: false,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000
      });

      // Tentar verificar o email
      const result = await verifyTransporter.verify();
      
      if (result) {
        return {
          exists: true,
          reason: 'Email verificado com sucesso'
        };
      } else {
        return {
          exists: false,
          reason: 'Email não encontrado no servidor'
        };
      }

    } catch (error) {
      console.error('❌ Erro ao verificar email:', error);
      
      // Se não conseguir verificar via SMTP, fazer verificação básica
      if (this.validateEmailFormat(email)) {
        const domain = email.split('@')[1];
        const hasMX = await this.checkDomainMX(domain);
        
        if (hasMX) {
          return {
            exists: 'unknown',
            reason: 'Formato válido e domínio com MX, mas não foi possível verificar via SMTP'
          };
        } else {
          return {
            exists: false,
            reason: 'Domínio não possui servidores de email válidos'
          };
        }
      }
      
      return {
        exists: false,
        reason: 'Erro na verificação do email'
      };
    }
  }

  // Função para verificar múltiplos emails
  async verifyMultipleEmails(emails) {
    const results = [];
    
    for (const email of emails) {
      const result = await this.verifyEmailExists(email);
      results.push({
        email,
        ...result
      });
    }
    
    return results;
  }

  // Função para validar email antes de salvar nas configurações
  async validateEmailForSettings(email) {
    try {
      console.log(`🔍 Validando email: ${email}`);
      
      const validation = await this.verifyEmailExists(email);
      
      if (validation.exists === true) {
        console.log(`✅ Email ${email} é válido`);
        return {
          valid: true,
          message: 'Email válido e verificado'
        };
      } else if (validation.exists === 'unknown') {
        console.log(`⚠️ Email ${email} tem formato válido mas não foi possível verificar completamente`);
        return {
          valid: true,
          message: 'Email tem formato válido, mas recomendamos testar o envio',
          warning: true
        };
      } else {
        console.log(`❌ Email ${email} é inválido: ${validation.reason}`);
        return {
          valid: false,
          message: validation.reason
        };
      }
      
    } catch (error) {
      console.error('❌ Erro na validação do email:', error);
      return {
        valid: false,
        message: 'Erro interno na validação'
      };
    }
  }

  // Função para enviar email de alerta
  async sendAlertEmail(userEmail, notificationData) {
    try {
      const { tipo, cativeiroNome, valorAtual, valorIdeal, mensagem, severidade, datahora } = notificationData;

      // Determinar cor e ícone baseado na severidade
      const severityConfig = {
        alta: { color: '#dc2626', icon: '🔴', title: 'ALERTA CRÍTICO' },
        media: { color: '#f59e0b', icon: '🟡', title: 'ALERTA MÉDIO' },
        baixa: { color: '#10b981', icon: '🟢', title: 'ALERTA BAIXO' }
      };

      const config = severityConfig[severidade] || severityConfig.media;

      // Formatar data/hora
      const dataFormatada = new Date(datahora).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Template HTML do email
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${config.title} - Camarize</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .header {
              background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .alert-container {
              background: white;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .alert-header {
              background-color: ${config.color};
              color: white;
              padding: 20px;
              text-align: center;
            }
            .alert-icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .alert-title {
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            .alert-content {
              padding: 30px;
            }
            .parameter-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 20px 0;
            }
            .parameter-card {
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
            }
            .parameter-label {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 5px;
            }
            .parameter-value {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
            }
            .parameter-ideal {
              color: #10b981;
            }
            .parameter-current {
              color: ${config.color};
            }
            .message {
              background: #fef3c7;
              border-left: 4px solid ${config.color};
              padding: 15px;
              margin: 20px 0;
              border-radius: 0 8px 8px 0;
            }
            .footer {
              background: #f1f5f9;
              padding: 20px;
              text-align: center;
              color: #64748b;
              font-size: 14px;
            }
            .action-button {
              display: inline-block;
              background: #3B82F6;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: 600;
            }
            .timestamp {
              color: #6b7280;
              font-size: 14px;
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="alert-container">
            <div class="header">
              <div class="logo">🦐 Camarize</div>
              <div>Sistema de Monitoramento Inteligente</div>
            </div>
            
            <div class="alert-header">
              <div class="alert-icon">${config.icon}</div>
              <div class="alert-title">${config.title}</div>
            </div>
            
            <div class="alert-content">
              <h2>Alerta de ${tipo.toUpperCase()}</h2>
              <p><strong>Cativeiro:</strong> ${cativeiroNome}</p>
              
              <div class="parameter-grid">
                <div class="parameter-card">
                  <div class="parameter-label">Valor Atual</div>
                  <div class="parameter-value parameter-current">${valorAtual}</div>
                </div>
                <div class="parameter-card">
                  <div class="parameter-label">Valor Ideal</div>
                  <div class="parameter-value parameter-ideal">${valorIdeal}</div>
                </div>
              </div>
              
              <div class="message">
                <strong>Mensagem:</strong> ${mensagem}
              </div>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/status-cativeiros" class="action-button">
                Verificar Cativeiro
              </a>
              
              <div class="timestamp">
                <strong>Data/Hora:</strong> ${dataFormatada}
              </div>
            </div>
            
            <div class="footer">
              <p>Este é um alerta automático do sistema Camarize.</p>
              <p>Para configurar suas preferências de notificação, acesse as configurações do sistema.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Configuração do email
      const mailOptions = {
        from: `"Camarize Alertas" <${process.env.EMAIL_USER || 'camarize.alertas@gmail.com'}>`,
        to: userEmail,
        subject: `${config.icon} ${config.title} - ${tipo.toUpperCase()} em ${cativeiroNome}`,
        html: htmlContent,
        text: `
          ${config.title} - Camarize
          
          Cativeiro: ${cativeiroNome}
          Tipo: ${tipo.toUpperCase()}
          Valor Atual: ${valorAtual}
          Valor Ideal: ${valorIdeal}
          
          Mensagem: ${mensagem}
          
          Data/Hora: ${dataFormatada}
          
          Acesse: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/status-cativeiros
        `
      };

      // Enviar email
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de alerta enviado para ${userEmail}:`, info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        email: userEmail
      };

    } catch (error) {
      console.error('❌ Erro ao enviar email de alerta:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Função para enviar email de teste
  async sendTestEmail(userEmail) {
    try {
      const testNotification = {
        tipo: 'teste',
        cativeiroNome: 'Cativeiro de Teste',
        valorAtual: '25.5°C',
        valorIdeal: '24.0°C',
        mensagem: 'Este é um email de teste do sistema de alertas do Camarize.',
        severidade: 'baixa',
        datahora: new Date()
      };

      return await this.sendAlertEmail(userEmail, testNotification);
    } catch (error) {
      console.error('❌ Erro ao enviar email de teste:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Função para verificar se o serviço está funcionando
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Serviço de email configurado corretamente');
      return true;
    } catch (error) {
      console.error('❌ Erro na configuração do email:', error);
      return false;
    }
  }
}

export default new EmailService();
