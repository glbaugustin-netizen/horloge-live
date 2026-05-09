export interface SessionRecord {
  type: 'chrono' | 'minuteur';
  duration: number;
  laps: Array<{ lap: number; lapTime: number; totalTime: number }> | null;
}

export interface SessionDoc extends SessionRecord {
  id: string;
  date: Date;
}

const MAX_SESSIONS = 50;

export async function saveSession(session: SessionRecord): Promise<void> {
  try {
    const { auth, db } = await import('@/lib/firebase');
    const user = auth.currentUser;
    if (!user) return;

    const { collection, addDoc, getDocs, query, orderBy, deleteDoc, Timestamp } =
      await import('firebase/firestore');

    const colRef = collection(db, 'users', user.uid, 'history');
    await addDoc(colRef, { ...session, date: Timestamp.now() });

    // Trim to MAX_SESSIONS — delete oldest beyond limit
    const snap = await getDocs(query(colRef, orderBy('date', 'asc')));
    if (snap.size > MAX_SESSIONS) {
      await Promise.all(
        snap.docs.slice(0, snap.size - MAX_SESSIONS).map(d => deleteDoc(d.ref)),
      );
    }
  } catch (e) {
    console.error('[useHistory] saveSession error:', e);
  }
}

export async function fetchHistory(): Promise<SessionDoc[]> {
  try {
    const { auth, db } = await import('@/lib/firebase');
    const user = auth.currentUser;
    if (!user) return [];

    const { collection, getDocs, query, orderBy, limit } =
      await import('firebase/firestore');

    const colRef = collection(db, 'users', user.uid, 'history');
    const snap = await getDocs(query(colRef, orderBy('date', 'desc'), limit(10)));

    return snap.docs.map(d => {
      const data = d.data();
      const ts = data.date as { toDate?: () => Date };
      return {
        id:       d.id,
        type:     data.type     as 'chrono' | 'minuteur',
        duration: data.duration as number,
        date:     ts?.toDate ? ts.toDate() : new Date(),
        laps:     data.laps ?? null,
      };
    });
  } catch (e) {
    console.error('[useHistory] fetchHistory error:', e);
    return [];
  }
}
