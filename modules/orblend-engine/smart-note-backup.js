// ✨ Smart Note Backup
// Used in 'load' Orblend Engine context

export function smartNoteBackup(noteousSettings, writeInput, writeButtonDismiss, onRestore) {
    if (!noteousSettings) return
    if (noteousSettings.input != '' && noteousSettings.noteId == 0) {
        if (typeof onRestore === 'function') onRestore()
        if (writeInput) {
            writeInput.value = noteousSettings.input
        }
        if (writeButtonDismiss) writeButtonDismiss.classList.remove('hidden-element')
    }
}