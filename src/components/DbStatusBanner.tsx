import { useAuth } from '../context/AuthContext';
import { AlertTriangle, ExternalLink } from 'lucide-react';

const SQL_EDITOR =
  'https://supabase.com/dashboard/project/ijvjfrffozcyudxdagji/sql/new';

export default function DbStatusBanner() {
  const { dbError, authReady } = useAuth();
  if (!authReady || !dbError) return null;

  const missingTable =
    dbError.includes('Could not find the table') ||
    dbError.includes('schema cache') ||
    dbError.includes('PGRST205') ||
    dbError.includes('members');

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-2xl rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-lg">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <div className="space-y-2 text-sm text-amber-950">
          <p className="font-semibold">
            {missingTable
              ? 'Supabase tables are not set up yet'
              : 'Supabase connection issue'}
          </p>
          <p className="text-amber-800">
            {missingTable
              ? 'Run supabase/schema.sql once in the SQL Editor — then members can login from any browser.'
              : dbError}
          </p>
          <a
            href={SQL_EDITOR}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
          >
            Open Supabase SQL Editor
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
