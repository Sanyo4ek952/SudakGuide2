import { adminFeature } from '@/features';
import { prisma } from '@/shared/lib';

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const adminId = typeof query.adminId === 'string' ? query.adminId : '';

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Админ: пользователи</h1>
      <p className="mt-2 text-slate-600">Передайте ?adminId=... для выполнения действий администратора в MVP режиме.</p>

      <div className="mt-4 grid gap-4">
        {users.map((user) => (
          <article key={user.id} className="rounded border bg-white p-4">
            <p className="font-medium">{user.email}</p>
            <p className="text-sm text-slate-600">Role: {user.role}</p>
            <p className="text-sm text-slate-600">chatId: {user.telegramChatId ?? '—'}</p>

            <form className="mt-3 flex flex-wrap items-center gap-2" action={adminFeature.setUserRoleAction}>
              <input type="hidden" name="adminId" value={adminId} />
              <input type="hidden" name="userId" value={user.id} />
              <select name="role" defaultValue={user.role} className="rounded border p-2">
                <option value="USER">USER</option>
                <option value="HOST">HOST</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">
                Обновить роль
              </button>
            </form>

            {user.role === 'HOST' && (
              <form className="mt-3 flex flex-wrap items-center gap-2" action={adminFeature.setHostChatIdAction}>
                <input type="hidden" name="adminId" value={adminId} />
                <input type="hidden" name="userId" value={user.id} />
                <input
                  type="text"
                  name="telegramChatId"
                  defaultValue={user.telegramChatId ?? ''}
                  placeholder="telegram chat id"
                  className="rounded border p-2"
                />
                <button className="rounded bg-blue-700 px-3 py-2 text-white" type="submit">
                  Сохранить chatId
                </button>
              </form>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
