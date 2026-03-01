import { adminFeature } from '@/features';
import { prisma, requireCurrentRole } from '@/shared/lib';

export default async function AdminUsersPage() {
  const access = await requireCurrentRole('ADMIN');
  if (!access.ok) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Админ: пользователи</h1>
        <p className="mt-2 text-rose-700">{access.message}</p>
      </main>
    );
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Админ: пользователи</h1>
      <div className="mt-4 grid gap-4">
        {users.map((user) => (
          <article key={user.id} className="rounded border bg-white p-4">
            <p className="font-medium">{user.email}</p>
            <p className="text-sm text-slate-600">Role: {user.role}</p>
            <p className="text-sm text-slate-600">chatId: {user.telegramChatId ?? '—'}</p>

            <form className="mt-3 flex flex-wrap items-center gap-2" action={adminFeature.setUserRoleAction}>
              <input type="hidden" name="userId" value={user.id} />
              <select name="role" defaultValue={user.role} className="rounded border p-2">
                <option value="USER">USER</option>
                <option value="HOST">HOST</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">Обновить роль</button>
            </form>

            {user.role === 'HOST' && (
              <form className="mt-3 flex flex-wrap items-center gap-2" action={adminFeature.setHostChatIdAction}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="text" name="telegramChatId" defaultValue={user.telegramChatId ?? ''} placeholder="telegram chat id" className="rounded border p-2" />
                <button className="rounded bg-blue-700 px-3 py-2 text-white" type="submit">Сохранить chatId</button>
              </form>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
