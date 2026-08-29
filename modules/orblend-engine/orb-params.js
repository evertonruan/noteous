// noteous 2.4.1: now the orb parameters are defined in a single object for better management and scalability.

export const orbParams = {
  done: {
    label: 'Notas Concluídas',
    icon: 'check',
    color: 45,
    hasInput: false,
    order: 0,
    messages: {
    panel: { one: '1 nota concluída', many: '{count} notas concluídas' }
    },
    isCreated: () => true,
  },
  donutdough: {
    label: 'Notas',
    icon: 'article',
    color: 45,
    hasInput: true,
    messages: {
    panel: { one: '1 nota salva', many: '{count} notas salvas' }
    },
    isCreated: () => true,
    isShown: () => true
  },
  link: {
    label: 'Links',
    icon: 'link',
    color: 45,
    hasInput: false,
    messages: {
    panel: { one: '1 link encontrado', many: '{count} links encontrados' }
    }
  }
}