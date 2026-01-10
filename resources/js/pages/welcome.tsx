import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type SharedData } from '@/types';

const UID_REGEX = /^SDC-[A-Z]{2,5}-\d{4}-\d{4}-[A-Z]-\d+$/;

export default function Welcome({ canRegister = false }: { canRegister?: boolean }) {
  const { auth } = usePage<SharedData>().props;

  const { data, setData, post, processing, errors, reset } = useForm({
    uid: '',
  });

  const normalizedUid = useMemo(
    () => data.uid.trim().toUpperCase(),
    [data.uid]
  );

  const isValidUid = UID_REGEX.test(normalizedUid);

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!isValidUid || processing) return;
    post('/certificate'); 
  }

  return (
    <>
      <Head title="Verify Certificate" />

      <main className="flex min-h-screen items-center justify-center bg-[#FDFDFC] p-6 dark:bg-[#0a0a0a]">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl dark:bg-[#0f0f0f]">
          <h1 className="mb-6 text-center text-2xl font-semibold">
            Verify Your Certificate
          </h1>

          <form onSubmit={submit} className="space-y-4">
            <Input
              value={data.uid}
              onChange={(e) => setData('uid', e.target.value)}
              placeholder="SDC-DGM-2506-0001-M-12"
              autoComplete="off"
              spellCheck={false}
              required
            />

            {!isValidUid && data.uid.length > 0 && (
              <p className="text-sm text-red-500">
                Invalid certificate format
              </p>
            )}

            {errors.uid && (
              <p className="text-sm text-red-500">{errors.uid}</p>
            )}

            <Button
              type="submit"
              disabled={!isValidUid || processing}
              className="w-full"
            >
              {processing ? 'Verifying…' : 'Verify Certificate'}
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
