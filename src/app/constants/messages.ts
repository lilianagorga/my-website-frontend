export const UI_MESSAGES = {
  CONTACT_SUCCESS: 'Messaggio inviato con successo! Ti risponderò al più presto.',
  CONTACT_ERROR: 'Qualcosa è andato storto. Riprova più tardi.',

  LOGIN_REGISTERED: 'Registrazione completata. Effettua il login.',
  LOGIN_ERROR: 'Email o password non validi.',

  REGISTER_SUCCESS: 'Registrazione completata. Ora puoi accedere.',
  REGISTER_FAILED: 'Registrazione non riuscita.',
  REGISTER_ERROR: 'Qualcosa è andato storto. Riprova più tardi.',

  PROJECT_SAVE_ERROR: 'Impossibile salvare il progetto. Verifica i dati (gli URL devono iniziare con http:// o https://).',

  ADMIN_CONFIRM_DELETE_PROJECT: (title: string) => `Eliminare il progetto "${title}"?`,
  ADMIN_CONFIRM_DELETE_MESSAGE: 'Eliminare questo messaggio?',
} as const;
