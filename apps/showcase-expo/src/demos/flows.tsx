import { AuthenticatedHomeFlow } from '@registry/authenticated-home/authenticated-home';
import { useToast } from '@registry/toast/toast';

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function AuthenticatedHomeDemo() {
  const toast = useToast();

  return (
    <AuthenticatedHomeFlow
      className="flex-1"
      userName="Ada"
      onNavigate={(target) => {
        toast.show(`Navigate → ${target}`);
      }}
      onSignOut={async () => {
        await delay(500);
        toast.show('Signed out');
      }}
    />
  );
}
