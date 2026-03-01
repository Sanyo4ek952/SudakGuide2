import { serverEnv } from '@/shared/config';

export async function sendTelegramMessage(chatId: string, text: string) {
  if (!serverEnv.TELEGRAM_BOT_TOKEN) {
    return { ok: false, reason: 'TELEGRAM_BOT_TOKEN is not set' } as const;
  }

  const response = await fetch(`https://api.telegram.org/bot${serverEnv.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    return { ok: false, reason: `telegram request failed: ${response.status}` } as const;
  }

  return { ok: true } as const;
}
