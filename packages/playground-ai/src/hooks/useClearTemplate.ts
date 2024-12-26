import { useTemplateStore } from '@/lib/models/template';
import { useEffect } from 'react';

export function useClearTemplate() {
  const clearTemplate = useTemplateStore((state) => state.clearTemplate);
  useEffect(() => {
    return () => {
      clearTemplate();
    };
  }, [clearTemplate]);
}
